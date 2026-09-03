import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-950 text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="10" height="10" rx="1" />
          <rect x="11" y="11" width="10" height="10" rx="1" />
        </svg>
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-foreground">Izenzo</span>
    </Link>
  )
}
