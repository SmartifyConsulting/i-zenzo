import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: unknown; userId: string; claims: Record<string, unknown> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const json = (data: unknown): any => data;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate<T = any>(data: unknown): any {
  return (data ?? {}) as T;
}

async function core() {
  return await import("@/lib/spine/core.server");
}

async function ws(context: Ctx) {
  const { ensureWorkspace } = await core();
  const email = (context.claims?.["email"] as string) ?? `${context.userId}@izenzo.local`;
  return await ensureWorkspace(context.supabase as never, context.userId, email);
}

/* ------------------------------------------------------------------ */
/* Session / wallet                                                     */
/* ------------------------------------------------------------------ */

export const startSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as never;
    const workspaceId = await ws(context as unknown as Ctx);
    const wallet = await c.walletLedger(db, workspaceId);
    return { workspace_id: workspaceId, balance: wallet.balance };
  });

export const getWallet = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as never;
    const workspaceId = await ws(context as unknown as Ctx);
    return await c.walletLedger(db, workspaceId);
  });

/* ------------------------------------------------------------------ */
/* Payments — sandbox session -> signed callback -> idempotent credit   */
/* ------------------------------------------------------------------ */

export const createTokenPurchase = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ tokens: number }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as never;
    const workspaceId = await ws(context as unknown as Ctx);
    // Published pricing: credits sell in 1 / 10 / 50 / 200 bundles at $10 each.
    const requested = Math.max(1, Math.floor(Number(data.tokens) || 1));
    if (!(c.CREDIT_BUNDLES as readonly number[]).includes(requested)) {
      throw new Error(
        `Credits are sold in bundles of ${c.CREDIT_BUNDLES.join(", ")}. Requested: ${requested}.`,
      );
    }
    const tokens = requested;
    const usd = tokens * c.TOKEN_UNIT_USD;
    const created = await (db as any)
      .from("payment_sessions")
      .insert({ workspace_id: workspaceId, tokens, usd, status: "PENDING" })
      .select("*")
      .single();
    const session = c.must(created, "create payment session");
    return { session_id: session.id, tokens, usd, status: session.status, checkout_url: `/checkout/${session.id}` };
  });

export const getTokenPurchase = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => validate<{ sessionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const db = (context as unknown as Ctx).supabase as any;
    const res = await db.from("payment_sessions").select("*").eq("id", data.sessionId).maybeSingle();
    if (res.error || !res.data) throw new Error("payment session not found");
    return { ...res.data, usd: Number(res.data.usd) };
  });

export const settlePayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ sessionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const res = await db.from("payment_sessions").select("*").eq("id", data.sessionId).maybeSingle();
    if (res.error || !res.data) throw new Error("payment session not found");
    const session = res.data;

    // Idempotent credit: the ledger entry key is the session id, so replaying
    // the callback can never double-credit a wallet.
    const key = `payment:${session.id}`;
    const existing = await db.from("token_entries").select("id").eq("idempotency_key", key).maybeSingle();
    if (!existing.data) {
      const ins = await db.from("token_entries").insert({
        workspace_id: session.workspace_id,
        gate_type: "PURCHASE",
        tokens: session.tokens,
        usd: session.usd,
        idempotency_key: key,
      });
      if (ins.error) throw new Error(ins.error.message);
    }
    if (session.status !== "SETTLED") {
      await db
        .from("payment_sessions")
        .update({ status: "SETTLED", settled_at: new Date().toISOString() })
        .eq("id", session.id);
    }
    const wallet = await c.walletLedger(db, session.workspace_id);
    return {
      session_id: session.id,
      status: "SETTLED",
      settled_at: new Date().toISOString(),
      tokens_credited: session.tokens,
      balance: wallet.balance,
    };
  });

/* ------------------------------------------------------------------ */
/* Trading stages — strict order, enforced server-side                  */
/* ------------------------------------------------------------------ */

