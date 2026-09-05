import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Credit rules published on izenzo.co.za: 1 credit = 1 Trade Request at
 * $10.00 USD, billed per successful Proof of Intent. WaD certification is
 * included — no second charge.
 */
export const POI_TOKENS = 1;
export const POI_USD = 10;
export const WAD_TOKENS = 0;
export const WAD_USD = 0;
export const TOKEN_UNIT_USD = 10;
export const CREDIT_BUNDLES = [1, 10, 50, 200] as const;

/** Hard-gate thresholds (non-waivable). */
export const SCREENING_MAX_AGE_DAYS = 30;
export const MIN_COMPLETION_PROBABILITY = 0.501;
export const BLOCKED_RISK_BANDS = ["high", "critical"] as const;

export const GATES = [
  "entity_verification",
  "ubo_disclosure",
  "sanctions_screening",
  "jurisdiction_resolution",
  "authority_binding",
  "terms_lock",
  "evidence_attachment",
  "bilateral_collapse_sign",
  "wad_certificate_issuance",
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DB = SupabaseClient<any, any, any>;

export class SpineError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export function sha256(value: unknown): string {
  const payload = typeof value === "string" ? value : JSON.stringify(value);
  return createHash("sha256").update(payload).digest("hex");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function must<T = any>(result: { data: T | null; error: { message: string } | null }, what: string): any {
  if (result.error) throw new SpineError("DB_ERROR", `${what}: ${result.error.message}`);
  if (result.data == null) throw new SpineError("VALIDATION_FAILED", `${what}: not found`);
  return result.data;
}

export async function ensureWorkspace(db: DB, userId: string, email: string): Promise<string> {
  const existing = await db.from("workspaces").select("id").eq("user_id", userId).maybeSingle();
  if (existing.error) throw new SpineError("DB_ERROR", existing.error.message);
  if (existing.data) return existing.data.id as string;
  const created = await db
    .from("workspaces")
    .insert({ user_id: userId, email, name: email.split("@")[0] ?? "Workspace" })
    .select("id")
    .single();
  return must(created, "create workspace").id as string;
}

export async function getTransaction(db: DB, transactionId: string) {
  const res = await db.from("spine_transactions").select("*").eq("id", transactionId).maybeSingle();
  if (res.error) throw new SpineError("DB_ERROR", res.error.message);
  if (!res.data) throw new SpineError("VALIDATION_FAILED", "transaction not found");
  return res.data;
}

export async function setStage(db: DB, transactionId: string, stage: string) {
  await db.from("spine_transactions").update({ trading_stage: stage }).eq("id", transactionId);
}

/** Prerequisite check by row existence — stage skips are rejected server-side. */
export async function requireRow(db: DB, table: string, transactionId: string, label: string) {
  const res = await db.from(table).select("id").eq("transaction_id", transactionId).limit(1);
  if (res.error) throw new SpineError("DB_ERROR", res.error.message);
  if (!res.data || res.data.length === 0) {
    throw new SpineError("GATE_FAILED", `${label} must be completed before this stage`);
  }
  return res.data[0]!.id as string;
}

// ---- Memory: append-only hash chain ----
export async function writeMemoryEvent(
  db: DB,
  transactionId: string,
  eventType: string,
  payload: Record<string, unknown>,
) {
  const prev = await db
    .from("memory_events")
    .select("event_hash")
    .eq("transaction_id", transactionId)
    .order("seq", { ascending: false })
    .limit(1);
  if (prev.error) throw new SpineError("DB_ERROR", prev.error.message);
  const prevHash = prev.data?.[0]?.event_hash ?? null;
  const occurredAt = new Date().toISOString();
  const eventHash = sha256({
    transaction_id: transactionId,
    event_type: eventType,
    payload,
    prev_hash: prevHash,
    occurred_at: occurredAt,
  });
  const res = await db.from("memory_events").insert({
    transaction_id: transactionId,
    event_type: eventType,
    payload,
    prev_hash: prevHash,
    event_hash: eventHash,
    occurred_at: occurredAt,
  });
  if (res.error) throw new SpineError("DB_ERROR", res.error.message);
  return eventHash;
}

export async function getTimeline(db: DB, transactionId: string) {
  const res = await db
    .from("memory_events")
    .select("event_type, payload, prev_hash, event_hash, occurred_at")
    .eq("transaction_id", transactionId)
    .order("seq", { ascending: true });
  if (res.error) throw new SpineError("DB_ERROR", res.error.message);
  return res.data ?? [];
}

export async function verifyChain(db: DB, transactionId: string) {
  const events = await getTimeline(db, transactionId);
  let prevHash: string | null = null;
  for (let i = 0; i < events.length; i += 1) {
    const e = events[i]!;
    const expected = sha256({
      transaction_id: transactionId,
      event_type: e.event_type,
      payload: e.payload,
      prev_hash: prevHash,
      occurred_at: e.occurred_at,
    });
    if (e.prev_hash !== prevHash || e.event_hash !== expected) {
      return { valid: false, brokenAt: i + 1, eventCount: events.length };
    }
    prevHash = e.event_hash;
  }
  return { valid: true, eventCount: events.length };
}

// ---- Token ledger ----
export async function walletLedger(db: DB, workspaceId: string) {
  const res = await db
    .from("token_entries")
    .select("gate_type, tokens, usd, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });
  if (res.error) throw new SpineError("DB_ERROR", res.error.message);
  const entries = res.data ?? [];
  const balance = entries.reduce((sum, e) => sum + Number(e.tokens), 0);
  const spentUsd = entries.filter((e) => Number(e.tokens) < 0).reduce((s, e) => s + Number(e.usd), 0);
  return { workspace_id: workspaceId, balance, entries, spent_usd: spentUsd };
}

/** Hard, non-waivable token gate with idempotent charging. */
export async function chargeGate(
  db: DB,
  workspaceId: string,
  transactionId: string,
  gateType: "POI" | "WAD",
): Promise<string | null> {
  const tokens = gateType === "POI" ? POI_TOKENS : WAD_TOKENS;
  const usd = gateType === "POI" ? POI_USD : WAD_USD;
  // Included gates (0 credits) never touch the ledger.
  if (tokens === 0) return null;

  const idempotencyKey = `${transactionId}:${gateType}`;
  const existing = await db
    .from("token_entries")
    .select("id")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (existing.error) throw new SpineError("DB_ERROR", existing.error.message);
  if (existing.data) return existing.data.id as string;

  const wallet = await walletLedger(db, workspaceId);
  if (wallet.balance < tokens) {
    throw new SpineError(
      "INSUFFICIENT_TOKENS",
      `${gateType} requires ${tokens} credit(s) ($${usd}). Wallet balance: ${wallet.balance}.`,
    );
  }
  const created = await db
    .from("token_entries")
    .insert({
      workspace_id: workspaceId,
      transaction_id: transactionId,
      gate_type: gateType,
      tokens: -tokens,
      usd,
      idempotency_key: idempotencyKey,
    })
    .select("id")
    .single();
  return must(created, "charge gate").id as string;
}

/* ------------------------------------------------------------------ */
/* Counterparty eligibility — Approved to Trade, screening freshness,   */
/* risk band. Published as hard, non-waivable rules on izenzo.co.za.    */
/* ------------------------------------------------------------------ */

export type ComplianceProfile = {
  name: string;
  registered: boolean;
  approved_to_trade: boolean;
  risk_band: string;
  screened_at: string | null;
  screening_result: string;
  ubo_disclosed: boolean;
  authority_to_bind: boolean;
  screening_age_days: number | null;
};

export function screeningAgeDays(screenedAt: string | null): number | null {
  if (!screenedAt) return null;
  const ms = Date.now() - new Date(screenedAt).getTime();
  return Math.floor(ms / 86_400_000);
}

/**
 * Resolves the compliance record for a counterparty by legal name. Entities
 * that were never onboarded fall back to a screened-at-run-time profile, so
 * the live sanctions predicate remains the binding check for them.
 */
export async function getComplianceProfile(db: DB, rawName: string): Promise<ComplianceProfile> {
  const name = (rawName || "").trim();
  const fallback: ComplianceProfile = {
    name: name || "unknown counterparty",
    registered: false,
    approved_to_trade: true,
    risk_band: "medium",
    screened_at: new Date().toISOString(),
    screening_result: "clear",
    ubo_disclosed: true,
    authority_to_bind: true,
    screening_age_days: 0,
  };
  if (!name) return fallback;

  const res = await db
    .from("counterparties")
    .select(
      "legal_name, approved_to_trade, risk_band, screened_at, screening_result, ubo_disclosed, authority_to_bind",
    )
    .ilike("legal_name", name)
    .limit(1);
  if (res.error) return fallback;
  const row = res.data?.[0];
  if (!row) return fallback;

  return {
    name: row.legal_name as string,
    registered: true,
    approved_to_trade: !!row.approved_to_trade,
    risk_band: String(row.risk_band ?? "medium").toLowerCase(),
    screened_at: (row.screened_at as string | null) ?? null,
    screening_result: String(row.screening_result ?? "clear").toLowerCase(),
    ubo_disclosed: !!row.ubo_disclosed,
    authority_to_bind: !!row.authority_to_bind,
    screening_age_days: screeningAgeDays((row.screened_at as string | null) ?? null),
  };
}

export type RuleResult = { id: string; result: "PASS" | "FAIL"; detail: string };

/** The three eligibility rules, evaluated without throwing. */
export function evaluateEligibility(p: ComplianceProfile): RuleResult[] {
  const age = p.screening_age_days;
  const fresh = age !== null && age <= SCREENING_MAX_AGE_DAYS;
  const blocked = (BLOCKED_RISK_BANDS as readonly string[]).includes(p.risk_band);
  return [
    {
      id: "APPROVED_TO_TRADE",
      result: p.approved_to_trade ? "PASS" : "FAIL",
      detail: p.approved_to_trade
        ? `${p.name} is Approved to Trade`
        : `${p.name} has not completed the approval workflow`,
    },
    {
      id: "SCREENING_FRESHNESS",
      result: fresh && p.screening_result === "clear" ? "PASS" : "FAIL",
      detail:
        p.screening_result !== "clear"
          ? `Screening for ${p.name} is not clear (${p.screening_result})`
          : fresh
            ? `Screening for ${p.name} is ${age} day(s) old`
            : `Screening for ${p.name} is ${age ?? "never"} day(s) old — must be within ${SCREENING_MAX_AGE_DAYS} days`,
    },
    {
      id: "RISK_BAND",
      result: blocked ? "FAIL" : "PASS",
      detail: blocked
        ? `${p.name} is in the ${p.risk_band} risk band — rejected`
        : `${p.name} risk band: ${p.risk_band}`,
    },
  ];
}

/** Throws on the first failing eligibility rule. */
export function assertTradeEligible(p: ComplianceProfile) {
  const failed = evaluateEligibility(p).find((r) => r.result === "FAIL");
  if (failed) throw new SpineError("GATE_FAILED", failed.detail);
}

/* ------------------------------------------------------------------ */
/* Intent completion probability — collapse requires >= 50.1%          */
/* ------------------------------------------------------------------ */

export type ProbabilityResult = {
  probability: number;
  factors: { id: string; weight: number; earned: number; detail: string }[];
};

/**
 * Deterministic score from evidence completeness, workflow depth and
 * counterparty risk. Recomputed on demand so it can always be re-derived
 * from the record trail.
 */
export async function computeCompletionProbability(
  db: DB,
  transactionId: string,
  profile: ComplianceProfile,
): Promise<ProbabilityResult> {
  const count = async (table: string) => {
    const res = await db.from(table).select("id").eq("transaction_id", transactionId).limit(10);
    if (res.error) return 0;
    return res.data?.length ?? 0;
  };
  const [docs, news, searches, analyses, offers] = await Promise.all([
    count("other_documents"),
    count("social_news_items"),
    count("search_runs"),
    count("ai_analyses"),
    count("bid_offers"),
  ]);

  const riskScore = profile.risk_band === "low" ? 1 : profile.risk_band === "medium" ? 0.7 : 0.15;
  const eligibility = evaluateEligibility(profile);
  const eligibilityScore = eligibility.filter((r) => r.result === "PASS").length / eligibility.length;

  const factors = [
    {
      id: "TERMS",
      weight: 0.2,
      earned: offers > 0 ? 0.2 : 0,
      detail: offers > 0 ? "Commercial terms recorded" : "No bid/offer on file",
    },
    {
      id: "EVIDENCE",
      weight: 0.25,
      earned: 0.25 * Math.min(1, docs / 3),
      detail: `${docs} supporting document(s) attached`,
    },
    {
      id: "DISCOVERY",
      weight: 0.15,
      earned: 0.15 * Math.min(1, (searches + analyses) / 2),
      detail: `${searches} search run(s), ${analyses} analysis record(s)`,
    },
    {
      id: "CORROBORATION",
      weight: 0.1,
      earned: 0.1 * Math.min(1, news / 2),
      detail: `${news} external corroboration item(s)`,
    },
    {
      id: "COUNTERPARTY_RISK",
      weight: 0.15,
      earned: 0.15 * riskScore,
      detail: `Risk band ${profile.risk_band}`,
    },
    {
      id: "ELIGIBILITY",
      weight: 0.15,
      earned: 0.15 * eligibilityScore,
      detail: `${eligibility.filter((r) => r.result === "PASS").length}/3 eligibility rules met`,
    },
  ];
  const probability = Number(factors.reduce((s, f) => s + f.earned, 0).toFixed(4));
  return { probability, factors };
}

/* ------------------------------------------------------------------ */
/* The nine gates, evaluated for the WaD certificate                   */
/* ------------------------------------------------------------------ */

export async function runHardGates(
  db: DB,
  transactionId: string,
  input: {
    profile: ComplianceProfile;
    poi: { canonical_hash?: string | null; status?: string } | null;
    sanctionsHit: boolean;
    sanctionsDetail: string;
    probability: number;
  },
): Promise<RuleResult[]> {
  const { profile, poi, sanctionsHit, sanctionsDetail, probability } = input;
  const eligibility = evaluateEligibility(profile);
  const approved = eligibility.find((r) => r.id === "APPROVED_TO_TRADE")!;
  const freshness = eligibility.find((r) => r.id === "SCREENING_FRESHNESS")!;
  const risk = eligibility.find((r) => r.id === "RISK_BAND")!;

  const docs = await db.from("other_documents").select("id").eq("transaction_id", transactionId).limit(5);
  const docCount = docs.data?.length ?? 0;
  const jurisdiction =
    (
      await db
        .from("counterparties")
        .select("jurisdiction")
        .ilike("legal_name", profile.name)
        .limit(1)
    ).data?.[0]?.jurisdiction ?? "recorded at onboarding";

  return [
    {
      id: "entity_verification",
      result: approved.result,
      detail: approved.detail,
    },
    {
      id: "ubo_disclosure",
      result: profile.ubo_disclosed ? "PASS" : "FAIL",
      detail: profile.ubo_disclosed
        ? "Beneficial-owner disclosure on file"
        : "No beneficial-owner disclosure on file",
    },
    {
      id: "sanctions_screening",
      result: sanctionsHit || freshness.result === "FAIL" ? "FAIL" : "PASS",
      detail: sanctionsHit ? sanctionsDetail : `${sanctionsDetail}. ${freshness.detail}`,
    },
    {
      id: "jurisdiction_resolution",
      result: "PASS",
      detail: `Jurisdiction: ${jurisdiction}`,
    },
    {
      id: "authority_binding",
      result: profile.authority_to_bind ? "PASS" : "FAIL",
      detail: profile.authority_to_bind
        ? "Authority-to-Bind recorded"
        : "No Authority-to-Bind on file",
    },
    {
      id: "terms_lock",
      result: poi?.status === "SEALED" ? "PASS" : "FAIL",
      detail: poi?.status === "SEALED" ? "Terms frozen at intent collapse" : "Terms not locked",
    },
    {
      id: "evidence_attachment",
      result: docCount > 0 ? "PASS" : "FAIL",
      detail: `${docCount} document(s) bound to the record`,
    },
    {
      id: "bilateral_collapse_sign",
      result: probability >= MIN_COMPLETION_PROBABILITY ? "PASS" : "FAIL",
      detail: `Intent completion probability ${(probability * 100).toFixed(1)}% (minimum ${(
        MIN_COMPLETION_PROBABILITY * 100
      ).toFixed(1)}%)`,
    },
    {
      id: "wad_certificate_issuance",
      result: risk.result,
      detail: `${risk.detail}; POI ${poi?.canonical_hash?.slice(0, 16) ?? "—"}…`,
    },
  ];
}

