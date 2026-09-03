import { Layout, PageHero } from '../../components/Layout'
import { ThreeBoxes, CTABand, BulletList } from '../../components/Sections'
import { CertificateOfIntent } from '../../components/CertificateMock'

export default function Traders() {
  return (
    <Layout>
      <PageHero
        eyebrow="For Commodity Traders & Corporates"
        title="Execute with absolute certainty."
        paragraph="Find verified counterparties, lock terms with hash-sealed precision, and move capital without friction."
        tagline="Verified liquidity · Hash-locked terms · Zero-friction compliance"
      >
        <CertificateOfIntent />
      </PageHero>
      <ThreeBoxes
        eyebrow="The trader's edge"
        title="Find liquidity. Lock terms. Move capital."
        boxes={[
          {
            label: 'Discovery',
            heading: 'Verified liquidity, on demand.',
            content: (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><div className="text-lg font-semibold text-foreground">1,200+</div><div className="text-[10px] text-muted-foreground/60">Counterparties</div></div>
                <div><div className="text-lg font-semibold text-foreground">40+</div><div className="text-[10px] text-muted-foreground/60">Commodities</div></div>
                <div><div className="text-lg font-semibold text-foreground">60+</div><div className="text-[10px] text-muted-foreground/60">Jurisdictions</div></div>
              </div>
            ),
          },
          {
            label: 'Negotiation',
            heading: 'Hash-locked negotiations.',
            content: <BulletList items={['Terms locked at signature', 'Bilateral collapse sign-off', 'No post-hoc renegotiation', 'Full negotiation trail retained']} />,
          },
          {
            label: 'Speed',
            heading: 'Zero-friction compliance.',
            content: <BulletList items={['Admin-controlled KYB', 'Automated sanctions screening', 'Jurisdiction gates pre-cleared', 'Evidence packs auto-generated', 'Settlement-ready exports']} />,
          },
        ]}
      />
      <CTABand
        line1="Stop chasing paperwork."
        line2="Start closing trades."
        paragraph="Open a desk and discover your first verified counterparty today."
        buttonLabel="Open your desk"
        buttonHref="/auth"
      />
    </Layout>
  )
}
