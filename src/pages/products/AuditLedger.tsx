import { Layout, PageHero } from '../../components/Layout'
import { CTABand } from '../../components/Sections'
import { NineGateTrail } from '../../components/CertificateMock'

export default function AuditLedger() {
  return (
    <Layout>
      <PageHero
        eyebrow="Audit Ledger"
        title="Tamper-evident ledger for trade finance."
        paragraph="Banks, DFIs and insurers get hash-sealed, independently re-verifiable trade records — no forensic reconciliation required."
        tagline="Tamper-evident · Hash-sealed · Bank-ready exports"
      >
        <NineGateTrail />
      </PageHero>
      <section className="py-24 border-t border-border bg-background">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="rounded-md border border-emerald-950 bg-emerald-950 text-white p-8 shadow-lg font-mono text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-sans font-semibold">Attestation of Commercial Intent</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">Certificate Class WaD/A</span>
            </div>
            <p className="text-white/50 text-[10px] mb-6">Match UUID: 8f3a1c9e-2b4d-7f60-a1e5-c8b2d9f4a7e3</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
              Section I — Verified Commercial Terms
            </p>
            <div className="grid grid-cols-2 gap-y-1.5 text-white/70 mb-6">
              <span>Commodity</span><span className="text-white text-right">Copper Cathode LME Grade A</span>
              <span>Volume</span><span className="text-white text-right">500 MT</span>
              <span>Price</span><span className="text-white text-right">USD 9,420</span>
              <span>Incoterms</span><span className="text-white text-right">CIF Rotterdam</span>
              <span>Status</span><span className="text-emerald-brand text-right">Settled</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
              Section II — 9-Gate Compliance Trail
            </p>
            <div className="grid grid-cols-1 gap-1 text-white/60 mb-6">
              {[
                'Entity Verification', 'UBO Disclosure', 'Sanctions Screening', 'Jurisdiction Resolution',
                'Authority Binding', 'Terms Lock', 'Evidence Attachment', 'Bilateral Collapse Sign',
                'WaD Certificate Issuance',
              ].map((g, i) => (
                <div key={g} className="flex justify-between">
                  <span>GATE_0{i + 1} · {g}</span>
                  <span className="text-white/30">verified</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-white/30 break-all text-[10px]">
                Payload Hash 8f3a1c9e2b4d7f60a1e5c8b2d9f4a7e3
              </span>
              <button className="rounded-md bg-emerald-brand px-3 py-1.5 text-white text-[11px] font-sans font-semibold">
                Verify Record Integrity
              </button>
            </div>
          </div>
        </div>
      </section>
      <CTABand
        line1="Stop auditing paperwork."
        line2="Start verifying mathematics."
        paragraph="Audit Ledger is included with every Izenzo Trade Desk seat."
        buttonLabel="Open your desk"
        buttonHref="/auth"
        secondaryLabel="See pricing"
        secondaryHref="/pricing"
      />
    </Layout>
  )
}
