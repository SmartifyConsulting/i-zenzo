import { useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type CompanyRow = Awaited<ReturnType<typeof adminApi.listRegistryCompanies>>["companies"][number];

function Records() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { companies } = await adminApi.listRegistryCompanies();
      setCompanies(companies);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) => c.company_name.toLowerCase().includes(q) || c.reg_no.toLowerCase().includes(q));
  }, [companies, query]);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Registry Records</div>
      <h1 className="text-2xl font-semibold text-slate-900">Registry company records</h1>
      <p className="mt-1 text-sm text-slate-500">Imported company records and their readiness/claim/public status.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or reg. no…" className="w-64 rounded border border-slate-200 bg-slate-100 px-2 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Company</th>
                <th className="px-4 py-2 font-medium">Country</th>
                <th className="px-4 py-2 font-medium">Reg. no.</th>
                <th className="px-4 py-2 font-medium">Readiness</th>
                <th className="px-4 py-2 font-medium">Claim</th>
                <th className="px-4 py-2 font-medium">Public</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No companies found.</td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-2.5">{c.company_name}</td>
                  <td className="px-4 py-2.5">{c.country}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px]">{c.reg_no}</td>
                  <td className="px-4 py-2.5 capitalize">{c.readiness.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2.5">{c.has_claim ? "yes" : "no"}</td>
                  <td className="px-4 py-2.5">{c.is_public ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 px-4 py-2 text-[10px] text-slate-400">
          Showing {filtered.length} of {companies.length} companies
        </div>
      </div>
    </>
  );
}

export default function RegistryRecords() {
  return <AdminAccessGate>{() => <Records />}</AdminAccessGate>;
}