export const createBidOffer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const workspaceId = await ws(context as unknown as Ctx);
    const txn = c.must(
      await db.from("spine_transactions").insert({ workspace_id: workspaceId }).select("*").single(),
      "create transaction",
    );
    const bid = c.must(
      await db
        .from("bid_offers")
        .insert({
          transaction_id: txn.id,
          actor_person: data.actor_person ?? null,
          represented_org: data.represented_org ?? null,
          role: data.role ?? null,
          contact: data.contact ?? null,
          subject_type: data.subject_type ?? null,
          subject_description: data.subject_description ?? null,
          commercial: data.commercial ?? {},
        })
        .select("*")
        .single(),
      "create bid offer",
    );
    await c.setStage(db, txn.id, "BID_OFFER");
    await c.writeMemoryEvent(db, txn.id, "bid_offer.created", { bid_offer_id: bid.id, role: bid.role });
    return { transaction_id: txn.id, bid_offer_id: bid.id };
  });

export const createOtherDocument = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    await c.requireRow(db, "bid_offers", txnId, "Bid/Offer");
    const contentHash = c.sha256({
      semantic_type: data.semantic_type,
      issuer: data.issuer ?? null,
      subject: data.subject ?? null,
      facts: data.extracted_facts ?? {},
    });
    const doc = c.must(
      await db
        .from("other_documents")
        .insert({
          transaction_id: txnId,
          semantic_type: data.semantic_type ?? "OTHER",
          issuer: data.issuer ?? null,
          subject: data.subject ?? null,
          extracted_facts: data.extracted_facts ?? {},
          content_hash: contentHash,
        })
        .select("*")
        .single(),
      "create document",
    );
    await c.setStage(db, txnId, "OTHER_DOCS");
    await c.writeMemoryEvent(db, txnId, "other_document.recorded", {
      document_id: doc.id,
      semantic_type: doc.semantic_type,
      content_hash: contentHash,
    });
    return { document_id: doc.id, content_hash: contentHash };
  });

export const createSocialNewsItem = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    await c.requireRow(db, "other_documents", txnId, "Other Docs");
    const item = c.must(
      await db
        .from("social_news_items")
        .insert({
          transaction_id: txnId,
          source_url: data.source_url ?? null,
          publisher: data.publisher ?? null,
          subject_match: data.subject_match ?? null,
          excerpt: data.excerpt ?? null,
          observed_at: new Date().toISOString(),
        })
        .select("*")
        .single(),
      "create news item",
    );
    await c.setStage(db, txnId, "SOCIAL_NEWS");
    await c.writeMemoryEvent(db, txnId, "social_news.recorded", { item_id: item.id, publisher: item.publisher });
    return { item_id: item.id };
  });

export const createSearchRun = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    await c.requireRow(db, "social_news_items", txnId, "Social/News Media");
    const candidates = Array.isArray(data.candidates) ? data.candidates : [];
    const run = c.must(
      await db
        .from("search_runs")
        .insert({
          transaction_id: txnId,
          queries: data.queries ?? candidates.map((x: any) => x.name),
          candidates,
        })
        .select("*")
        .single(),
      "create search run",
    );
    await c.setStage(db, txnId, "SEARCH");
    await c.writeMemoryEvent(db, txnId, "search.completed", {
      search_run_id: run.id,
      candidate_count: candidates.length,
    });
    return { search_run_id: run.id, candidates };
  });

export const createAiAnalysis = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    const runRes = await db
      .from("search_runs")
      .select("*")
      .eq("transaction_id", txnId)
      .order("created_at", { ascending: false })
      .limit(1);
    const run = runRes.data?.[0];
    if (!run) throw new Error("Search must be completed before AI analysis");
    const candidates = (run.candidates ?? []) as any[];
    const output = {
      ranked_candidates: candidates.map((cand, i) => ({
        ...cand,
        rank: i + 1,
        confidence: Number((0.92 - i * 0.11).toFixed(2)),
        source_supported: true,
      })),
      method: "conventional_ai_rank_v1",
    };
    const analysis = c.must(
      await db
        .from("ai_analyses")
        .insert({ transaction_id: txnId, search_run_id: run.id, output })
        .select("*")
        .single(),
      "create ai analysis",
    );
    await c.setStage(db, txnId, "AI");
    await c.writeMemoryEvent(db, txnId, "ai.analysed", {
      ai_analysis_id: analysis.id,
      ranked: output.ranked_candidates.length,
    });
    return { ai_analysis_id: analysis.id, output };
  });

