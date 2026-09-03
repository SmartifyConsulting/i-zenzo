import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Layout } from './Layout'

const groups = [
  {
    title: 'Get started',
    items: [
      ['Introduction', '/docs'],
      ['Quickstart', '/docs/quickstart'],
      ['Authentication', '/docs/authentication'],
    ],
  },
  {
    title: 'Core resources',
    items: [
      ['Matches', '/docs/matches'],
      ['Counterparties', '/docs/counterparties'],
      ['Evidence Packs', '/docs/evidence'],
      ['Webhooks', '/docs/webhooks'],
    ],
  },
  {
    title: 'Reference',
    items: [
      ['API Reference', '/docs/api'],
      ['Endpoint pricing', '/docs/api-pricing'],
      ['Errors', '/docs/errors'],
    ],
  },
] as const

export function DocsLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-[240px_1fr] gap-12">
        <aside className="space-y-8">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-2">
                {g.title}
              </p>
              <nav className="space-y-1">
                {g.items.map(([label, href]) => (
                  <Link
                    key={href}
                    to={href}
                    className={`block text-sm rounded-md px-2 py-1.5 transition-colors ${
                      pathname === href
                        ? 'bg-emerald-muted text-emerald-brand font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </aside>
        <div>{children}</div>
      </div>
    </Layout>
  )
}

export function DocStub({ title }: { title: string }) {
  return (
    <div>
      <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">Reference</span>
      <h1 className="mt-2 text-3xl font-semibold text-foreground mb-4">{title}</h1>
      <p className="text-muted-foreground">
        Full guide content for this section lives in the Izenzo developer docs. Use the API Reference for the
        complete endpoint list, or contact support@izenzo.co.za for early access to detailed guides.
      </p>
    </div>
  )
}
