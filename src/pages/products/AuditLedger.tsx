import { Layout, PageHero } from "@/components/izenzo/Layout";
import { ThreeBoxes, CTABand } from "@/components/izenzo/Sections";
import { WadCertificate } from "@/components/izenzo/CertificateMock";
import { Button } from "@/components/izenzo/ui";

export default function AuditLedger() {
  return (
    <Layout>
      <PageHero
        eyebrow="Audit Ledger"
        title={
          <>
            Tamper-evident ledger
            <br />
            for trade finance.
          </>
        }
        paragraph="Provide banks, DFIs, and insurers with hash-sealed, independently re-verifiable deal records. Reduce manual auditing effort, raise the cost of tampering, and accelerate capital deployment."
        tagline="Tamper-evident · Hash-sealed · Bank-ready exports"
        actions={
          <>
            <Button href="/auth">Issue your first ledger</Button>
            <Button href="/docs/evidence" variant="secondary">
              Read the spec
            </Button>
          </>
        }
      >
        <WadCertificate />
      </PageHero>

      <ThreeBoxes
        eyebrow="The record"
        title="Every deal, mathematically provable."
        subtitle="A Without-a-Doubt certificate binds commercial terms, compliance evidence, and issuance authority into one hash-sealed, independently re-verifiable record."
        boxes={[
          {
            label: "Integrity",
            heading: "SHA-256 hash sealing.",
            content: (
              <>
                <p className="mb-4">
                  Every gate transition writes a hash into an append-only trail. Any alteration to terms,
                  evidence, or signatures changes the payload hash and invalidates the certificate.
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">
                  Payload hash (SHA-256)
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/50 break-all">
                  a3f5b8d2c4e7f1a9b6d8e2c5f7a4b1d9e6c3f8a2b5d7e1c4f9a6b3d8e2c5f7a4
                </p>
              </>
            ),
          },
          {
            label: "Provenance",
            heading: "NTP-anchored timing.",
            content: (
              <>
                <p className="mb-4">
                  Issuance time is anchored to an external time source, so the moment of certification is not
                  something either party can quietly restate after the fact.
                </p>
                <div className="font-mono text-[11px] space-y-1.5">
                  <div>Source · NTP · time.cloudflare.com</div>
                  <div>Drift · 4ms</div>
                  <div>Issued · 2025-04-18T09:42:17Z</div>
                  <div>Authority · izenzo-gov-key-2025-q2-01</div>
                </div>
              </>
            ),
          },
          {
            label: "Distribution",
            heading: "Bank-ready exports.",
            content: (
              <>
                <p className="mb-4">
                  Export the sealed record for credit committees, insurers, and auditors. Recipients re-verify
                  the hash independently — no access to your desk required.
                </p>
                <ul className="space-y-2">
                  {[
                    "Signed PDF certificate",
                    "Machine-readable JSON payload",
                    "Gate-by-gate evidence manifest",
                    "Public integrity verification endpoint",
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
        ]}
      />

      <CTABand
        line1="Stop auditing paperwork."
        line2="Start verifying mathematics."
        paragraph="The Audit Ledger is included with every Izenzo Trade Desk seat."
        buttonLabel="Open your desk"
        buttonHref="/auth"
        secondaryLabel="See pricing"
        secondaryHref="/pricing"
      />
    </Layout>
  );
}
