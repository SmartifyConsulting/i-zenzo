import { ArrowRight, ChevronRight } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Badge, Button, MeshBackground } from '../components/ui'
import { Ticker } from '../components/Ticker'

export default function Home() {
  return (
    <Layout shortFooter>
      <section className="relative overflow-hidden bg-card">
        <MeshBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
        <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 py-28 flex flex-col items-center text-center min-h-[calc(100vh-80px)] justify-center">
          <Badge>Izenzo Governance Network</Badge>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[68px] font-semibold leading-[1.05] tracking-tight text-foreground max-w-4xl">
            Governance Infrastructure for <span className="gradient-text">Institutional Trade.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl">
            One cryptographic network. Access it via our turnkey Trade Desk, manage risk through the Compliance
            Profile, or build directly on the API. All backed by hash-sealed, independently verifiable execution.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button href="/auth" variant="primary">
              Provision Workspace <ArrowRight size={16} />
            </Button>
            <Button href="/docs" variant="secondary">
              Read the Docs <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </section>
      <Ticker />
    </Layout>
  )
}
