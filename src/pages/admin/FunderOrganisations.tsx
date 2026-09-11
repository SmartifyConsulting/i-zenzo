import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type OrgRow = Awaited<ReturnType<typeof adminApi.listFunderOrganisations>>["organisations"][number];

function OrgList() {
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { organisations } = await adminApi.listFunderOrganisations();
      setOrgs(organisations);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Funder Organisations</div>
      <h1 className="text-2xl font-semibold text-slate-900">Funder organisations</h1>
      <p className="mt-1 text-sm text-slate-500">Approved funder organisations and their contact details.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">Organisations ({orgs.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Contact email</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Approved</th>
              </tr>
            </thead>
            <tbody>
              {!loading && orgs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No funder organisations.</td>
                </tr>
              )}
              {orgs.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-2.5">{o.name}</td>
                  <td className="px-4 py-2.5">{o.contact_email}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium capitalize text-emerald-700">{o.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{new Date(o.approved_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function FunderOrganisations() {
  return <AdminAccessGate>{() => <OrgList />}</AdminAccessGate>;
}
