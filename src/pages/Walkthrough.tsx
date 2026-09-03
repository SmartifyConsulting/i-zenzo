import { Layout } from '../components/Layout'

const phases = [
  {
    title: 'Phase 1 – Entity Onboarding & Due Diligence (~2 min)',
    steps: [
      'Create organizations',
      'Register entities, UBOs and Authority-to-Bind',
      'Upload KYC documents',
      'Run sanctions & PEP screening',
      'Compute risk scores',
      'Complete approval workflow',
      'Issue Approved-to-Trade certificate',
    ],
  },
  {
    title: 'Phase 2 – Discovery & Matching (~1.5 min)',
    steps: [
      'Create signals',
      'Run match discovery',
      'Send invite',
      'Send trade request (1 credit burn at $1.00 USD/credit)',
    ],
  },
  {
    title: 'Phase 3 – Intent Lifecycle & Collapse (~2 min)',
    steps: [
      'Run pre-flight checks',
      'Compute intent completion probability (≥ 50.1%)',
      'Execute signed intent collapse',
    ],
  },
  {
    title: 'Phase 4 – Evidence & Final Output (~1.5 min)',
    steps: [
      'Generate Evidence Pack v1',
      'Confirm Signed Deal with hard-gates',
      'Collect attestations',
      'Seal hash chain',
      'Export certificate',
      'Export audit log',
    ],
  },
]

const hardGates = [
  'All 9 compliance gates verified before collapse',
  'No unresolved sanctions hits',
  'Authority-to-bind confirmed for both parties',
  'Terms locked prior to signature',
]

const checklist = [
  'Entity verified and KYB reviewed',
  'UBOs disclosed and resolved',
  'Sanctions screening cleared',
  'Signal created and match discovered',
  'Trade request sent and accepted',
  'Intent completion probability ≥ 50.1%',
  'Signed intent collapse executed',
  'Evidence pack and certificate exported',
]

export default function Walkthrough() {
  return (
    <Layout>
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-16">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">
          System-level Walkthrough
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          Complete End-to-End Happy Path (5 to 8 min)
        </h1>
        <div className="flex gap-6 text-xs text-muted-foreground font-mono mb-12">
          <span>Steps: 19</span>
          <span>Outcome: Signed, hash-sealed trade certificate</span>
        </div>

        <div className="space-y-10">
          {phases.map((p, i) => (
            <div key={p.title}>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {i + 1}. {p.title}
              </h2>
              <ul className="space-y-1.5">
                {p.steps.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 text-emerald-brand">☐</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Hard-Gates Confirmed</h3>
            <ul className="space-y-1.5">
              {hardGates.map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-brand shrink-0" /> {g}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Verification Checklist</h3>
            <ul className="space-y-1.5">
              {checklist.map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 text-emerald-brand">☐</span> {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}
