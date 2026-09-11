import type { ReactNode } from "react";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { AdminShell } from "@/components/izenzo/AdminShell";

export function AdminAccessGate({ children }: { children: (email: string) => ReactNode }) {
  const { email, status } = useAdminAccess();

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-500">
        Checking access…
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Access restricted</h1>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {email} is signed in but doesn't have admin access to Platform HQ. Contact an existing admin to
            request access.
          </p>
        </div>
      </div>
    );
  }

  return <AdminShell userEmail={email}>{children(email)}</AdminShell>;
}
