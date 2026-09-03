import { Layout } from '../components/Layout'

const sections: { h: string; body: React.ReactNode }[] = [
  {
    h: 'Shared responsibility',
    body: 'Izenzo secures the platform infrastructure; workspace administrators are responsible for managing user access, API key rotation, and the accuracy of data submitted to the network.',
  },
  {
    h: 'Access & authentication',
    body: (
      <ul className="space-y-1.5 list-disc list-inside">
        <li>Email and password authentication</li>
        <li>Role-based access control (RBAC) per workspace</li>
        <li>Row-level security on all tenant data</li>
        <li>API keys scoped per workspace, revocable at any time</li>
        <li>Session expiry and re-authentication for sensitive actions</li>
      </ul>
    ),
  },
  {
    h: 'Platform & hosting context',
    body: (
      <ul className="space-y-1.5 list-disc list-inside">
        <li>Managed Postgres database</li>
        <li>Object storage for evidence and documents</li>
        <li>Serverless functions for API endpoints</li>
        <li>TLS in transit for all traffic</li>
      </ul>
    ),
  },
  {
    h: 'Data we collect & how it is used',
    body: 'We collect account, entity, KYB/KYC, and trade-record data necessary to operate the governance network. This data is used to verify counterparties, run compliance workflow, and produce hash-sealed trade records — never sold to third parties.',
  },
  {
    h: 'Retention & deletion',
    body: (
      <ul className="space-y-1.5 list-disc list-inside">
        <li>Trade records are retained per regulatory requirements</li>
        <li>Account data is retained for the life of the workspace</li>
        <li>Deletion requests are honoured subject to audit retention obligations</li>
      </ul>
    ),
  },
  { h: 'Subprocessors & integrations', body: 'A current list of subprocessors is available on request.' },
  { h: 'Cookies & analytics', body: 'We use minimal, privacy-respecting analytics to operate and improve the platform.' },
  {
    h: 'Privacy requests',
    body: (
      <>
        For privacy requests, contact{' '}
        <a href="mailto:privacy@izenzo.co.za" className="text-emerald-brand">
          privacy@izenzo.co.za
        </a>
        .
      </>
    ),
  },
  {
    h: 'Security contact & vulnerability reporting',
    body: (
      <>
        Report security issues to{' '}
        <a href="mailto:security@izenzo.co.za" className="text-emerald-brand">
          security@izenzo.co.za
        </a>
        .
      </>
    ),
  },
  {
    h: 'Compliance & certifications',
    body: (
      <>
        For compliance enquiries, including POPIA, contact{' '}
        <a href="mailto:compliance@izenzo.co.za" className="text-emerald-brand">
          compliance@izenzo.co.za
        </a>
        .
      </>
    ),
  },
]

export default function Trust() {
  return (
    <Layout>
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-16">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">Trust Surface</span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-foreground mb-2">Trust, security &amp; privacy</h1>
        <p className="text-muted-foreground mb-1">
          How Izenzo secures the governance network and handles the data within it.
        </p>
        <p className="text-xs text-muted-foreground/50 mb-12">Last updated: 21 June 2026</p>

        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="text-lg font-semibold text-foreground mb-2">{s.h}</h2>
              <div className="text-sm text-muted-foreground leading-relaxed">{s.body}</div>
            </div>
          ))}
        </div>

        <p className="mt-14 text-xs italic text-muted-foreground/50">
          This page is editable project content maintained by the Izenzo team. It is not independently verified and
          should not be relied upon as legal advice.
        </p>
      </div>
    </Layout>
  )
}
