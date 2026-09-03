import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { MeshBackground } from '../components/ui'

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-card">
      <MeshBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
      <header className="relative z-10 max-w-[1280px] mx-auto w-full px-4 sm:px-6 h-20 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Logo />
          <span className="ml-2">Back to Izenzo home</span>
        </Link>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-md border border-border bg-card shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {mode === 'signin' ? 'Sign in' : 'Create your account'}
          </h2>

          <div className="space-y-3 mb-6">
            <button className="w-full h-11 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
              Continue with Microsoft
            </button>
            <button className="w-full h-11 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground/60 font-mono uppercase">Or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                placeholder="you@institution.com"
                className="w-full h-11 rounded-md border border-border px-3 text-sm outline-none focus:border-emerald-brand"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                {mode === 'signin' && (
                  <a href="#" className="text-xs text-emerald-brand">
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                type="password"
                placeholder={mode === 'signin' ? '••••••••' : 'Minimum 8 characters'}
                className="w-full h-11 rounded-md border border-border px-3 text-sm outline-none focus:border-emerald-brand"
              />
            </div>
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Confirm password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  className="w-full h-11 rounded-md border border-border px-3 text-sm outline-none focus:border-emerald-brand"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full h-11 rounded-md bg-emerald-brand text-white text-sm font-semibold hover:bg-emerald-bright transition-colors"
            >
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'signin' ? (
              <>
                New to Izenzo?{' '}
                <button onClick={() => setMode('signup')} className="text-emerald-brand font-medium">
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('signin')} className="text-emerald-brand font-medium">
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="text-center text-[11px] text-muted-foreground/50 mt-6 leading-relaxed">
            Data is processed within our single approved production region policy. By continuing you agree to our{' '}
            <Link to="/trust" className="underline">
              Trust, Security &amp; Privacy
            </Link>{' '}
            terms.
          </p>
        </div>
      </div>
    </div>
  )
}
