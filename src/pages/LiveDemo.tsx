import { useEffect, useState } from "react";
import { Layout } from "@/components/izenzo/Layout";
import { Badge, Card } from "@/components/izenzo/ui";
import { Link } from "@/lib/router-compat";
import * as api from "@/lib/api";

type LogLine = { label: string; ok: boolean; detail: string; stage?: string };

export default function LiveDemo() {
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [result, setResult] = useState<"idle" | "wad_failed" | "sealed">("idle");
  const [certificate, setCertificate] = useState<any>(null);
  const [cda, setCda] = useState<any>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [counterpartyName, setCounterpartyName] = useState("Aurelia Metals Trading Pty Ltd");

  useEffect(() => {
    api.isLoggedIn().then(setAuthed).catch(() => setAuthed(false));
  }, []);

  function pushLog(stage: string, label: string, ok: boolean, detail: string) {
    setLogs((l) => [...l, { stage, label, ok, detail }]);
  }

  async function run() {
    setBusy(true);
    setLogs([]);
    setResult("idle");
    setCertificate(null);
    setCda(null);
    try {
      const session = await api.startSession();
      pushLog("SESSION", "Workspace ready", true, `workspace_id=${session.workspace_id}`);

      const bidOffer = await api.createBidOffer({
        actor_person: "Jane Trader",
        contact: "jane@buyerco.com",
        represented_org: "BuyerCo Ltd",
        role: "buyer",
        subject_type: "commodity",
        subject_description: "Copper Cathode LME Grade A",
        commercial: { quantity: "500 MT", price: "9420 USD", incoterms: "CIF Rotterdam" },
      });
      const transactionId = bidOffer.transaction_id;
      pushLog("BID_OFFER", "Bid/Offer created", true, `transaction_id=${transactionId}`);

      await api.createOtherDocument({
        transaction_id: transactionId,
        semantic_type: "AUTHORITY",
        issuer: "CIPC",
        subject: "Certificate of Incorporation",
      });
      pushLog("OTHER_DOCS", "Other Docs recorded", true, "semantic_type=AUTHORITY, hashed and stored");

      await api.createSocialNewsItem({
        transaction_id: transactionId,
        source_url: "https://reuters.com/markets/commodities/example",
        publisher: "Reuters",
      });
      pushLog("SOCIAL_NEWS", "Social/News Media recorded", true, "external sourced context added");

      const search = await api.createSearchRun({
        transaction_id: transactionId,
        candidates: [{ name: counterpartyName, jurisdiction: "ZA" }],
      });
      pushLog("SEARCH", "Search completed", true, `search_run_id=${search.search_run_id}`);

      const analysis = await api.createAiAnalysis({ transaction_id: transactionId });
      pushLog("AI", "Conventional AI analysis", true, `ranked ${analysis.output.ranked_candidates.length} candidate(s)`);

      const decision = await api.createDecisionSession({ transaction_id: transactionId });
      await api.generateChoiceSet(decision.decision_session_id);
      pushLog("AI_PLUS", "AI+ ChoiceSet generated", true, `decision_session_id=${decision.decision_session_id}`);

      const cps = await api.materialiseCounterparties(transactionId);
      pushLog(
        "COUNTERPARTIES",
        "CounterpartySet materialised",
        true,
        `${cps.entities.length} real, source-supported entit${cps.entities.length === 1 ? "y" : "ies"}`,
      );

      await api.createChoice(transactionId, {
        selected_entity: cps.entities[0],
        actor: "jane@buyerco.com",
        reason: "best available terms",
      });
      pushLog("CHOICE", "Human Choice recorded", true, "accountable actor: jane@buyerco.com");

      await api.createIntent(transactionId);
      pushLog("INTENT", "Intent frozen", true, "sole input to POI, terms locked");

      // Real, settlement-gated purchase: POI/WaD literally cannot be charged
      // without a settled wallet balance. Same session -> signed callback ->
      // idempotent credit flow a live payment page uses.
      const purchase = await api.createTokenPurchase(4);
      pushLog("PAYMENT", "Token purchase session created", true, `sandbox session, $${purchase.usd} for ${purchase.tokens} tokens`);
      const settled = await api.settlePayment(purchase.session_id);
      pushLog("PAYMENT", "Payment settled via signed callback", true, `${settled.tokens_credited} tokens credited to wallet`);

      const poi = await api.createPoi({ transaction_id: transactionId });
      pushLog("POI", "POI created — HARD GATE charged", true, `1 token / $10 consumed, poi_id=${poi.poi_id}`);
      const sealed = await api.sealPoi(poi.poi_id);
      pushLog("POI", "POI sealed — Trading concluded", true, `canonical_hash=${sealed.canonical_hash.slice(0, 24)}…`);

      const wad = await api.createWad({ transaction_id: transactionId });
      pushLog(
        "WAD",
        `WaD — HARD GATE charged, decision: ${wad.decision}`,
        wad.decision === "PASSED",
        `3 tokens / $30 consumed. Sanctions predicate: ${wad.predicates.find((p: any) => p.id === "SANCTIONS")?.result}`,
      );

      if (wad.decision !== "PASSED") {
        pushLog("EXECUTION", "Execution — LOCKED", false, "non-waivable block: WaD did not PASS. This is correct behavior, not a bug.");
        setResult("wad_failed");
        return;
      }

      const execution = await api.createExecution({ transaction_id: transactionId });
      pushLog("EXECUTION", "Execution entered", true, `execution_id=${execution.execution_id}, status=ACTIVE`);

      await api.createMilestone(execution.execution_id, { title: "Shipment loaded at origin port" });
      pushLog("EXECUTION", "Milestone accepted", true, "evidence-backed completion recorded");

      await api.exitExecution(execution.execution_id);
      pushLog("EXECUTION", "Execution Exit", true, "status=COMPLETE");

      const finality = await api.createFinality({ transaction_id: transactionId, finality_type: "SETTLEMENT" });
      const issued = await api.issueFinality(finality.finality_id);
      pushLog("FINALITY", "Finality ISSUED", true, `canonical_hash=${issued.canonical_hash.slice(0, 24)}…`);
      setCertificate(issued.certificate);

      const cdaResult = await api.getCda(transactionId);
      pushLog(
        "MEMORY",
        "CDA sealed, chain verified",
        cdaResult.chain_integrity.valid,
        `${cdaResult.chain_integrity.eventCount} hash-chained Memory events, sealed=${cdaResult.sealed}`,
      );
      setCda(cdaResult);
      setResult("sealed");
    } catch (err: any) {
      pushLog("ERROR", "Blocked", false, err?.message ?? "Unexpected failure");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-16">
        <Badge>Live Backend Demo</Badge>
        <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          The real Trading spine, running live.
        </h1>
        <p className="text-muted-foreground mb-2 max-w-2xl">
          Every step below is a real authenticated call into this platform's own backend, enforcing the exact
          required order — Bid/Offer → Other Docs → Social/News Media → Search → AI → AI+ → Counterparties →
          Choice → Intent → POI → WaD → Execution → Finality. Stage skips are rejected server-side. Token gates
          (POI $10, WaD $30) are real and non-waivable.
        </p>
        <p className="text-xs text-muted-foreground/60 mb-8">
          Try "Vladimir Putin" as the counterparty name to see WaD correctly FAIL and Execution correctly LOCK —
          that is proof the hard gate works, not a bug. The default name below is a clean counterparty that passes.
        </p>

        {authed === false ? (
          <Card className="p-6 mb-8">
            <p className="text-sm text-foreground font-medium mb-1">Sign in to run the spine</p>
            <p className="text-sm text-muted-foreground mb-4">
              The demo writes real records into your own workspace, so it needs an authenticated session.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center h-11 px-5 rounded-md text-sm font-semibold bg-emerald-brand text-primary-foreground hover:bg-emerald-bright transition-colors"
            >
              Sign in or create an account
            </Link>
          </Card>
        ) : (
          <Card className="p-6 mb-8">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Counterparty name (Search candidate)
            </label>
            <input
              value={counterpartyName}
              onChange={(e) => setCounterpartyName(e.target.value)}
              className="w-full h-10 rounded-md border border-border px-3 text-sm outline-none focus:border-emerald-brand mb-4"
            />
            <button
              onClick={run}
              disabled={busy || authed === null}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md text-sm font-semibold bg-emerald-brand text-primary-foreground shadow-md hover:-translate-y-0.5 hover:bg-emerald-bright transition-all disabled:opacity-60 disabled:pointer-events-none"
            >
              {busy ? "Running…" : "Run the full spine live"}
            </button>
          </Card>
        )}

        {logs.length > 0 && (
          <div className="rounded-md border border-border bg-card p-6 mb-8 font-mono text-xs space-y-2">
            {logs.map((l, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={l.ok ? "text-emerald-brand" : "text-destructive"}>{l.ok ? "✓" : "✗"}</span>
                <span className="text-muted-foreground/50 w-28 shrink-0">{l.stage}</span>
                <span className="text-foreground font-medium w-64 shrink-0">{l.label}</span>
                <span className="text-muted-foreground">{l.detail}</span>
              </div>
            ))}
          </div>
        )}

        {result === "wad_failed" && (
          <Card className="p-6 mb-8 border-destructive/30 bg-destructive/5">
            <p className="text-sm font-semibold text-destructive mb-1">WaD FAILED — Execution correctly locked</p>
            <p className="text-xs text-destructive/80">
              This is the non-waivable hard gate working as specified: no admin path, AI, agent, or override can
              force Execution to unlock without a PASSED WaD decision. Try a clean counterparty name to see the
              full spine complete.
            </p>
          </Card>
        )}

        {certificate && (
          <Card dark className="p-6 font-mono text-xs mb-8">
            <p className="text-sm font-sans font-semibold mb-4">Finality Certificate — {certificate.finality_type}</p>
            <div className="space-y-1.5 text-white/70">
              <div className="flex justify-between"><span>finality_id</span><span>{certificate.finality_id}</span></div>
              <div className="flex justify-between"><span>WaD decision</span><span className="text-emerald-brand">{certificate.wad_decision}</span></div>
              <div className="flex justify-between"><span>milestones</span><span>{certificate.milestones.length} accepted</span></div>
              <div className="flex justify-between"><span>issued_at</span><span>{certificate.issued_at}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 break-all text-white/50">
              POI hash: {certificate.poi_hash}
            </div>
          </Card>
        )}

        {cda && (
          <Card className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60 mb-3">
              CDA — Chain of Decision and Action (sealed: {String(cda.sealed)})
            </p>
            <div className="font-mono text-[11px] text-muted-foreground space-y-1">
              {cda.causal_chain.map((e: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <span>{i + 1}. {e.event_type}</span>
                  <span className="text-muted-foreground/40">{e.event_hash.slice(0, 16)}…</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
