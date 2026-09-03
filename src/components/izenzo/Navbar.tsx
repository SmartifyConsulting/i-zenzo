import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Logo } from './Logo'

type Item = { label: string; href: string; desc: string }

const products: Item[] = [
  { label: 'Trade Desk', href: '/products/trade-desk', desc: 'Operational workspace for live deals' },
  { label: 'Compliance Engine', href: '/products/compliance-engine', desc: 'KYB, sanctions & jurisdictional gates' },
  { label: 'Audit Ledger', href: '/products/audit-ledger', desc: 'Tamper-evident, hash-sealed deal records' },
]

const solutions: Item[] = [
  { label: 'Commodity Traders & Corporates', href: '/solutions/traders', desc: 'Execute with absolute certainty' },
  { label: 'Trade Finance & Insurance', href: '/solutions/finance', desc: 'De-risk capital deployment' },
  { label: 'Sovereigns & PDBs', href: '/solutions/sovereigns', desc: 'Govern institutional trade at scale' },
]

const developers: Item[] = [
  { label: 'Documentation', href: '/docs', desc: 'Guides and core resources' },
  { label: 'API Reference', href: '/docs/api', desc: 'Full endpoint reference' },
  { label: 'Webhooks', href: '/docs/webhooks', desc: 'Event notifications' },
  { label: 'System Status', href: '/status', desc: 'Platform status' },
]

const resources: Item[] = [
  { label: 'Pricing', href: '/pricing', desc: 'Infrastructure pricing' },
  { label: 'Platform Walkthrough', href: '/walkthrough', desc: 'End-to-end happy path' },
]

function Dropdown({ label, items }: { label: string; items: Item[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 px-3 h-10 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors">
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-2 w-80 z-50">
          <div className="rounded-md border border-border bg-card shadow-lg p-2">
            {items.map((it) => (
              <Link
                key={it.href}
                to={it.href}
                className="block rounded-md px-3 py-2 hover:bg-muted transition-colors"
              >
                <div className="text-sm font-medium text-foreground">{it.label}</div>
                <div className="text-xs text-muted-foreground">{it.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-20 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            <Dropdown label="Products" items={products} />
            <Dropdown label="Solutions" items={solutions} />
            <Dropdown label="Developers" items={developers} />
            <Dropdown label="Resources" items={resources} />
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 h-10 flex items-center">
            Log In
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center h-10 px-5 rounded-md bg-emerald-950 text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
          >
            Create Account
          </Link>
        </div>
      </div>
    </header>
  )
}
