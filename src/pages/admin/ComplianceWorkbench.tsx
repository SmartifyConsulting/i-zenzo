import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type CaseRow = Awaited<ReturnType<typeof adminApi.listComplianceCases>>["cases"][number];

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "resolved"
      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
      : status === "pending_approval"
        ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
        : "bg-slate-100 text-slate-500 border-slate-200";
  return <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${tone}`}>{status.replace(/_/g, " ")}</span>;
}

function Workbench() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { cases } = await adminApi.listComplianceCases();
      setCases(cases);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(c: CaseRow, status: string, claim?: boolean) {
    setBusyId(c.id);
    try {
      await adminApi.updateComplianceCase(c.id, status, claim);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const open = cases.filter((c) => c.status !== "resolved").length;
  const resolved = cases.filter((c) => c.status === "resolved").length;

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Compliance</div>
      <h1 className="text-2xl font-semibold text-slate-900">Compliance Case Management Workbench</h1>
      <p className="mt-1 text-sm text-slate-500">KYB / sanctions / EDD case queue.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Open</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{open}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Resolved</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{resolved}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Total</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{cases.length}</div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">Case queue</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {!loading && cases.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No cases.</p>}
          {cases.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-700">
              <div>
                <div className="font-mono text-[11px] text-slate-800">{c.case_number}</div>
                <div className="mt-0.5 text-slate-500">{c.subject}</div>
                <div className="mt-1 flex gap-2">
                  <StatusPill status={c.status} />
                  <span className="text-slate-400 capitalize">{c.category}</span>
                  {c.transaction_id && (
                    <span className="font-mono text-slate-400">match {c.transaction_id.slice(0, 8)}…</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5">
                {c.status === "unassigned" && (
                  <button onClick={() => act(c, "in_progress", true)} disabled={busyId === c.id} className="rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    Claim
                  </button>
                )}
                {c.status !== "resolved" && (
                  <button onClick={() => act(c, "resolved")} disabled={busyId === c.id} className="rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ComplianceWorkbench() {
  return <AdminAccessGate>{() => <Workbench />}</AdminAccessGate>;
}
