import { DocsLayout } from '../../components/DocsLayout'

const groups: { name: string; endpoints: [string, string, string][] }[] = [
  {
    name: 'Matches',
    endpoints: [
      ['POST', '/match', 'Create a new match'],
      ['GET', '/match/:id', 'Retrieve a match'],
      ['POST', '/match/:id/settle', 'Settle a match'],
      ['GET', '/matches', 'List matches'],
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
        The Izenzo API is REST over HTTPS. Authenticate every request with an <code className="text-xs bg-muted px-1.5 py-0.5 rounded">X-API-Key</code> header
        issued from your workspace.
      </p>

      <h2 className="text-lg font-semibold text-foreground mb-3">Worked example: create a match</h2>
      <pre className="text-xs font-mono bg-emerald-950 text-white rounded-md p-4 overflow-x-auto mb-3">
{`curl -X POST https://api.trade.izenzo.co.za/functions/v1/match \\
  -H "X-API-Key: $IZENZO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"counterparty_id":"cp_9f2a","commodity":"copper_cathode","volume_mt":500}'`}
      </pre>
      <pre className="text-xs font-mono bg-muted rounded-md p-4 overflow-x-auto mb-14">
{`{
  "match_id": "mtc_7c2e9d1a",
  "status": "pending_verification",
  "created_at": "2026-09-03T10:14:02Z"
}`}
      </pre>

      <h2 className="text-lg font-semibold text-foreground mb-4">All endpoints</h2>
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
