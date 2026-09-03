import { Layout, PageHero } from '../../components/Layout'
import { ThreeBoxes, CTABand, BulletList } from '../../components/Sections'

export default function Finance() {
  return (
    <Layout>
      <PageHero
        eyebrow="For Trade Finance & Insurance"
        title="De-risk capital deployment."
        paragraph="Underwriters, lenders and insurers get SHA-256 hashed proof of every deal term — reviewable in minutes, not weeks."
        tagline="SHA-256 hashed · Designed for underwriter review · Designed for audit review"
      >
        <div className="rounded-md border border-emerald-950 bg-emerald-950 text-white p-6 shadow-lg font-mono text-xs">
          <p className="text-sm font-sans font-semibold mb-4">Attestation of Commercial Intent</p>
          <div className="space-y-1.5 text-white/60">
            <div className="flex justify-between"><span>Status</span><span className="text-emerald-brand">Settled</span></div>
            <div className="flex justify-between"><span>Gates verified</span><span className="text-white">9/9</span></div>
            <div className="flex justify-between"><span>Hash</span><span className="text-white/40">8f3a…9d3f7</span></div>
          </div>
        </div>
      </PageHero>
      <ThreeBoxes
        eyebrow="The end of forensic auditing"
        title="Verify in minutes, not weeks."
        boxes={[
          {
            label: 'Proof',
            heading: 'Hash-sealed proof (SHA-256).',
            content: (
              <p className="font-mono text-[10px] text-muted-foreground break-all bg-muted rounded p-3">
                8f3a1c9e2b4d7f60a1e5c8b2d9f4a7e3c6b1d8f2a5e9c3b7d1f4a8e2c5b9d3f7
              </p>
            ),
          },
          {
            label: 'Underwriting',
            heading: 'Automated underwriting.',
            content: <BulletList items={['Risk scoring pulled at onboarding', 'Sanctions status re-checked periodically', 'Jurisdiction policy pre-applied', 'Exposure aggregated per programme']} />,
          },
          {
            label: 'Resolution',
            heading: 'Instant audit resolution.',
            content: <BulletList items={['Full evidence pack export', 'Every gate independently re-verifiable', 'No reliance on counterparty attestation', 'Bank-ready PDF/JSON exports', 'NTP-anchored timestamps']} />,
          },
        ]}
      />
      <CTABand
        line1="Stop underwriting paperwork."
        line2="Start underwriting truth."
        paragraph="Request access to review a live Audit Ledger record."
        buttonLabel="Request access"
        buttonHref="/auth"
      />
    </Layout>
  )
}
