import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}) {
  const base =
    'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md text-sm font-semibold transition-all duration-200'
  const styles =
    variant === 'primary'
      ? 'bg-emerald-brand text-white shadow-md hover:-translate-y-0.5 hover:bg-emerald-bright hover:shadow-lg'
      : 'bg-white/80 backdrop-blur border border-emerald-brand/20 text-emerald-brand hover:bg-emerald-muted hover:-translate-y-0.5'
  const external = href.startsWith('http') || href.startsWith('mailto:')
  if (external) {
    return (
      <a href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  )
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-muted border border-emerald-brand/20 px-4 py-1.5 text-xs font-medium text-emerald-brand shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand animate-pulse" />
      {children}
    </span>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-brand">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand" />
      {children}
    </span>
  )
}

export function Card({ children, className = '', dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={`rounded-md border ${
        dark ? 'bg-emerald-950 border-emerald-950 text-white' : 'bg-card border-border'
      } shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function MeshBackground() {
  return (
    <div className="mesh-bg">
      <span style={{ top: '-10%', left: '5%', width: 420, height: 420, background: 'rgba(165,243,207,.55)' }} />
      <span style={{ top: '10%', right: '0%', width: 380, height: 380, background: 'rgba(183,245,231,.6)' }} />
      <span style={{ bottom: '-15%', left: '20%', width: 460, height: 460, background: 'rgba(160,171,238,.5)' }} />
      <span style={{ top: '30%', left: '40%', width: 340, height: 340, background: 'rgba(199,250,233,.6)' }} />
      <span style={{ bottom: '0%', right: '15%', width: 400, height: 400, background: 'rgba(174,193,244,.45)' }} />
    </div>
  )
}

export function SectionEyebrowBadge({ children }: { children: ReactNode }) {
  return <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60 text-center">{children}</p>
}
