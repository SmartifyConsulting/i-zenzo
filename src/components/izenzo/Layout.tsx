import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout({ children, shortFooter = false }: { children: ReactNode; shortFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer short={shortFooter} />
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  paragraph,
  tagline,
  children,
}: {
  eyebrow: string
  title: ReactNode
  paragraph: string
  tagline?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand mb-4 inline-block">
            {eyebrow}
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight text-foreground mb-6">
            {title}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-8 max-w-lg">{paragraph}</p>
          {tagline && (
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">{tagline}</p>
          )}
        </div>
        {children && <div>{children}</div>}
      </div>
    </section>
  )
}
