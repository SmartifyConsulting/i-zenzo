import { Check } from 'lucide-react'
import { Layout } from '@/components/izenzo/Layout'
import { Badge, Button, Card } from '@/components/izenzo/ui'
import { CTABand } from '@/components/izenzo/Sections'

const opFeatures = [
  'Live Match Compiler',
  'Admin-controlled KYB and sanctions screening workflow',
  'SHA-256 hashed Proof of Intent',
  'Standard API Access',
]
const instFeatures = [
  'Audit Ledger API Access',
  'Custom Sanctions Matrix',
  'Dedicated Infrastructure & SLA',
  'Enterprise Account Manager',
]
const bundles = [
  ['1 credit', '$10'],
  ['10 credits', '$100'],
  ['50 credits', '$500'],
  ['200 credits', '$2,000'],
]

export default function Pricing() {
  return (
    <Layout>
      <section className="py-24 border-b border-border">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <Badge>Pricing</Badge>
          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
            Infrastructure pricing. <span className="gradient-text">Scalable and predictable.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Pay only for the Proof-of-Intent records you mint. No opaque licenses, no hidden fees. Volume pricing
            available for institutions.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">Pay-as-you-go</span>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">Operators &amp; Traders</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For trading desks and corporates executing verified cross-border matches.
            </p>
            <p className="mt-6 text-4xl font-semibold text-foreground">
              $10.00 <span className="text-base font-normal text-muted-foreground">USD</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">per credit · 1 credit = 1 Trade Request</p>
            <div className="mt-6 space-y-2">
              {bundles.map(([label, price]) => (
                <div key={label} className="flex justify-between text-sm border-b border-border pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{price}</span>
                </div>
              ))}
            </div>
            <Button href="/auth" className="w-full mt-6">Provision Workspace</Button>
            <ul className="mt-6 space-y-2">
              {opFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="text-emerald-brand shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
          </Card>

          <Card dark className="p-8">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">Institutional</span>
            <h3 className="mt-3 text-2xl font-semibold">Banks, DFIs &amp; Sovereigns</h3>
            <p className="mt-2 text-sm text-white/60">
              For public development banks and trade finance underwriters requiring oversight.
            </p>
            <p className="mt-6 text-4xl font-semibold">Custom</p>
            <p className="mt-1 text-xs text-white/50">tailored to your volume</p>
            <a
              href="mailto:sales@izenzo.co.za"
              className="inline-flex items-center justify-center w-full mt-6 h-12 rounded-md bg-emerald-brand text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform"
            >
              Contact Sales
            </a>
            <ul className="mt-6 space-y-2">
              {instFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check size={16} className="text-emerald-brand shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <p className="text-center text-xs text-muted-foreground/50 mt-8 max-w-[700px] mx-auto">
          All prices in USD. Credits are purchased securely through PayFast. Pay-as-you-go billed per successful
          Proof of Intent. Institutional contracts include volume commitments and dedicated SLAs.
        </p>
      </section>

      <section className="py-20 border-t border-border bg-emerald-muted/30">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-brand text-center">
            Always included
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-center text-foreground mb-10">
            Every plan ships with the platform foundation.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              [
                'Cryptographic Hashing',
                'SHA-256 hash recorded on critical state transitions. Coverage is being progressively hardened.',
              ],
              [
                'Sanctions Screening Workflow',
                'Periodic OFAC, EU, UK HMT, and DPL background screening on configured cadence.',
              ],
              [
                'Platform Health',
                'Internal platform-health monitoring. Public status feed is in development.',
              ],
            ].map(([h, d]) => (
              <div key={h}>
                <h3 className="font-medium text-foreground mb-2">{h}</h3>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        line1="Not sure"
        line2="which tier fits?"
        paragraph="Speak to our institutional team. We'll size the right contract for your trade volume and governance requirements."
        buttonLabel="Contact Sales"
        buttonHref="mailto:sales@izenzo.co.za"
        secondaryLabel="Start with pay-as-you-go"
        secondaryHref="/auth"
      />

    </Layout>
  )
}
