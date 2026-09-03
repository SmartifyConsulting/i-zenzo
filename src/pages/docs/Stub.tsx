import { useLocation } from 'react-router-dom'
import { DocsLayout, DocStub } from '../../components/DocsLayout'

const titles: Record<string, string> = {
  '/docs/quickstart': 'Quickstart',
  '/docs/authentication': 'Authentication',
  '/docs/matches': 'Matches',
  '/docs/counterparties': 'Counterparties',
  '/docs/evidence': 'Evidence Packs',
  '/docs/webhooks': 'Webhooks',
  '/docs/api-pricing': 'Endpoint pricing',
  '/docs/errors': 'Errors',
}

export default function DocStubPage() {
  const { pathname } = useLocation()
  return (
    <DocsLayout>
      <DocStub title={titles[pathname] ?? 'Documentation'} />
    </DocsLayout>
  )
}
