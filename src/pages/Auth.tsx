import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { AuthShell, PasswordField, SubmitButton, TextField } from "@/components/izenzo/AuthShell";
import * as api from "@/lib/api";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        await api.signUp(name || email.split("@")[0]!, email, password);
      } else {
        await api.signIn(email, password);
      }
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const message = err?.message ?? "Something went wrong";
      if (message.toLowerCase().includes("inbox")) setNotice(message);
      else setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        {mode === "signin" ? "Sign in" : "Create your account"}
      </h2>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      {notice && (
        <div className="mb-4 rounded-md bg-muted border border-border px-3 py-2 text-xs text-muted-foreground">
          {notice}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <TextField label="Full name" placeholder="Jane Trader" value={name} onChange={setName} />
        )}
        <TextField
          label="Email"
          type="email"
          placeholder="you@institution.com"
          value={email}
          onChange={setEmail}
          required
        />
        <PasswordField
          label="Password"
          placeholder={mode === "signin" ? "••••••••" : "Minimum 8 characters"}
          value={password}
          onChange={setPassword}
          required
          action={
            mode === "signin" ? (
              <Link to="/forgot-password" tabIndex={-1} className="text-xs text-emerald-brand">
                Forgot password?
              </Link>
            ) : null
          }
        />
        {mode === "signup" && (
          <PasswordField
            label="Confirm password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />
        )}
        <SubmitButton disabled={busy}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </SubmitButton>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {mode === "signin" ? (
          <>
            New to Izenzo?{" "}
            <button
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className="text-emerald-brand font-medium"
            >
              Create account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className="text-emerald-brand font-medium"
            >
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
