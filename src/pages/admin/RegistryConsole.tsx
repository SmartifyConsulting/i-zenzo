import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

function Console() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof adminApi.getRegistrySummary>> | null>(null);

  useEffect(() => {
    adminApi.getRegistrySummary().then(setSummary);
  }, []);

  const links = [
    { to: "/hq/registry/operations", label: "Operations", desc: "Unified queue across imports, claims, bank details and API." },
    { to: "/hq/registry/records", label: "Records", desc: "Registry company records." },
    { to: "/hq/registry/claims", label: "Claims", desc: "Company claim queue." },
    { to: "/hq/registry/bank-verification", label: "Bank Verification", desc: "Bank verification review queue." },
    { to: "/hq/registry/api-clients", label: "API Clients", desc: "Institutional API clients." },
    { to: "/hq/registry/api-usage", label: "API Usage", desc: "API usage & blocked events." },
  ];

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Registry</div>
      <h1 className="text-2xl font-semibold text-slate-100">Registry administration</h1>
      <p className="mt-1 text-sm text-slate-400">
        Company records, claims, bank verification, API management — one console.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total companies", value: summary?.total_companies },
          { label: "Pending claims", value: summary?.pending_claims },
          { label: "Pending bank reviews", value: summary?.pending_bank_reviews },
          { label: "API clients", value: summary?.api_clients },
        ].map((t) => (
          <div key={t.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-100">{t.value ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="block rounded-lg border border-white/10 bg-white/[0.02] p-4 hover:bg-white/5">
            <div className="text-sm font-medium text-slate-100">{l.label}</div>
            <div className="mt-1 text-xs text-slate-500">{l.desc}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function RegistryConsole() {
  return <AdminAccessGate>{() => <Console />}</AdminAccessGate>;
}
