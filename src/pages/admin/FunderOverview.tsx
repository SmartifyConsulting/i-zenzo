import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

function Overview() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof adminApi.getFunderOverview>> | null>(null);

  useEffect(() => {
    adminApi.getFunderOverview().then(setSummary);
  }, []);

  const links = [
    { to: "/hq/funder/onboarding", label: "Onboarding requests", desc: "Review, approve or reject funder onboarding requests." },
    { to: "/hq/funder/organisations", label: "Funder organisations", desc: "Approved funder organisations and their contact details." },
    { to: "/hq/funder/releases", label: "Deal releases", desc: "Evidence packs released to funders, expiry and revocation." },
    { to: "/hq/funder/audit", label: "Audit & usage", desc: "Read-only audit trail and non-financial usage events." },
  ];

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Funder Workspace</div>
      <h1 className="text-2xl font-semibold text-slate-900">Institutional Funder Evidence Workspace</h1>
      <p className="mt-1 text-sm text-slate-500">All actions here are recorded to the funder audit ledger.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Pending onboarding", value: summary?.pending_onboarding },
          { label: "Approved organisations", value: summary?.approved_organisations },
          { label: "Active releases", value: summary?.active_releases },
          { label: "Revoked releases", value: summary?.revoked_releases },
        ].map((t) => (
          <div key={t.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{t.value ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="block rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-slate-50">
            <div className="text-sm font-medium text-slate-900">{l.label}</div>
            <div className="mt-1 text-xs text-slate-500">{l.desc}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function FunderOverview() {
  return <AdminAccessGate>{() => <Overview />}</AdminAccessGate>;
}
