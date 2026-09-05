import { Layout, PageHero } from "@/components/izenzo/Layout";
import { ThreeBoxes, CTABand } from "@/components/izenzo/Sections";
import { CertificateOfIntent } from "@/components/izenzo/CertificateMock";
import { Button } from "@/components/izenzo/ui";

const GATES = [
  "Entity Verification",
  "UBO Disclosure",
  "Sanctions Screening",
  "Jurisdiction Resolution",
  "Authority Binding",
  "Terms Lock",
  "Evidence Attachment",
  "Bilateral Collapse Sign",
  "WaD Certificate Issuance",
];

const PULSES: [string, string, string][] = [
  ["00:01", "match_created", "GLN-SG"],
  ["00:02", "kyc_verified", "AUR-DE"],
  ["00:04", "sanctions_screened", "AUR-DE"],
  ["00:09", "terms_locked", "GLN-SG"],
  ["00:11", "poi_generated", "—"],
];

export default function TradeDesk() {
  return (
    <Layout>
      <PageHero
        eyebrow="Trade Desk"
        title={
          <>
            Governance infrastructure
            <br />
            for the deal maker.
          </>
        }
        paragraph="The all-in-one terminal for institutional commodity trade. Discover counterparties, run governed compliance workflow, and record cross-border trade intent with cryptographically hashed Proof of Intent."
        tagline="SHA-256 sealed · Tamper-evident · Audit-ready"
        actions={
          <>
            <Button href="/auth">Open your desk</Button>
            <Button href="/pricing" variant="secondary">
              See pricing
            </Button>
          </>
        }
      >
        <CertificateOfIntent />
      </PageHero>

      <ThreeBoxes
        eyebrow="The system"
        title="Precision-engineered for institutional throughput."
        subtitle="Three primitives (verification, compliance, and telemetry) composed into a single cohesive workspace."
        boxes={[
          {
            label: "Protocol",
            heading: "The 9-Gate Protocol.",
            content: (
              <>
                <p className="mb-4">
                  Every Proof of Intent traverses nine evidence gates before WaD certification: entity, UBO,
                  sanctions, jurisdiction, authority, terms, evidence, dual-collapse, certification.
                </p>
                <ol className="space-y-2">
                  {GATES.map((g, i) => (
                    <li key={g} className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-emerald-brand">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm">{g}</span>
                    </li>
                  ))}
                </ol>
              </>
            ),
          },
          {
            label: "Compliance",
            heading: "KYB integrated.",
            content: (
              <>
                <p className="mb-4">
                  Your Compliance Profile feeds directly into every deal. No second onboarding, no duplicate
                  evidence.
                </p>
                <ul className="space-y-2">
                  {[
                    "Entity verification",
                    "Beneficial-owner disclosure",
                    "Sanctions & PEP screening",
                    "Jurisdiction recorded at onboarding",
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
            label: "Observability",
            heading: "Real-time telemetry.",
            content: (
              <>
                <p className="mb-4">
                  A product preview rendered from demo data — not customer activity — surfaces every state
                  transition across a desk (from match creation to certificate issuance) with cryptographic
                  provenance on every pulse.
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-brand mb-2">
                  Live · System pulses
                </p>
                <div className="font-mono text-[11px] space-y-1.5">
                  {PULSES.map(([t, event, party]) => (
                    <div key={t} className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground/50">{t}</span>
                      <span className="flex-1 text-foreground">{event}</span>
                      <span className="text-muted-foreground/60">{party}</span>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
        ]}
      />

      <CTABand
        line1="Open your desk"
        line2="in minutes."
        paragraph="Provision a workspace, complete your compliance profile, and record your first Draft Proof of Intent today."
        buttonLabel="Open your desk"
        buttonHref="/auth"
      />
    </Layout>
  );
}
