import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type CaseRow = Awaited<ReturnType<typeof adminApi.listGovernanceCases>>["cases"][number];

function GovernanceList() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { cases } = await adminApi.listGovernanceCases();
      setCases(cases);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function claim(c: CaseRow) {
    setBusyId(c.id);
    try {
      await adminApi.claimGovernanceCase(c.id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Governance Cases</div>
      <h1 className="text-2xl font-semibold text-slate-100">P-5 Governance</h1>
      <p className="mt-1 text-sm text-slate-400">Governance, Compliance and Readiness, internal admin surface.</p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Cases ({cases.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {!loading && cases.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No cases match the current filter.</p>}
          {cases.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-300">
              <div>
                <div className="font-mono text-[11px] text-slate-200">{c.case_number}</div>
                <div className="mt-0.5 text-slate-400">{c.summary}</div>
                <div className="mt-1 flex gap-2 text-[10px]">
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 capitalize text-slate-400">{c.status.replace(/_/g, " ")}</span>
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 capitalize text-slate-500">{c.category.replace(/_/g, " ")}</span>
                  {c.transaction_id && (
                    <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-slate-600">match {c.transaction_id.slice(0, 8)}…</span>
                  )}
                </div>
              </div>
              {!c.assigned_to && (
                <button onClick={() => claim(c)} disabled={busyId === c.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">
                  {busyId === c.id ? "Working…" : "Claim"}
                </button>
              )}
              {c.assigned_to && <span className="text-[11px] text-slate-600">Assigned</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function GovernanceCases() {
  return <AdminAccessGate>{() => <GovernanceList />}</AdminAccessGate>;
}
