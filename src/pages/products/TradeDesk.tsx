import { Layout, PageHero } from '../../components/Layout'
import { ThreeBoxes, CTABand, BulletList } from '../../components/Sections'
import { CertificateOfIntent } from '../../components/CertificateMock'

export default function TradeDesk() {
  return (
    <Layout>
      <PageHero
        eyebrow="Trade Desk"
        title="Governance infrastructure for the deal maker."
        paragraph="The all-in-one terminal for institutional commodity trade. Discover counterparties, run governed compliance workflow, and record cross-border trade intent with cryptographically hashed Proof of Intent."
        tagline="SHA-256 sealed · Tamper-evident · Audit-ready"
      >
        <CertificateOfIntent />
      </PageHero>
      <ThreeBoxes
        eyebrow="The system"
        title="Precision-engineered for institutional throughput."
        boxes={[
          {
            label: 'Protocol',
            heading: 'The 9-Gate Protocol.',
            content: (
              <BulletList
                items={[
                  'Entity Verification',
                  'UBO Disclosure',
                  'Sanctions Screening',
                  'Jurisdiction Resolution',
                  'Authority Binding',
                  'Terms Lock',
                  'Evidence Attachment',
                  'Bilateral Collapse Sign',
                  'WaD Certificate Issuance',
                ]}
              />
            ),
          },
          {
            label: 'Compliance',
            heading: 'KYB integrated.',
            content: (
              <BulletList
                items={[
                  'Entity verification',
                  'Beneficial-owner disclosure',
                  'Sanctions & PEP screening',
                  'Jurisdiction recorded at onboarding',
                ]}
              />
            ),
          },
          {
            label: 'Observability',
            heading: 'Real-time telemetry.',
            content: (
              <div className="font-mono text-[11px] space-y-1.5 text-muted-foreground">
                <div>00:01 match_created GLN-SG</div>
                <div>00:04 kyc_verified GLN-SG</div>
                <div>00:07 sanctions_screened GLN-SG</div>
                <div>00:12 terms_locked GLN-SG</div>
                <div>00:15 poi_generated GLN-SG</div>
              </div>
            ),
          },
        ]}
      />
      <CTABand
        line1="Open your desk"
        line2="in minutes."
        paragraph="Provision a workspace, verify your first counterparty, and mint a hash-sealed Proof of Intent today."
        buttonLabel="Open your desk"
        buttonHref="/auth"
      />
    </Layout>
  )
}