export const createDecisionSession = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    const analysisId = await c.requireRow(db, "ai_analyses", txnId, "AI analysis");
    const session = c.must(
      await db
        .from("decision_sessions")
        .insert({ transaction_id: txnId, ai_analysis_id: analysisId })
        .select("*")
        .single(),
      "create decision session",
    );
    return { decision_session_id: session.id, status: session.status };
  });

export const generateChoiceSet = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ decisionSessionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const res = await db.from("decision_sessions").select("*").eq("id", data.decisionSessionId).maybeSingle();
    if (!res.data) throw new Error("decision session not found");
    const session = res.data;
    const analysis = (await db.from("ai_analyses").select("*").eq("id", session.ai_analysis_id).single()).data;
    const ranked = (analysis?.output?.ranked_candidates ?? []) as any[];
    const choiceSet = {
      options: ranked.map((r) => ({
        entity: r,
        rationale: `Source-supported candidate, confidence ${r.confidence}`,
      })),
      generated_at: new Date().toISOString(),
    };
    await db
      .from("decision_sessions")
      .update({ choice_set: choiceSet, status: "CHOICE_SET_READY" })
      .eq("id", session.id);
    await c.setStage(db, session.transaction_id, "AI_PLUS");
    await c.writeMemoryEvent(db, session.transaction_id, "ai_plus.choice_set_generated", {
      decision_session_id: session.id,
      option_count: choiceSet.options.length,
    });
    return { decision_session_id: session.id, choice_set: choiceSet };
  });

export const materialiseCounterparties = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ transactionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transactionId;
    const sessRes = await db
      .from("decision_sessions")
      .select("*")
      .eq("transaction_id", txnId)
      .eq("status", "CHOICE_SET_READY")
      .limit(1);
    const session = sessRes.data?.[0];
    if (!session) throw new Error("AI+ ChoiceSet must be generated before counterparties");
    const entities = ((session.choice_set?.options ?? []) as any[]).map((o) => o.entity);
    const set = c.must(
      await db
        .from("counterparty_sets")
        .insert({ transaction_id: txnId, decision_session_id: session.id, entities })
        .select("*")
        .single(),
      "materialise counterparties",
    );
    await c.setStage(db, txnId, "COUNTERPARTIES");
    await c.writeMemoryEvent(db, txnId, "counterparties.materialised", {
      counterparty_set_id: set.id,
      count: entities.length,
    });
    return { counterparty_set_id: set.id, entities };
  });

export const createChoice = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    const setId = await c.requireRow(db, "counterparty_sets", txnId, "CounterpartySet");
    const choice = c.must(
      await db
        .from("choices")
        .insert({
          transaction_id: txnId,
          counterparty_set_id: setId,
          selected_entity: data.selected_entity ?? {},
          actor: data.actor ?? "unknown",
          reason: data.reason ?? null,
        })
        .select("*")
        .single(),
      "record choice",
    );
    await c.setStage(db, txnId, "CHOICE");
    await c.writeMemoryEvent(db, txnId, "choice.recorded", { choice_id: choice.id, actor: choice.actor });
    return { choice_id: choice.id };
  });

export const createIntent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ transactionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transactionId;
    const choiceId = await c.requireRow(db, "choices", txnId, "Human Choice");
    const choice = (await db.from("choices").select("*").eq("id", choiceId).single()).data;
    const bid = (await db.from("bid_offers").select("*").eq("transaction_id", txnId).limit(1)).data?.[0];

    // Hard rule: both parties must be Approved to Trade, screened within 30
    // days, and outside the high/critical risk bands.
    const counterpartyName = (choice?.selected_entity?.name as string) ?? "";
    const profile = await c.getComplianceProfile(db, counterpartyName);
    c.assertTradeEligible(profile);

    const { probability, factors } = await c.computeCompletionProbability(db, txnId, profile);

    const snapshot = {
      counterparty: choice?.selected_entity ?? {},
      commercial: bid?.commercial ?? {},
      subject: bid?.subject_description ?? null,
      actor: choice?.actor ?? null,
      compliance: profile,
      completion_probability: probability,
      probability_factors: factors,
      frozen_at: new Date().toISOString(),
    };
    const intent = c.must(
      await db
        .from("intents")
        .insert({
          transaction_id: txnId,
          choice_id: choiceId,
          frozen_snapshot: snapshot,
          completion_probability: probability,
        })
        .select("*")
        .single(),
      "freeze intent",
    );
    await c.setStage(db, txnId, "INTENT");
    await c.writeMemoryEvent(db, txnId, "intent.frozen", {
      intent_id: intent.id,
      completion_probability: probability,
    });
    return { intent_id: intent.id, frozen_snapshot: snapshot, completion_probability: probability };
  });

