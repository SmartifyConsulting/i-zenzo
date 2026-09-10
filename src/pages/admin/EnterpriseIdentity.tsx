import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type OrgRow = Awaited<ReturnType<typeof adminApi.listEnterpriseIdentity>>["organisations"][number];

function IdentityTable() {
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { organisations } = await adminApi.listEnterpriseIdentity();
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
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Enterprise Identity</div>
      <h1 className="text-2xl font-semibold text-slate-100">Enterprise Identity</h1>
      <p className="mt-1 text-sm text-slate-400">
        Org-level SSO/SAML configuration and SCIM-style user lifecycle. Shell only — no custom SAML is wired up.
      </p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Organisations ({orgs.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Organisation</th>
                <th className="px-4 py-2 font-medium">SSO status</th>
                <th className="px-4 py-2 font-medium">Verified domains</th>
                <th className="px-4 py-2 font-medium">SCIM lifecycle</th>
              </tr>
            </thead>
            <tbody>
              {!loading && orgs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No organisations.</td>
                </tr>
              )}
              {orgs.map((o) => (
                <tr key={o.id} className="border-b border-white/5 text-slate-300">
                  <td className="px-4 py-2.5">{o.name}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">Not configured</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">—</td>
                  <td className="px-4 py-2.5 text-slate-600">inv 0 · act 0 · sus 0 · dep 0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function EnterpriseIdentity() {
  return <AdminAccessGate>{() => <IdentityTable />}</AdminAccessGate>;
}
