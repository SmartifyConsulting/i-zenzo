import { Link } from 'react-router-dom'

export function Footer({ short = false }: { short?: boolean }) {
  return (
    <footer className="border-t border-border py-8 relative z-10 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold tracking-tighter text-foreground">IZENZO</span>
            <span className="text-[8px] font-mono text-muted-foreground/40 tracking-widest uppercase border border-border px-1 py-px">
              API
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/docs" className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <Link to="/status" className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Status
            </Link>
            <Link to="/pricing" className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            {!short && (
              <Link to="/trust" className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
                Trust
              </Link>
            )}
            <a
              href="mailto:support@izenzo.co.za"
              className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Support
            </a>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-mono text-muted-foreground/40">
            © 2026 Starfair162 (Pty) Ltd t/a Izenzo. All rights reserved.
          </p>
          <p className="text-[9px] font-mono text-muted-foreground/30">
            No VAT charged - supplier not VAT registered in South Africa.
          </p>
        </div>
      </div>
    </footer>
  )
}