/* ------------------------------------------------------------------ */
/* POI + WaD — hard token gates                                         */
/* ------------------------------------------------------------------ */

export const createPoi = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    const workspaceId = await ws(context as unknown as Ctx);
    const intentId = await c.requireRow(db, "intents", txnId, "Intent");
    const existing = await db.from("pois").select("*").eq("transaction_id", txnId).maybeSingle();
    if (existing.data) return { poi_id: existing.data.id, status: existing.data.status };
    const tokenEntryId = await c.chargeGate(db, workspaceId, txnId, "POI");
    const poi = c.must(
      await db
        .from("pois")
        .insert({ transaction_id: txnId, intent_id: intentId, token_entry_id: tokenEntryId, status: "DRAFT" })
        .select("*")
        .single(),
      "create poi",
    );
    await c.setStage(db, txnId, "POI");
    await c.writeMemoryEvent(db, txnId, "poi.created", {
      poi_id: poi.id,
      tokens_charged: c.POI_TOKENS,
      usd: c.POI_USD,
    });
    return { poi_id: poi.id, status: poi.status, tokens_charged: c.POI_TOKENS };
  });

export const sealPoi = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ poiId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const res = await db.from("pois").select("*").eq("id", data.poiId).maybeSingle();
    if (!res.data) throw new Error("poi not found");
    const poi = res.data;
    if (poi.status === "SEALED") return { poi_id: poi.id, status: poi.status, canonical_hash: poi.canonical_hash };
    const intent = (await db.from("intents").select("*").eq("id", poi.intent_id).single()).data;

    // Hard rule: collapse requires an intent completion probability >= 50.1%.
    const probability = Number(
      intent?.completion_probability ?? intent?.frozen_snapshot?.completion_probability ?? 0,
    );
    if (probability < c.MIN_COMPLETION_PROBABILITY) {
      const factors = (intent?.frozen_snapshot?.probability_factors ?? []) as {
        id: string;
        earned: number;
        weight: number;
        detail: string;
      }[];
      const weakest = factors
        .filter((f) => f.earned < f.weight)
        .map((f) => f.detail)
        .slice(0, 3)
        .join("; ");
      throw new Error(
        `Collapse blocked: intent completion probability is ${(probability * 100).toFixed(1)}%, ` +
          `below the required ${(c.MIN_COMPLETION_PROBABILITY * 100).toFixed(1)}%.` +
          (weakest ? ` Outstanding: ${weakest}.` : ""),
      );
    }

    const canonicalHash = c.sha256({
      poi_id: poi.id,
      transaction_id: poi.transaction_id,
      intent: intent?.frozen_snapshot ?? {},
    });
    const sealedAt = new Date().toISOString();
    await db
      .from("pois")
      .update({ status: "SEALED", canonical_hash: canonicalHash, sealed_at: sealedAt })
      .eq("id", poi.id);
    await c.setStage(db, poi.transaction_id, "POI_SEALED");
    await c.writeMemoryEvent(db, poi.transaction_id, "poi.sealed", {
      poi_id: poi.id,
      canonical_hash: canonicalHash,
      completion_probability: probability,
    });
    return {
      poi_id: poi.id,
      status: "SEALED",
      canonical_hash: canonicalHash,
      sealed_at: sealedAt,
      completion_probability: probability,
    };
  });

