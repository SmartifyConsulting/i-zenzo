import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type CaseRow = Awaited<ReturnType<typeof adminApi.listExecutionCases>>["cases"][number];

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "COMPLETE"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : "bg-amber-500/10 text-amber-400 border-amber-500/30";
  return <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${tone}`}>{status.toLowerCase().replace(/_/g, " ")}</span>;
}

function ExecutionList() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { cases } = await adminApi.listExecutionCases();
      setCases(cases);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Execution Cases</div>
      <h1 className="text-2xl font-semibold text-slate-100">Execution Engine</h1>
      <p className="mt-1 text-sm text-slate-400">
        Platform-admin-only execution control plane, across every workspace's transaction executions.
      </p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Execution cases ({cases.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Transaction</th>
                <th className="px-4 py-2 font-medium">Stage</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Milestones</th>
                <th className="px-4 py-2 font-medium">Started</th>
              </tr>
            </thead>
            <tbody>
              {!loading && cases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No execution cases.</td>
                </tr>
              )}
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-white/5 text-slate-300">
                  <td className="px-4 py-2.5 font-mono text-[11px] text-slate-200">{c.transaction_id.slice(0, 8)}…</td>
                  <td className="px-4 py-2.5 text-slate-500">{c.trading_stage ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-4 py-2.5">{c.milestones.accepted} / {c.milestones.total} accepted</td>
                  <td className="px-4 py-2.5 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function ExecutionCases() {
  return <AdminAccessGate>{() => <ExecutionList />}</AdminAccessGate>;
}
