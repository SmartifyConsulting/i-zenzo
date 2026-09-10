import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type LogRow = Awaited<ReturnType<typeof adminApi.listAuditLogs>>["logs"][number];

function Health() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { logs } = await adminApi.listAuditLogs();
      setLogs(logs);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Audit &amp; Health</div>
      <h1 className="text-2xl font-semibold text-slate-100">Audit &amp; Health</h1>
      <p className="mt-1 text-sm text-slate-400">
        Tamper-evident audit trail, event store, system health monitoring, and platform analytics.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total alarms", value: 0 },
          { label: "Critical", value: 0 },
          { label: "High", value: 0 },
          { label: "Medium", value: 0 },
        ].map((t) => (
          <div key={t.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-100">{t.value}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-600">No reconciliation alarms in the selected window.</p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Audit logs ({logs.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {!loading && logs.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No audit log entries yet.</p>}
          {logs.map((l) => (
            <div key={l.id} className="px-4 py-2.5 text-xs text-slate-300">
              <span className="text-slate-500">{new Date(l.created_at).toLocaleString()}</span>{" "}
              <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">{l.event}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function AuditHealth() {
  return <AdminAccessGate>{() => <Health />}</AdminAccessGate>;
}
