import { Link } from "@/lib/router-compat";
import { DocsLayout } from "@/components/izenzo/DocsLayout";

const cards: [string, string, string][] = [
  ["Quickstart", "Issue an API key and make your first authenticated call in under five minutes.", "/docs/quickstart"],
  ["Authentication", "API keys, scopes, rate limits, and the lockout policy.", "/docs/authentication"],
  [
    "Webhooks",
    "Signed HMAC-SHA256 callbacks for state changes, with automatic retries and dead-letter queue.",
    "/docs/webhooks",
  ],
  ["API Reference", "Every endpoint, parameter, response shape, and error code.", "/docs/api"],
];

const core: [string, string, string][] = [
  [
    "Trade Requests & Matches",
    "A Trade Request is the persistent unit of intent; a Match is the bilateral child record that runs through the POI state machine. Lifecycle, transitions, terms.",
    "/docs/matches",
  ],
  [
    "Counterparties",
    "Verified organisations you can transact with. KYB, UBO, Authority-to-Bind.",
    "/docs/counterparties",
  ],
  [
    "Evidence Packs",
    "Tamper-evident, SHA-256-sealed audit record for every settled deal. Includes the Without a Doubt (WaD) certificate and its 10 hard-gates.",
    "/docs/evidence",
  ],
  [
    "Webhooks",
    "Signed HTTP callbacks for state changes. HMAC-SHA256 verification, automatic retries.",
    "/docs/webhooks",
  ],
];

export default function DocsIndex() {
  return (
    <DocsLayout>
      <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">Documentation</span>
      <h1 className="mt-3 text-3xl font-semibold text-foreground mb-4">Izenzo Developer Docs</h1>
      <p className="text-muted-foreground max-w-2xl mb-10 leading-relaxed">
        Izenzo is governance infrastructure for cross-border trade. Use the API to verify counterparties, open
        Trade Requests, mint cryptographically sealed Proof of Intent (POI), seal the Without a Doubt (WaD)
        certificate, and produce tamper-evident evidence packs your auditors can verify offline.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {cards.map(([title, desc, href]) => (
          <Link
            key={title + href}
            to={href}
            className="rounded-md border border-border p-5 hover:border-emerald-brand/40 transition-colors"
          >
            <h3 className="font-medium text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{desc}</p>
            <span className="text-xs font-medium text-emerald-brand">Open →</span>
          </Link>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">Core resources</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Every API call manipulates one of four primitives. Read these once and the rest of the surface area
        follows naturally.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {core.map(([title, desc, href]) => (
          <Link
            key={title + href}
            to={href}
            className="rounded-md border border-border p-5 hover:border-emerald-brand/40 transition-colors"
          >
            <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>
      <div className="rounded-md border border-border bg-muted p-5">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60 mb-2">
          Base URL &amp; versioning
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          All endpoints are served from a single base URL. The API is unversioned at the path level;
          backwards-incompatible changes are announced 90 days in advance via the developer changelog and your
          account contact.
        </p>
        <code className="text-sm font-mono text-foreground">https://api.trade.izenzo.co.za/functions/v1</code>
      </div>
    </DocsLayout>
  );
}
