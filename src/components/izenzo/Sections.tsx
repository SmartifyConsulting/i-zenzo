import type { ReactNode } from 'react'
import { Button } from './ui'

export function ThreeBoxes({
  eyebrow,
  title,
  boxes,
}: {
  eyebrow: string
  title: string
  boxes: { label: string; heading: string; content: ReactNode }[]
}) {
  return (
    <section className="py-24 border-t border-border bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">{eyebrow}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {boxes.map((box, i) => (
            <div key={i} className="rounded-md border border-border bg-card p-6">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                Box 0{i + 1} · {box.label}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-foreground mb-3">{box.heading}</h3>
              <div className="text-sm text-muted-foreground leading-relaxed">{box.content}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTABand({
  line1,
  line2,
  paragraph,
  buttonLabel,
  buttonHref,
  secondaryLabel,
  secondaryHref,
}: {
  line1: string
  line2: string
  paragraph: string
  buttonLabel: string
  buttonHref: string
  secondaryLabel?: string
  secondaryHref?: string
}) {
  return (
    <section className="py-24 border-t border-border bg-emerald-muted/40">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          {line1} <span className="gradient-text">{line2}</span>
        </h2>
        <p className="mt-4 text-base text-muted-foreground">{paragraph}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href={buttonHref}>{buttonLabel}</Button>
          {secondaryLabel && secondaryHref && (
            <Button href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-brand shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  )
}
