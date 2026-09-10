import { useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type OrgRow = Awaited<ReturnType<typeof adminApi.listOrganisations>>["organisations"][number];

const SUB_TABS = [
  "Organisations",
  "Legal Entities",
  "Go-Live Verification",
  "KYB Documents",
  "API Clients",
  "API Plans",
  "API Usage",
  "API Monitoring",
  "API Security",
  "Sandbox Scenarios",
  "API Support",
];

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "active"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : "bg-red-500/10 text-red-400 border-red-500/30";
  return <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>{status}</span>;
}

function OrganisationsTable() {
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { organisations } = await adminApi.listOrganisations();
      setOrgs(organisations);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load organisations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orgs;
    return orgs.filter((o) => o.name.toLowerCase().includes(q));
  }, [orgs, query]);

  async function toggleSandbox(o: OrgRow) {
    setBusyId(o.id);
    try {
      await adminApi.updateOrganisation(o.id, { sandboxEnabled: !o.sandbox_enabled });
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update organisation");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleStatus(o: OrgRow) {
    setBusyId(o.id);
    try {
      await adminApi.updateOrganisation(o.id, { status: o.status === "active" ? "suspended" : "active" });
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update organisation");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">
        Admin · Organisation Management
      </div>
      <h1 className="text-2xl font-semibold text-slate-100">Organisation Management</h1>
      <p className="mt-1 text-sm text-slate-400">KYB lifecycle, legal entities, KYC document verification.</p>

      <div className="mt-4 flex gap-4 overflow-x-auto border-b border-white/10 text-xs">
        {SUB_TABS.map((tab, i) => (
          <span
            key={tab}
            className={`whitespace-nowrap border-b-2 py-2 ${
              i === 0 ? "border-emerald-500 text-slate-100" : "border-transparent text-slate-600"
            }`}
          >
            {tab}
            {i !== 0 && <span className="ml-1 text-[9px] text-slate-700">Soon</span>}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-100">Organisations</div>
            <div className="text-xs text-slate-500">View and manage organisations and their verification status</div>
          </div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="w-56 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={load}
              disabled={loading}
              className="shrink-0 rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>

        {error && <p className="px-4 py-3 text-sm text-red-400">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Users</th>
                <th className="px-4 py-2 font-medium">API Keys</th>
                <th className="px-4 py-2 font-medium">Sandbox</th>
                <th className="px-4 py-2 font-medium">Clip-on plan</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No organisations found.
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-white/5 text-slate-300">
                  <td className="px-4 py-2.5">{o.name}</td>
                  <td className="px-4 py-2.5">{o.users}</td>
                  <td className="px-4 py-2.5">{o.api_keys}</td>
                  <td className="px-4 py-2.5">{o.sandbox_enabled ? "Enabled" : "Disabled"}</td>
                  <td className="px-4 py-2.5 capitalize">{o.clip_on_plan.replace("_", "-")}</td>
                  <td className="px-4 py-2.5">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleSandbox(o)}
                        disabled={busyId === o.id}
                        className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50"
                      >
                        {o.sandbox_enabled ? "Disable sandbox" : "Enable sandbox"}
                      </button>
                      <button
                        onClick={() => toggleStatus(o)}
                        disabled={busyId === o.id}
                        className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50"
                      >
                        {o.status === "active" ? "Suspend" : "Reactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 px-4 py-2 text-[10px] text-slate-600">
          Showing {filtered.length} of {orgs.length} organisations
        </div>
      </div>
    </>
  );
}

export default function OrganisationManagement() {
  return <AdminAccessGate>{() => <OrganisationsTable />}</AdminAccessGate>;
}
