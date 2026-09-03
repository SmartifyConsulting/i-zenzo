import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { AuthShell, PasswordField, SubmitButton, TextField } from "@/components/izenzo/AuthShell";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <AuthShell>
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        {mode === "signin" ? "Sign in" : "Create your account"}
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
        <TextField label="Email" type="email" placeholder="you@institution.com" />
        <PasswordField
          label="Password"
          placeholder={mode === "signin" ? "••••••••" : "Minimum 8 characters"}
          action={
            mode === "signin" ? (
              <Link to="/forgot-password" tabIndex={-1} className="text-xs text-emerald-brand">
                Forgot password?
              </Link>
            ) : null
          }
        />
        {mode === "signup" && <PasswordField label="Confirm password" placeholder="Re-enter password" />}
        <SubmitButton>{mode === "signin" ? "Sign in" : "Create account"}</SubmitButton>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {mode === "signin" ? (
          <>
            New to Izenzo?{" "}
            <button onClick={() => setMode("signup")} className="text-emerald-brand font-medium">
              Create account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setMode("signin")} className="text-emerald-brand font-medium">
              Sign in
            </button>
          </>
        )}
      </p>

      <p className="text-center text-[11px] text-muted-foreground/50 mt-6 leading-relaxed">
        Data is processed within our single approved production region policy. By continuing you agree to our{" "}
        <Link to="/trust" className="underline">
          Trust, Security &amp; Privacy
        </Link>{" "}
        terms.
      </p>
    </AuthShell>
  );
}
