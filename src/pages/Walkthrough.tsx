import { Layout } from "@/components/izenzo/Layout";

const phases: { title: string; steps: [number, string][] }[] = [
  {
    title: "Phase 1 - Entity Onboarding & Due Diligence (~2 min)",
    steps: [
      [1, "Create buyer and seller organisations"],
      [2, "Register entities, UBO ownership, and ATB records"],
      [3, "Upload KYC documents"],
      [4, "Run sanctions/PEP screening"],
      [5, "Compute risk scores"],
      [6, "Complete approval workflow"],
      [7, "Issue Approved-to-Trade certification"],
    ],
  },
  {
    title: "Phase 2 - Discovery & Matching (~1.5 min)",
    steps: [
      [8, "Create buyer and seller signals"],
      [9, "Run match discovery"],
      [10, "Send invite"],
      [11, "Send trade request (1 credit burn at $1.00 USD/credit)"],
    ],
  },
  {
    title: "Phase 3 - Intent Lifecycle & Collapse (~2 min)",
    steps: [
      [12, "Run pre-flight checks"],
      [13, "Compute intent completion probability (must be ≥ 50.1%)"],
      [14, "Execute signed intent collapse"],
    ],
  },
  {
    title: "Phase 4 - Evidence & Final Output (~1.5 min)",
    steps: [
      [15, "Generate Evidence Pack v1"],
      [16, "Confirm Signed Deal with hard-gate validations"],
      [17, "Collect buyer + seller attestations"],
      [18, "Seal Signed Deal (hash chain)"],
      [19, "Export certificate"],
      [20, "Export full audit log"],
    ],
  },
];

const hardGates = [
  "Signed Deal enforces screening freshness (≤ 30 days)",
  "Signed Deal rejects high/critical risk bands",
  "Governance credit burn is atomic",
  "Collapse requires POI probability ≥ 50.1%",
];

const checklist = [
  "Screening is clear and within 30 days for both parties",
  "Risk band is not high/critical for both parties",
  "Both parties are Approved to Trade",
  "Intent completion probability is ≥ 50.1%",
  "Collapse ledger entry created and hash-recorded",
  "Signed Deal sealed with attestations",
  "Evidence Pack export generated",
  "Audit trail export contains lifecycle events across the recorded workflow",
];

export default function Walkthrough() {
  return (
    <Layout>
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10 rounded-md border border-border bg-muted/40 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between print:hidden">
          <p className="text-xs text-muted-foreground">
            Use Download PDF, then choose Save as PDF in your browser print dialogue.
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-emerald-brand text-white text-xs font-semibold hover:bg-emerald-bright transition-colors"
          >
            Download PDF
          </button>
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">
          System-level Walkthrough
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          Complete End-to-End Happy Path (5 to 8 min)
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Goal: prove the platform works as one integrated system - from onboarding to verification to
          evidence-backed output.
        </p>
        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground font-mono mb-12">
          <span>Duration: 5 to 8 min</span>
          <span>Steps: 19</span>
          <span>Outcome: Sealed Signed Deal + Evidence Pack + Audit Export</span>
        </div>

        <div className="space-y-10">
          {phases.map((p) => (
            <div key={p.title}>
              <h2 className="text-lg font-semibold text-foreground mb-3">{p.title}</h2>
              <ul className="space-y-1.5">
                {p.steps.map(([n, s]) => (
                  <li key={n} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="font-mono text-[11px] text-emerald-brand mt-0.5 w-5 shrink-0">{n}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Hard-Gates Confirmed in This Walkthrough</h3>
            <ul className="space-y-1.5">
              {hardGates.map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-brand shrink-0" /> {g}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Verification Checklist</h3>
            <ul className="space-y-1.5">
              {checklist.map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-emerald-brand">☐</span> {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
