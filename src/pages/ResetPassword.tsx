import { Link } from "@/lib/router-compat";
import { AuthShell, PasswordField, SubmitButton } from "@/components/izenzo/AuthShell";

export default function ResetPassword() {
  return (
    <AuthShell>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Choose a new password</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Minimum 8 characters. Your new credential is bound to the same workspace authority record.
      </p>
      <form className="space-y-4">
        <PasswordField label="New password" placeholder="Minimum 8 characters" />
        <PasswordField label="Confirm new password" placeholder="Re-enter password" />
        <SubmitButton>Update password</SubmitButton>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link to="/auth" className="text-emerald-brand font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
