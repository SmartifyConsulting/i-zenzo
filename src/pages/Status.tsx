import { Layout } from '@/components/izenzo/Layout'

export default function Status() {
  return (
    <Layout>
      <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-32 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">Platform information</span>
        <h1 className="mt-3 text-3xl font-semibold text-foreground mb-4">
          Status information not currently published
        </h1>
        <p className="text-muted-foreground">
          Status information is not currently published. Please contact{' '}
          <a href="mailto:support@izenzo.co.za" className="text-emerald-brand">
            Izenzo support
          </a>{' '}
          for platform availability queries.
        </p>

      </div>
    </Layout>
  )
}
