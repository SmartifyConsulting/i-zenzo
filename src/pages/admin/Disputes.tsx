import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type DisputeRow = Awaited<ReturnType<typeof adminApi.listDisputes>>["disputes"][number];

function ResolveForm({ dispute, onDone }: { dispute: DisputeRow; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!notes.trim()) return;
    setSaving(true);
    try {
      await adminApi.resolveDispute(dispute.id, notes.trim());
      onDone();
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5">
        Resolve
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Resolution notes…" className="w-48 rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      <button onClick={submit} disabled={saving || !notes.trim()} className="rounded bg-emerald-500/20 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50">
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function DisputeList() {
  const [disputes, setDisputes] = useState<DisputeRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { disputes } = await adminApi.listDisputes();
      setDisputes(disputes);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const open = disputes.filter((d) => d.status === "open").length;
  const resolved = disputes.filter((d) => d.status === "resolved").length;

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Dispute Resolution</div>
      <h1 className="text-2xl font-semibold text-slate-100">Dispute Resolution</h1>
      <p className="mt-1 text-sm text-slate-400">Flagged trades, escalations, force-resolve overrides.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Open</div>
          <div className="mt-1 text-xl font-semibold text-slate-100">{open}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Resolved</div>
          <div className="mt-1 text-xl font-semibold text-slate-100">{resolved}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Total</div>
          <div className="mt-1 text-xl font-semibold text-slate-100">{disputes.length}</div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">All Disputes</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Reason</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Raised</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && disputes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No disputes.</td>
                </tr>
              )}
              {disputes.map((d) => (
                <tr key={d.id} className="border-b border-white/5 text-slate-300">
                  <td className="px-4 py-2.5 max-w-xs">
                    {d.reason}
                    {d.resolution_notes && <div className="mt-0.5 text-[11px] text-slate-500">{d.resolution_notes}</div>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${d.status === "resolved" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-amber-500/30 bg-amber-500/10 text-amber-400"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{new Date(d.raised_at).toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    {d.status === "open" ? <ResolveForm dispute={d} onDone={load} /> : <span className="text-slate-600">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function Disputes() {
  return <AdminAccessGate>{() => <DisputeList />}</AdminAccessGate>;
}
