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
) {
  const idempotencyKey = `${transactionId}:${gateType}`;
  const existing = await db
    .from("token_entries")
    .select("id")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (existing.error) throw new SpineError("DB_ERROR", existing.error.message);
  if (existing.data) return existing.data.id as string;

  const tokens = gateType === "POI" ? POI_TOKENS : WAD_TOKENS;
  const usd = gateType === "POI" ? POI_USD : WAD_USD;
  const wallet = await walletLedger(db, workspaceId);
  if (wallet.balance < tokens) {
    throw new SpineError(
      "INSUFFICIENT_TOKENS",
      `${gateType} requires ${tokens} token(s) ($${usd}). Wallet balance: ${wallet.balance}.`,
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
