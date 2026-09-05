import { Layout, PageHero } from "@/components/izenzo/Layout";
import { ThreeBoxes, CTABand } from "@/components/izenzo/Sections";
import { Button } from "@/components/izenzo/ui";

const KPIS: [string, string, string][] = [
  ["Programmes active", "47", "+3 · 24h"],
  ["Capital under governance", "$2.4B", "+12% · 24h"],
  ["Breach rate", "0.02%", "−0.4% · 24h"],
  ["Programme verification", "Sealed", "A1B2C3D4…"],
];

const EVENTS: [string, string, string][] = [
  ["10:42", "programme_disbursement", "USD 12.4M"],
  ["10:41", "milestone_verified", "USD 8.1M"],
  ["10:39", "kyb_re_attestation", "—"],
  ["10:36", "sanctions_clear", "—"],
  ["10:34", "fund_flow_recorded", "USD 3.2M"],
];

const DATA_CONTROL = [
  "Single approved production-region policy",
  "Role-based access (RBAC + break-glass)",
  "POPIA / GDPR retention workflow",
  "Cold-storage archival pipeline",
  "Independent regulator export endpoints (planned hardening)",
];

function GovernanceConsole() {
  return (
    <div className="rounded-md border border-border bg-card shadow-lg font-mono">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
          Izenzo · Governance Console
        </span>
        <span className="rounded-full bg-emerald-muted text-emerald-brand px-2 py-0.5 text-[10px] uppercase tracking-widest">
          Live
        </span>
      </div>
      <div className="p-5">
        <p className="text-sm font-sans font-semibold text-foreground mb-4">Macro Telemetry</p>
        <div className="grid grid-cols-2 gap-4">
          {KPIS.map(([label, value, delta]) => (
            <div key={label}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{label}</div>
              <div className="text-lg font-sans font-semibold text-foreground">{value}</div>
              <div className="text-[10px] text-emerald-brand">{delta}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-[11px] text-foreground">Maize Reserve Strategic Programme · ZAF</p>
          <p className="text-[10px] text-muted-foreground/60">
            12 participants · 142 milestones · USD 480M deployed
          </p>
          <p className="text-[10px] text-muted-foreground/40">Sample · 78% disbursed · milestone gates</p>
        </div>
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">
            Live programme events
          </p>
          <div className="space-y-1.5 text-[11px]">
            {EVENTS.map(([t, event, amount]) => (
              <div key={t} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground/50">{t}</span>
                <span className="flex-1 text-foreground">{event}</span>
                <span className="text-muted-foreground/60">{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sovereigns() {
  return (
    <Layout>
      <PageHero
        eyebrow="For Sovereigns & PDBs"
        title="Govern institutional trade at scale."
        paragraph="Secure national and cross-border trade programmes with end-to-end provenance and governed compliance workflow with admin oversight. Real-time programme telemetry is in development."
        tagline="Single approved production-region policy · Tamper-evident ledger · Macro telemetry"
        actions={
          <>
            <Button href="mailto:support@izenzo.co.za">Request a briefing</Button>
            <Button href="/docs" variant="secondary">
              See the architecture
            </Button>
          </>
        }
      >
        <GovernanceConsole />
      </PageHero>

      <ThreeBoxes
        eyebrow="For ministries, central banks & PDBs"
        title="See the whole programme."
        subtitle="Refresh cadence subject to workflow completion. Three primitives (macro oversight, fraud prevention, and institutional data control) engineered for institutional trade programmes at national scale."
        boxes={[
          {
            label: "Oversight",
            heading: "Macro-level oversight.",
            content: (
              <>
                <p className="mb-4">
                  Track every participant, milestone, and disbursement across an entire trade programme, in real
                  time, without waiting for end-of-quarter reports. Drill from a national KPI down to a single
                  signed event in three clicks.
                </p>
                <ul className="space-y-2">
                  {["Live KPI dashboards", "Tamper-evident event stream", "Tamper-evident provenance"].map(
                    (item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-brand shrink-0" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </>
            ),
          },
          {
            label: "Integrity",
            heading: "Fraud & leakage prevention.",
            content: (
              <>
                <p className="mb-4">
                  Every disbursement is gated by milestone verification. Every signature is bound to a verified
                  principal. Every event is hash-sealed, making tampering detectable.
                </p>
                <ul className="space-y-2">
                  {[
                    "Milestone-gated fund flows",
                    "Authority-bound signatures",
                    "Hash-sealed event store",
                    "Automated breach detection",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-brand shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
          {
            label: "Data control",
            heading: "Institutional data control.",
            content: (
              <>
                <p className="mb-4">
                  Izenzo currently operates a single approved production-region storage policy. A trading
                  jurisdiction is recorded at onboarding for governance purposes. Per-organisation residency
                  commitments require separate Izenzo approval and are not automatically applied.
                </p>
                <ol className="space-y-2">
                  {DATA_CONTROL.map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="font-mono text-[10px] text-emerald-brand mt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ol>
              </>
            ),
          },
        ]}
      />

      <CTABand
        line1="Stop governing on quarterly lag."
        line2="Start governing in real time."
        paragraph="Brief our institutional solutions team on your programme, we'll architect the governance rail end-to-end."
        buttonLabel="Request a briefing"
        buttonHref="mailto:support@izenzo.co.za"
      />
    </Layout>
  );
}
