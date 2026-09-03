import { Layout, PageHero } from '../../components/Layout'
import { ThreeBoxes, CTABand, BulletList } from '../../components/Sections'

function KybMock() {
  return (
    <div className="rounded-md border border-border bg-card shadow-lg p-6 font-mono text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-sans font-semibold text-foreground">Aurelia Trade Holdings (Pty) Ltd</span>
        <span className="rounded-full bg-emerald-muted text-emerald-brand px-2 py-0.5 text-[10px]">
          KYB reviewed
        </span>
      </div>
      <p className="text-muted-foreground/60 text-[10px] mb-4">Reg 2019/438217/07 ZA</p>
      <div className="flex gap-4 text-[10px] uppercase tracking-widest text-muted-foreground/50 border-b border-border pb-2 mb-3">
        <span className="text-emerald-brand">§01 Entity</span>
        <span>§02 Owners</span>
        <span>§03 Documents</span>
      </div>
      <div className="space-y-2 text-muted-foreground">
        {[
          ['Aurelia Holdings AG', '51%'],
          ['Marcus Van Der Berg', '32.5%'],
          ['Pinehurst Trust', '16.5%'],
        ].map(([n, p]) => (
          <div key={n} className="flex justify-between">
            <span>{n}</span>
            <span className="text-foreground">{p}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border flex justify-between text-[10px]">
        <span className="text-muted-foreground/60">100.0% Resolved</span>
        <span className="text-muted-foreground/40 break-all">a1f9…8c2e</span>
      </div>
    </div>
  )
}

export default function ComplianceEngine() {
  return (
    <Layout>
      <PageHero
        eyebrow="Compliance Engine"
        title="Institutional identity. Resolved."
        paragraph="Admin-controlled KYB, ultimate beneficial owner resolution, and global sanctions screening — built directly into the trade workflow, not bolted on."
        tagline="OFAC · EU · UK HMT · DPL · Periodic screening"
      >
        <KybMock />
      </PageHero>
      <ThreeBoxes
        eyebrow="Three primitives"
        title="One reviewed counterparty."
        boxes={[
          {
            label: 'Intelligence',
            heading: 'AI document extraction.',
            content: (
              <pre className="text-[10px] font-mono text-muted-foreground bg-muted rounded p-3 overflow-x-auto">
{`{
  "source": "Certificate.pdf",
  "legal_name": "Aurelia Trade Holdings",
  "registration_number": "2019/438217/07",
  "jurisdiction": "ZA",
  "incorporation_date": "2019-03-11"
}`}
              </pre>
            ),
          },
          {
            label: 'Screening',
            heading: 'Periodic sanctions screening.',
            content: (
              <BulletList items={['OFAC SDN', 'EU Consolidated', 'UK HM Treasury', 'UN Security Council', 'PEP databases']} />
            ),
          },
          {
            label: 'Ownership',
            heading: 'UBO graphing.',
            content: <p className="text-sm text-muted-foreground">100% resolved · 4 ultimate beneficial owners mapped through a full ownership tree, root entity to natural persons.</p>,
          },
        ]}
      />
      <CTABand
        line1="Compliance,"
        line2="as infrastructure."
        paragraph="Provision a workspace and verify your first counterparty in minutes."
        buttonLabel="Provision Workspace"
        buttonHref="/auth"
        secondaryLabel="Read the docs"
        secondaryHref="/docs"
      />
    </Layout>
  )
}
