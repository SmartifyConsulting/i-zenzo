import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

function Health() {
  const [health, setHealth] = useState<Awaited<ReturnType<typeof adminApi.getSystemHealth>> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setHealth(await adminApi.getSystemHealth());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · System Health</div>
      <h1 className="text-2xl font-semibold text-slate-900">System Health</h1>
      <p className="mt-1 text-sm text-slate-500">Live database reachability and platform counters.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${health?.database_reachable ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-sm font-medium text-slate-900">
            {loading ? "Checking…" : health?.database_reachable ? "Database reachable" : "Database unreachable"}
          </span>
          {health && <span className="text-xs text-slate-500">({health.latency_ms}ms)</span>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Workspaces", value: health?.total_workspaces },
          { label: "Total transactions", value: health?.total_transactions },
          { label: "Executions in progress", value: health?.executions_in_progress },
        ].map((t) => (
          <div key={t.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{t.value ?? "—"}</div>
          </div>
        ))}
      </div>

      <button onClick={load} disabled={loading} className="mt-4 rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
        {loading ? "Refreshing…" : "Refresh"}
      </button>
    </>
  );
}

export default function SystemHealth() {
  return <AdminAccessGate>{() => <Health />}</AdminAccessGate>;
}
