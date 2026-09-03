import { Check } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Badge, Button, Card } from '../components/ui'
import { CTABand } from '../components/Sections'

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
            <h3 className="mt-3 text-2xl font-semibold text-foreground">Operators & Traders</h3>
            <p className="mt-2 text-sm text-muted-foreground">$10.00 USD per credit · 1 credit = 1 Trade Request</p>
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
            <h3 className="mt-3 text-2xl font-semibold">Banks, DFIs & Sovereigns</h3>
            <p className="mt-2 text-sm text-white/60">Custom, tailored to your volume</p>
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
        <p className="text-center text-xs text-muted-foreground/50 mt-8">
          All prices in USD. Credits are purchased securely through PayFast.
        </p>
      </section>

      <section className="py-20 border-t border-border bg-emerald-muted/30">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-center text-foreground mb-10">Always included</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['Cryptographic Hashing', 'Every record is SHA-256 sealed at the moment of creation.'],
              ['Sanctions Screening Workflow', 'OFAC, EU, UK HMT and UN lists checked on a recurring basis.'],
              ['Platform Health', 'Uptime, audit logs and status visibility for every workspace.'],
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
        paragraph="Talk to us, or just start with pay-as-you-go — no commitment required."
        buttonLabel="Contact Sales"
        buttonHref="mailto:sales@izenzo.co.za"
        secondaryLabel="Start with pay-as-you-go"
        secondaryHref="/auth"
      />
    </Layout>
  )
}
