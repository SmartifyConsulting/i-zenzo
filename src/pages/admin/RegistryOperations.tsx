import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

function Operations() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof adminApi.getRegistrySummary>> | null>(null);

  useEffect(() => {
    adminApi.getRegistrySummary().then(setSummary);
  }, []);

  const queue = [
    { to: "/hq/registry/claims", label: "Claim queue", count: summary?.pending_claims },
    { to: "/hq/registry/bank-verification", label: "Bank verification queue", count: summary?.pending_bank_reviews },
  ];

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Registry Operations</div>
      <h1 className="text-2xl font-semibold text-slate-100">Registry operations centre</h1>
      <p className="mt-1 text-sm text-slate-400">
        One controlled cockpit for imports, claims, bank details and API — pulling live counts from the same
        Registry data as the other sections.
      </p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] divide-y divide-white/5">
        {queue.map((q) => (
          <Link key={q.to} to={q.to} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5">
            <span className="text-slate-200">{q.label}</span>
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
              {q.count ?? "—"} pending
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function RegistryOperations() {
  return <AdminAccessGate>{() => <Operations />}</AdminAccessGate>;
}
