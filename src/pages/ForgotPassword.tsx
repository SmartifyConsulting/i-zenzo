import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { AuthShell, SubmitButton, TextField } from "@/components/izenzo/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) setError(err.message);
    else setSent(true);
  }

  return (
    <AuthShell>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Reset your password</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the email registered to your workspace and we will send a signed reset link. Links expire after 30
        minutes.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      {sent ? (
        <div className="rounded-md bg-muted border border-border px-3 py-3 text-sm text-muted-foreground">
          If that email is registered, a reset link is on its way. Check your inbox and spam folder.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            placeholder="you@institution.com"
            value={email}
            onChange={setEmail}
            required
          />
          <SubmitButton disabled={busy}>{busy ? "Sending…" : "Send reset link"}</SubmitButton>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        Remembered it?{" "}
        <Link to="/auth" className="text-emerald-brand font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
