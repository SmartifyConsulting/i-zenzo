import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type RecordRow = Awaited<ReturnType<typeof adminApi.listGovernanceRecords>>["records"][number];

function Records() {
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { records } = await adminApi.listGovernanceRecords();
      setRecords(records);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Governance Records</div>
      <h1 className="text-2xl font-semibold text-slate-900">Governance Records</h1>
      <p className="mt-1 text-sm text-slate-500">
        HQ-only Governance Record per transaction · Phase 1 visibility only.
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">Records ({records.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {!loading && records.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No governance records.</p>}
          {records.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-700">
              <div>
                <div className="font-mono text-[11px] text-slate-800">{r.id.slice(0, 8)}…</div>
                <div className="mt-0.5 text-slate-500">{new Date(r.created_at).toLocaleString()}</div>
              </div>
              <div className="flex gap-1.5 text-[10px]">
                <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 capitalize text-slate-500">{r.lifecycle}</span>
                <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 capitalize text-slate-500">{r.trading_stage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function GovernanceRecords() {
  return <AdminAccessGate>{() => <Records />}</AdminAccessGate>;
}