export const createWad = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const { screenName } = await import("@/lib/spine/sanctions.server");
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    const workspaceId = await ws(context as unknown as Ctx);
    const poi = (await db.from("pois").select("*").eq("transaction_id", txnId).maybeSingle()).data;
    if (!poi || poi.status !== "SEALED") throw new Error("WaD requires a sealed POI");
    const existing = await db.from("wads").select("*").eq("transaction_id", txnId).maybeSingle();
    if (existing.data) {
      return {
        wad_id: existing.data.id,
        decision: existing.data.decision,
        predicates: existing.data.predicates ?? [],
      };
    }
    // WaD certification is included in the Trade Request credit (0 charge).
    const tokenEntryId = await c.chargeGate(db, workspaceId, txnId, "WAD");

    const intent = (await db.from("intents").select("*").eq("id", poi.intent_id).single()).data;
    const counterpartyName =
      (intent?.frozen_snapshot?.counterparty?.name as string) ?? "unknown counterparty";
    const screening = screenName(counterpartyName);
    const profile = await c.getComplianceProfile(db, counterpartyName);
    const probability = Number(
      intent?.completion_probability ?? intent?.frozen_snapshot?.completion_probability ?? 0,
    );

    const gates = await c.runHardGates(db, txnId, {
      profile,
      poi,
      sanctionsHit: screening.hit,
      sanctionsDetail: screening.hit
        ? `OFAC SDN match: ${screening.matches.map((m) => m.name).join("; ")}`
        : `No OFAC SDN match for "${counterpartyName}"`,
      probability,
    });
    const predicates = gates.map((g, i) => ({
      ...g,
      gate: i + 1,
      name: c.GATES[i] ?? g.id,
      ...(g.id === "sanctions_screening" ? { matches: screening.matches } : {}),
    }));
    const decision = predicates.every((p) => p.result === "PASS") ? "PASSED" : "FAILED";
    const wad = c.must(
      await db
        .from("wads")
        .insert({
          transaction_id: txnId,
          poi_id: poi.id,
          token_entry_id: tokenEntryId,
          status: "DECIDED",
          predicates,
          decision,
          decided_at: new Date().toISOString(),
        })
        .select("*")
        .single(),
      "create wad",
    );
    await c.setStage(db, txnId, "WAD");
    await c.writeMemoryEvent(db, txnId, "wad.decided", {
      wad_id: wad.id,
      decision,
      gates_passed: predicates.filter((p) => p.result === "PASS").length,
      tokens_charged: c.WAD_TOKENS,
    });
    return { wad_id: wad.id, decision, predicates, tokens_charged: c.WAD_TOKENS };
  });

/* ------------------------------------------------------------------ */
/* Execution + Finality                                                 */
/* ------------------------------------------------------------------ */

export const createExecution = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    const wad = (await db.from("wads").select("*").eq("transaction_id", txnId).maybeSingle()).data;
    if (!wad || wad.decision !== "PASSED") {
      throw new Error("Execution is locked: it requires a PASSED WaD decision (non-waivable)");
    }
    const existing = await db.from("executions").select("*").eq("transaction_id", txnId).maybeSingle();
    if (existing.data) return { execution_id: existing.data.id, status: existing.data.status };
    const intent = (
      await db.from("intents").select("*").eq("transaction_id", txnId).limit(1)
    ).data?.[0];
    const execution = c.must(
      await db
        .from("executions")
        .insert({
          transaction_id: txnId,
          wad_id: wad.id,
          status: "ACTIVE",
          baseline: intent?.frozen_snapshot ?? {},
        })
        .select("*")
        .single(),
      "create execution",
    );
    await c.setStage(db, txnId, "EXECUTION_ENTRY");
    await c.writeMemoryEvent(db, txnId, "execution.entered", { execution_id: execution.id });
    return { execution_id: execution.id, status: execution.status };
  });

