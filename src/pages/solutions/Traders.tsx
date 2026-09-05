import { Layout, PageHero } from "@/components/izenzo/Layout";
import { ThreeBoxes, CTABand } from "@/components/izenzo/Sections";
import { CertificateOfIntent } from "@/components/izenzo/CertificateMock";
import { Button } from "@/components/izenzo/ui";

const STATS: [string, string][] = [
  ["1,200+", "Verified counterparties"],
  ["80", "Active commodities"],
  ["42", "Jurisdictions"],
];

const SPEED = [
  "Single KYB profile, all counterparties",
  "Sanctions screening workflow with admin-reviewed thresholds. Continuous re-screening is planned hardening.",
  "Jurisdictional routing on every deal",
  "Authority binding workflow with verifiable credentials",
  "Compliance evidence travels with the trade",
];

export default function Traders() {
  return (
    <Layout>
      <PageHero
        eyebrow="For Commodity Traders & Corporates"
        title="Execute with absolute certainty."
        paragraph="Discover verified counterparties, negotiate terms, and seal cross-border commodity deals in a unified, secure terminal."
        tagline="Verified liquidity · Hash-locked terms · Zero-friction compliance"
        actions={
          <>
            <Button href="/auth">Open your desk</Button>
            <Button href="/products/trade-desk" variant="secondary">
              See the product
            </Button>
          </>
        }
      >
        <CertificateOfIntent />
      </PageHero>

      <ThreeBoxes
        eyebrow="The trader's edge"
        title="Find liquidity. Lock terms. Move capital."
        subtitle="Three primitives engineered to compress days of paperwork into minutes from drafted intent to recorded POI."
        boxes={[
          {
            label: "Discovery",
            heading: "Verified liquidity, on demand.",
            content: (
              <>
                <p className="mb-5">
                  Search the order book by commodity, geography, role, or counterparty. Counterparties shown on
                  your desk carry the screening status recorded for them. Status changes over time; always verify
                  the current badge.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {STATS.map(([value, label]) => (
                    <div key={label}>
                      <div className="text-xl font-semibold text-foreground">{value}</div>
                      <div className="text-[11px] text-muted-foreground/70 leading-snug">{label}</div>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
          {
            label: "Negotiation",
            heading: "Hash-locked negotiations.",
            content: (
              <>
                <p className="mb-4">
                  Every term iteration is signed and chained. No silent edits, no “he said / she said”, the
                  canonical version is always provably the latest.
                </p>
                <ul className="space-y-2">
                  {[
                    "Versioned commercial terms",
                    "Bilateral signature collapse",
                    "Tamper-evident audit trail",
                    "SHA-256 sealed at issuance",
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
            label: "Speed",
            heading: "Zero-friction compliance.",
            content: (
              <>
                <p className="mb-4">
                  Your KYB profile completes once and follows you across every deal. Counterparties see only what
                  they need to see. No duplicate intake. No re-uploaded passports. No 14-day onboarding sprints.
                </p>
                <ol className="space-y-2">
                  {SPEED.map((item, i) => (
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
        line1="Stop chasing paperwork."
        line2="Start closing trades."
        paragraph="Provision a desk, complete your compliance profile, and seal your first cross-border match today."
        buttonLabel="Open your desk"
        buttonHref="/auth"
      />
    </Layout>
  );
}
