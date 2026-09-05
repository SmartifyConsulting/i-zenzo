import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { AuthShell, PasswordField, SubmitButton } from "@/components/izenzo/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setReady(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) return setError(err.message);
    setDone(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 1200);
  }

  return (
    <AuthShell>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Choose a new password</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Minimum 8 characters. Your new credential is bound to the same workspace authority record.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      {!ready && !done && (
        <div className="mb-4 rounded-md bg-muted border border-border px-3 py-2 text-xs text-muted-foreground">
          Open this page from the reset link in your email to set a new password.
        </div>
      )}

      {done ? (
        <div className="rounded-md bg-muted border border-border px-3 py-3 text-sm text-muted-foreground">
          Password updated. Taking you to your workspace…
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <PasswordField
            label="New password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={setPassword}
            required
          />
          <PasswordField
            label="Confirm new password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={setConfirm}
            required
          />
          <SubmitButton disabled={busy || !ready}>{busy ? "Updating…" : "Update password"}</SubmitButton>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link to="/auth" className="text-emerald-brand font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