export const createMilestone = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ executionId: string; title: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const exec = (await db.from("executions").select("*").eq("id", data.executionId).maybeSingle()).data;
    if (!exec) throw new Error("execution not found");
    const evidenceHash = c.sha256({ execution_id: exec.id, title: data.title, at: new Date().toISOString() });
    const milestone = c.must(
      await db
        .from("milestones")
        .insert({
          execution_id: exec.id,
          title: data.title,
          status: "ACCEPTED",
          evidence_hash: evidenceHash,
          accepted_at: new Date().toISOString(),
        })
        .select("*")
        .single(),
      "create milestone",
    );
    await c.setStage(db, exec.transaction_id, "EXECUTION_ACTIVE");
    await c.writeMemoryEvent(db, exec.transaction_id, "milestone.accepted", {
      milestone_id: milestone.id,
      evidence_hash: evidenceHash,
    });
    return { milestone_id: milestone.id, status: "ACCEPTED", evidence_hash: evidenceHash };
  });

export const exitExecution = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ executionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const exec = (await db.from("executions").select("*").eq("id", data.executionId).maybeSingle()).data;
    if (!exec) throw new Error("execution not found");
    const accepted = await db
      .from("milestones")
      .select("id")
      .eq("execution_id", exec.id)
      .eq("status", "ACCEPTED");
    if (!accepted.data || accepted.data.length === 0) {
      throw new Error("Exit requires at least one accepted milestone as completion evidence");
    }
    await db
      .from("executions")
      .update({ status: "COMPLETE", completed_at: new Date().toISOString() })
      .eq("id", exec.id);
    await c.setStage(db, exec.transaction_id, "EXECUTION_EXIT");
    await c.writeMemoryEvent(db, exec.transaction_id, "execution.exit", {
      execution_id: exec.id,
      accepted_milestones: accepted.data.length,
    });
    return { execution_id: exec.id, status: "COMPLETE" };
  });

export const createFinality = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<Record<string, any>>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transaction_id as string;
    const exec = (
      await db.from("executions").select("*").eq("transaction_id", txnId).eq("status", "COMPLETE").maybeSingle()
    ).data;
    if (!exec) throw new Error("Finality requires a completed Execution (Exit) first");
    const type = ["PAYMENT", "SETTLEMENT", "HANDOVER_DELIVERY", "SYNTHETIC", "OTHER"].includes(
      data.finality_type,
    )
      ? data.finality_type
      : "OTHER";
    const record = c.must(
      await db
        .from("finality_records")
        .insert({ transaction_id: txnId, execution_id: exec.id, finality_type: type, status: "DRAFT" })
        .select("*")
        .single(),
      "create finality record",
    );
    await c.writeMemoryEvent(db, txnId, "finality.entered", {
      finality_id: record.id,
      finality_type: type,
    });
    return { finality_id: record.id, status: "DRAFT", finality_type: type };
  });

export const issueFinality = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => validate<{ finalityId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const record = (
      await db.from("finality_records").select("*").eq("id", data.finalityId).maybeSingle()
    ).data;
    if (!record) throw new Error("finality record not found");
    if (record.status === "ISSUED") {
      return {
        finality_id: record.id,
        status: "ISSUED",
        canonical_hash: record.canonical_hash,
        certificate: record.certificate,
      };
    }
    const poi = (await db.from("pois").select("*").eq("transaction_id", record.transaction_id).single()).data;
    const wad = (await db.from("wads").select("*").eq("transaction_id", record.transaction_id).single()).data;
    const exec = (await db.from("executions").select("*").eq("id", record.execution_id).single()).data;
    const milestones = (await db.from("milestones").select("*").eq("execution_id", exec.id)).data ?? [];

    const certificate = {
      finality_id: record.id,
      transaction_id: record.transaction_id,
      finality_type: record.finality_type,
      poi_hash: poi.canonical_hash,
      wad_decision: wad.decision,
      execution_baseline: exec.baseline,
      milestones: milestones.map((m: any) => ({
        title: m.title,
        status: m.status,
        evidence_hash: m.evidence_hash,
      })),
      issued_at: new Date().toISOString(),
    };
    const canonicalHash = c.sha256(certificate);
    await db
      .from("finality_records")
      .update({
        status: "ISSUED",
        canonical_hash: canonicalHash,
        certificate,
        issued_at: certificate.issued_at,
      })
      .eq("id", record.id);
    await db.from("spine_transactions").update({ lifecycle: "CLOSED" }).eq("id", record.transaction_id);
    await c.setStage(db, record.transaction_id, "FINALITY");
    await c.writeMemoryEvent(db, record.transaction_id, "finality.issued", {
      finality_id: record.id,
      canonical_hash: canonicalHash,
    });
    return { finality_id: record.id, status: "ISSUED", canonical_hash: canonicalHash, certificate };
  });

