import { Layout, PageHero } from "@/components/izenzo/Layout";
import { ThreeBoxes, CTABand } from "@/components/izenzo/Sections";
import { ComplianceProfileMock } from "@/components/izenzo/CertificateMock";
import { Button } from "@/components/izenzo/ui";

const WATCHLISTS: [string, string][] = [
  ["OFAC SDN", "US"],
  ["EU Consolidated", "EU"],
  ["UK HM Treasury", "UK"],
  ["UN Security Council", "UN"],
  ["PEP databases", "GLB"],
];

const OWNERSHIP: [string, string][] = [
  ["Aurelia Trade Holdings", "ROOT"],
  ["Aurelia Holdings AG", "51%"],
  ["Marcus Van Der Berg", "32.5%"],
  ["Pinehurst Trust", "16.5%"],
];

export default function ComplianceEngine() {
  return (
    <Layout>
      <PageHero
        eyebrow="Compliance Engine"
        title={
          <>
            Institutional identity.
            <br />
            Resolved.
          </>
        }
        paragraph="Admin-controlled KYB workflow, resolve complex UBO structures, and screen against global sanctions on configured cadence. Turn compliance from a bottleneck into a competitive advantage."
        tagline="OFAC · EU · UK HMT · DPL · Periodic screening"
        actions={
          <>
            <Button href="/auth">Verify a counterparty</Button>
            <Button href="/products/trade-desk" variant="secondary">
              See the Trade Desk
            </Button>
          </>
        }
      >
        <ComplianceProfileMock />
      </PageHero>

      <ThreeBoxes
        eyebrow="The system"
        title="Three primitives. One reviewed counterparty."
        subtitle="Document intelligence, ownership graphing, and periodic sanctions screening on configured cadence: composed into a single auditable record."
        boxes={[
          {
            label: "Intelligence",
            heading: "AI document extraction.",
            content: (
              <>
                <p className="mb-4">
                  Upload a Certificate of Incorporation. The engine reads, structures, and SHA-256 seals the
                  contents, ready to bind to an entity record.
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">
                  certificate.pdf
                </p>
                <pre className="font-mono text-[10px] leading-relaxed text-muted-foreground whitespace-pre-wrap rounded border border-border bg-muted/40 p-3">
{`{
  "legal_name": "Aurelia Trade Holdings (Pty) Ltd",
  "registration_number": "2019/438217/07",
  "jurisdiction": "ZA",
  "incorporation_date": "2019-08-14",
  "registered_address": "12 Keerom St, Cape Town"
}`}
                </pre>
              </>
            ),
          },
          {
            label: "Screening",
            heading: "Periodic sanctions screening.",
            content: (
              <>
                <p className="mb-4">
                  Every entity is screened against global watchlists on a configured cadence. Continuous
                  re-screening is planned hardening.
                </p>
                <div className="space-y-2">
                  {WATCHLISTS.map(([name, code]) => (
                    <div key={name} className="flex items-center justify-between gap-3">
                      <span className="text-sm">{name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-brand">
                        {code}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
          {
            label: "Ownership",
            heading: "UBO graphing.",
            content: (
              <>
                <p className="mb-4">
                  Nested corporate entities are recursively traversed until the ultimate human owners are
                  resolved, with ownership percentages summing to 100%.
                </p>
                <div className="space-y-2">
                  {OWNERSHIP.map(([name, pct], i) => (
                    <div key={name} className={`flex items-center justify-between gap-3 ${i > 0 ? "pl-4" : ""}`}>
                      <span className="text-sm">{name}</span>
                      <span className="font-mono text-[10px] text-emerald-brand">{pct}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  100% resolved · 4 ultimate beneficial owners
                </p>
              </>
            ),
          },
        ]}
      />

      <CTABand
        line1="Compliance,"
        line2="as infrastructure."
        paragraph="One reviewed counterparty record, reused across every deal. Bind it to the Trade Desk and seal cross-border transactions in minutes."
        buttonLabel="Provision Workspace"
        buttonHref="/auth"
        secondaryLabel="Read the docs"
        secondaryHref="/docs"
      />
    </Layout>
  );
}
