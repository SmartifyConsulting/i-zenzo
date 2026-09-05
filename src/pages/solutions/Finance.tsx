import { Layout, PageHero } from "@/components/izenzo/Layout";
import { ThreeBoxes, CTABand } from "@/components/izenzo/Sections";
import { WadCertificate } from "@/components/izenzo/CertificateMock";
import { Button } from "@/components/izenzo/ui";

const RESOLUTION = [
  "One-click hash verification",
  "Bound evidence chain (KYB, sanctions, terms)",
  "Bilateral signature provenance",
  "Tamper-evident timestamping",
  "PDF + JSON evidence exports",
];

export default function Finance() {
  return (
    <Layout>
      <PageHero
        eyebrow="For Trade Finance & Insurance"
        title="De-risk capital deployment."
        paragraph="Rely on hash-sealed, independently re-verifiable deal records to underwrite trade finance, issue letters of credit, and insure shipments with reduced ambiguity."
        tagline="SHA-256 hashed · Designed for underwriter review · Designed for audit review"
        actions={
          <>
            <Button href="/auth">Request access</Button>
            <Button href="/products/audit-ledger" variant="secondary">
              See the ledger
            </Button>
          </>
        }
      >
        <WadCertificate />
      </PageHero>

      <ThreeBoxes
        eyebrow="For underwriters, lenders, and insurers"
        title="The end of forensic auditing."
        subtitle="Three primitives (cryptographically hashed proof, governed underwriting workflow, and instant audit resolution) designed for institutional capital deployment workflows."
        boxes={[
          {
            label: "Proof",
            heading: "Hash-sealed proof (SHA-256).",
            content: (
              <>
                <p className="mb-4">
                  Every recorded deal carries a 256-bit cryptographic fingerprint that any third party can
                  independently re-compute and verify. No more notarised PDFs. No more chasing wet-ink signatures
                  across three time zones.
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">
                  Sample SHA-256 seal · 256-bit
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/50 break-all">
                  0x7c1a4f8e9b2d6c5f3a1e8d4b7c9f2e5a8d3b6c1f4e7a9d2c5b8e1f4a7d3c9e6b
                </p>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground/40">
                  Sample · Match A1B2C3D4 · evidence pack
                </p>
              </>
            ),
          },
          {
            label: "Underwriting",
            heading: "Automated underwriting.",
            content: (
              <>
                <p className="mb-4">
                  Ingest sealed deal records via API and route them straight into your credit decision engine.
                  Reduce LC issuance from days to minutes.
                </p>
                <ul className="space-y-2">
                  {[
                    "REST + webhook ingest",
                    "Counterparty risk pre-cleared",
                    "Cargo & shipment evidence bound",
                    "Programmatic policy issuance",
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
            label: "Resolution",
            heading: "Instant audit resolution.",
            content: (
              <>
                <p className="mb-4">
                  When a regulator, internal auditor, or counterparty queries a deal, the answer is a single hash
                  check away. No discovery requests. No document chase. No reconciliation spreadsheets. Just
                  deterministic mathematics.
                </p>
                <ol className="space-y-2">
                  {RESOLUTION.map((item, i) => (
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
        line1="Stop underwriting paperwork."
        line2="Start underwriting truth."
        paragraph="Connect your credit engine to the Audit Ledger and accelerate capital deployment with mathematical certainty."
        buttonLabel="Request access"
        buttonHref="/auth"
      />
    </Layout>
  );
}