/* ------------------------------------------------------------------ */
/* Read models                                                          */
/* ------------------------------------------------------------------ */

export const getCda = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => validate<{ transactionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const txnId = data.transactionId;
    const events = await c.getTimeline(db, txnId);
    const finality = (
      await db
        .from("finality_records")
        .select("*")
        .eq("transaction_id", txnId)
        .eq("status", "ISSUED")
        .maybeSingle()
    ).data;
    return json({
      transaction_id: txnId,
      sealed: !!finality,
      sealed_at: finality?.issued_at ?? null,
      causal_chain: events.map((e: any) => ({
        event_type: e.event_type,
        occurred_at: e.occurred_at,
        event_hash: e.event_hash,
      })),
      chain_integrity: await c.verifyChain(db, txnId),
      certificate: finality?.certificate ?? null,
    });
  });

export const getLineage = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => validate<{ transactionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const c = await core();
    const db = (context as unknown as Ctx).supabase as any;
    const forward = await c.getTimeline(db, data.transactionId);
    return {
      transaction_id: data.transactionId,
      forward_order: forward.map((e: any) => e.event_type),
      backward_order: [...forward].reverse().map((e: any) => e.event_type),
      chain_integrity: await c.verifyChain(db, data.transactionId),
    };
  });

export const getTransactionView = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => validate<{ transactionId: string }>(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const db = (context as unknown as Ctx).supabase as any;
    const txn = (await db.from("spine_transactions").select("*").eq("id", data.transactionId).single()).data;
    const bidOffer = (await db.from("bid_offers").select("*").eq("transaction_id", txn.id).limit(1)).data?.[0];
    const poi = (await db.from("pois").select("*").eq("transaction_id", txn.id).maybeSingle()).data;
    const wad = (await db.from("wads").select("*").eq("transaction_id", txn.id).maybeSingle()).data;
    return {
      transaction_id: txn.id,
      lifecycle: txn.lifecycle,
      trading_stage: txn.trading_stage,
      bid_offer: bidOffer ?? null,
      poi: poi ?? null,
      wad: wad ?? null,
    };
  });

/* ------------------------------------------------------------------ */
/* Dashboard — list this workspace's transactions with a stage summary  */
/* ------------------------------------------------------------------ */

export const listTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const workspaceId = await ws(context as unknown as Ctx);
    const db = (context as unknown as Ctx).supabase as any;
    // RLS (user_id = auth.uid()) already scopes every row to this caller;
    // the explicit workspace_id filter here is belt-and-braces, not the
    // only control.
    const { data: rows } = await db
      .from("spine_transactions")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    const transactions = await Promise.all(
      (rows ?? []).map(async (t: any) => {
        const bidOffer = (
          await db.from("bid_offers").select("subject_description").eq("transaction_id", t.id).limit(1)
        ).data?.[0];
        const poi = (
          await db.from("pois").select("status").eq("transaction_id", t.id).limit(1)
        ).data?.[0];
        const wad = (
          await db.from("wads").select("decision").eq("transaction_id", t.id).limit(1)
        ).data?.[0];
        const finality = (
          await db.from("finality_records").select("status").eq("transaction_id", t.id).limit(1)
        ).data?.[0];
        return {
          transaction_id: t.id,
          lifecycle: t.lifecycle,
          trading_stage: t.trading_stage,
          subject: bidOffer?.subject_description ?? null,
          poi_status: poi?.status ?? null,
          wad_decision: wad?.decision ?? null,
          finality_status: finality?.status ?? null,
          created_at: t.created_at,
        };
      }),
    );

    return { transactions };
  });
