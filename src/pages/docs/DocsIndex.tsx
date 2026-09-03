import { Link } from 'react-router-dom'
import { DocsLayout } from '../../components/DocsLayout'

const cards = [
  ['Quickstart', 'Provision a workspace and mint your first record.', '/docs/quickstart'],
  ['Authentication', 'X-API-Key headers and key rotation.', '/docs/authentication'],
  ['Webhooks', 'Subscribe to match and settlement events.', '/docs/webhooks'],
  ['API Reference', 'Every endpoint, request and response.', '/docs/api'],
]

const core = [
  ['Trade Requests & Matches', '/docs/matches'],
  ['Counterparties', '/docs/counterparties'],
  ['Evidence Packs', '/docs/evidence'],
  ['Webhooks', '/docs/webhooks'],
]

export default function DocsIndex() {
  return (
    <DocsLayout>
      <h1 className="text-3xl font-semibold text-foreground mb-4">Izenzo Developer Docs</h1>
      <p className="text-muted-foreground max-w-2xl mb-10">
        Build directly on the Izenzo Governance Network. Verify counterparties, create trade requests, and mint
        hash-sealed Proof of Intent records over a REST API.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {cards.map(([title, desc, href]) => (
          <Link key={href} to={href} className="rounded-md border border-border p-5 hover:border-emerald-brand/40 transition-colors">
            <h3 className="font-medium text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{desc}</p>
            <span className="text-xs font-medium text-emerald-brand">Open →</span>
          </Link>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Core resources</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {core.map(([title, href]) => (
          <Link key={href} to={href} className="rounded-md border border-border p-5 hover:border-emerald-brand/40 transition-colors">
            <span className="text-sm font-medium text-foreground">{title}</span>
          </Link>
        ))}
      </div>
      <div className="rounded-md border border-border bg-muted p-5">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60 mb-2">
          Base URL & versioning
        </p>
        <code className="text-sm font-mono text-foreground">https://api.trade.izenzo.co.za/functions/v1</code>
      </div>
    </DocsLayout>
  )
}
