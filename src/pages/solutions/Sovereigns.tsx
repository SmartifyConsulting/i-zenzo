import { Layout, PageHero } from '../../components/Layout'
import { ThreeBoxes, CTABand, BulletList } from '../../components/Sections'

function MacroMock() {
  return (
    <div className="rounded-md border border-border bg-card shadow-lg p-6 font-mono text-xs">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-sans font-semibold text-foreground">Macro Telemetry</span>
        <span className="rounded-full bg-emerald-muted text-emerald-brand px-2 py-0.5 text-[10px]">Live</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div><div className="text-sm font-semibold text-foreground">27</div><div className="text-[9px] text-muted-foreground/60">Programmes +3/24h</div></div>
        <div><div className="text-sm font-semibold text-foreground">$2.4B</div><div className="text-[9px] text-muted-foreground/60">Capital +12%/24h</div></div>
        <div><div className="text-sm font-semibold text-foreground">0.02%</div><div className="text-[9px] text-muted-foreground/60">Breach rate −0.4%</div></div>
      </div>
      <div className="border-t border-border pt-3 space-y-1 text-muted-foreground text-[10px]">
        <div>Maize Reserve Strategic Programme · ZAF</div>
        <div>12 participants · 142 milestones · USD 480M deployed · 78% disbursed</div>
      </div>
    </div>
  )
}

export default function Sovereigns() {
  return (
    <Layout>
      <PageHero
        eyebrow="For Sovereigns & PDBs"
        title="Govern institutional trade at scale."
        paragraph="Macro-level oversight of national and multilateral trade programmes, with tamper-evident telemetry down to the individual disbursement."
        tagline="Single approved production-region policy · Tamper-evident ledger · Macro telemetry"
      >
        <MacroMock />
      </PageHero>
      <ThreeBoxes
        eyebrow="See the whole programme"
        title="Oversight without quarterly lag."
        boxes={[
          {
            label: 'Oversight',
            heading: 'Macro-level oversight.',
            content: <p className="text-sm text-muted-foreground">Real-time visibility across every programme, participant and disbursement — not a quarterly report reconstructed after the fact.</p>,
          },
          {
            label: 'Integrity',
            heading: 'Fraud & leakage prevention.',
            content: <BulletList items={['Milestone-linked disbursement', 'Re-attestation on schedule', 'Automated sanctions clearance', 'Fund-flow recorded at source']} />,
          },
          {
            label: 'Data Control',
            heading: 'Institutional data control.',
            content: <BulletList items={['Single approved production-region policy', 'RBAC and row-level security', 'Full audit trail retained', 'Exportable for regulatory review', 'No third-party data resale']} />,
          },
        ]}
      />
      <CTABand
        line1="Stop governing on quarterly lag."
        line2="Start governing in real time."
        paragraph="Request a briefing to see the architecture in detail."
        buttonLabel="Request a briefing"
        buttonHref="/auth"
      />
    </Layout>
  )
}
