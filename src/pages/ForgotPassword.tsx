import { Link } from "@/lib/router-compat";
import { AuthShell, SubmitButton, TextField } from "@/components/izenzo/AuthShell";

export default function ForgotPassword() {
  return (
    <AuthShell>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Reset your password</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the email registered to your workspace and we will send a signed reset link. Links expire after 30
        minutes.
      </p>
      <form className="space-y-4">
        <TextField label="Email" type="email" placeholder="you@institution.com" />
        <SubmitButton>Send reset link</SubmitButton>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Remembered it?{" "}
        <Link to="/auth" className="text-emerald-brand font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
