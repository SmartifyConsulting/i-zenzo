const items = [
  'LEDGER: TAMPER-EVIDENT',
  'LEDGER: SHA-256',
  'REGION: SINGLE APPROVED POLICY',
  'STATE: ATOMIC',
]

export function Ticker() {
  const doubled = [...items, ...items]
  return (
    <section className="py-10 border-t border-border overflow-hidden bg-background">
      <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground/50 mb-6">
        Platform Architecture &amp; Standards
      </p>
      <div className="relative flex overflow-hidden">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-brand" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
