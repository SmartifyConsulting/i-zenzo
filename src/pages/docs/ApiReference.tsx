import { DocsLayout } from '@/components/izenzo/DocsLayout'

const groups: { name: string; endpoints: [string, string, string][] }[] = [
  {
    name: 'Matches',
    endpoints: [
      ['POST', '/match', 'Record bilateral trade intent.'],
      ['GET', '/match/:id', 'Retrieve a match by ID.'],
      ['POST', '/match/:id/settle', 'Confirm intent and seal the collapse ledger.'],
      ['GET', '/matches', 'List matches scoped to your organisation.'],
    ],
  },

  {
    name: 'Counterparties',
    endpoints: [
      ['POST', '/entities', 'Register an entity'],
      ['GET', '/entities', 'List entities'],
      ['POST', '/authority-bind', 'Bind signing authority'],
      ['POST', '/trade-approval', 'Submit for trade approval'],
      ['GET', '/trade-status', 'Check approval status'],
    ],
  },
  {
    name: 'Discovery & signals',
    endpoints: [
      ['POST', '/signals', 'Create a discovery signal'],
      ['GET', '/signals/:id', 'Retrieve a signal'],
      ['POST', '/signals/:id/select', 'Select a signal'],
      ['POST', '/search', 'Search verified liquidity'],
    ],
  },
  {
    name: 'Settlement & evidence',
    endpoints: [
      ['POST', '/p3-wad', 'Issue a WaD certificate'],
      ['GET', '/evidence-pack/:matchId', 'Fetch an evidence pack'],
      ['POST', '/pods', 'Record proof of delivery/settlement'],
    ],
  },
  {
    name: 'Webhooks',
    endpoints: [
      ['POST', '/webhooks', 'Register a webhook'],
      ['GET', '/webhooks', 'List webhooks'],
      ['DELETE', '/webhooks/:id', 'Remove a webhook'],
    ],
  },
  {
    name: 'Operational',
    endpoints: [
      ['GET', '/healthz', 'Health check'],
      ['POST', '/api-keys', 'Create an API key'],
      ['GET', '/api-keys', 'List API keys'],
      ['DELETE', '/api-keys/:id', 'Revoke an API key'],
      ['GET', '/audit-logs', 'Fetch audit logs'],
    ],
  },
]

const methodColor: Record<string, string> = {
  GET: 'bg-emerald-muted text-emerald-brand',
  POST: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
}

export default function ApiReference() {
  return (
    <DocsLayout>
      <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">Reference</span>
      <h1 className="mt-2 text-3xl font-semibold text-foreground mb-4">API Reference</h1>
      <p className="text-muted-foreground max-w-2xl mb-10">
        The Izenzo API is REST over HTTPS. All requests authenticate with an{' '}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">X-API-Key</code> header, all bodies are JSON, and
        every state-changing response carries a deterministic SHA-256 hash for offline verification.
      </p>

      <h2 className="text-lg font-semibold text-foreground mb-2">Worked example: create a match</h2>
      <p className="text-sm text-muted-foreground max-w-2xl mb-4">
        Records bilateral intent between two registered counterparties. Returns the canonical match record with
        its content hash. Pass an <code className="text-xs bg-muted px-1.5 py-0.5 rounded">Idempotency-Key</code>{' '}
        on every write so retries are safe.
      </p>
      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-2">Request · bash</p>
      <pre className="text-xs font-mono bg-emerald-950 text-white rounded-md p-4 overflow-x-auto mb-4">
{`curl https://api.trade.izenzo.co.za/functions/v1/match \\
  -H "X-API-Key: sk_live_..." \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 9f86d081-884c-7d65-9a2f-eaa0c55ad015" \\
  -d '{
    "buyer":  { "id": "B001", "name": "Aurubis AG" },
    "seller": { "id": "S001", "name": "Glencore Singapore Pte Ltd" },
    "commodity": "Copper Cathode · LME Grade A",
    "quantity": { "amount": 500, "unit": "MT" },
    "price":    { "amount": 9420, "currency": "USD" }
  }'`}
      </pre>
      <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-2">
        Response · 200 · json
      </p>
      <pre className="text-xs font-mono bg-muted rounded-md p-4 overflow-x-auto mb-14">
{`{
  "id": "match_01HX7Z9K3M2P4Q6R8T0V2X4Y6A",
  "status": "matched",
  "state":  "discovery",
  "hash":   "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  "created_at": "2026-04-18T09:14:22.000Z"
}`}
      </pre>

      <h2 className="text-lg font-semibold text-foreground mb-2">All endpoints</h2>
      <p className="text-sm text-muted-foreground max-w-2xl mb-6">
        Base URL: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">https://api.trade.izenzo.co.za/functions/v1</code>.
        Endpoints in the discovery, settlement, and webhook groups have dedicated guides linked above.
      </p>

      <div className="space-y-8">
        {groups.map((g) => (
          <div key={g.name}>
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-2">{g.name}</p>
            <div className="border border-border rounded-md divide-y divide-border">
              {g.endpoints.map(([method, path, desc]) => (
                <div key={path} className="flex items-center gap-4 px-4 py-2.5">
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${methodColor[method]}`}>
                    {method}
                  </span>
                  <code className="text-xs font-mono text-foreground w-56">{path}</code>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DocsLayout>
  )
}
