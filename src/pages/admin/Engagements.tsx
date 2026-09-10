import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type EngagementRow = Awaited<ReturnType<typeof adminApi.listEngagements>>["engagements"][number];

function StatusPill({ value }: { value: string }) {
  const tone =
    value === "SEALED"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : "bg-amber-500/10 text-amber-400 border-amber-500/30";
  return <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>{value.toLowerCase()}</span>;
}

function NoteRow({ engagement, onAdded }: { engagement: EngagementRow; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await adminApi.addEngagementNote(engagement.poi_id, note.trim());
      setNote("");
      setOpen(false);
      onAdded();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5"
      >
        {engagement.notes.length > 0 ? `Notes (${engagement.notes.length})` : "Log note"}
      </button>
      {open && (
        <div className="mt-2 rounded border border-white/10 bg-black/20 p-2">
          {engagement.notes.map((n: { id: string; created_at: string; note: string }) => (
            <div key={n.id} className="mb-1.5 border-b border-white/5 pb-1.5 text-[11px] text-slate-400 last:mb-0 last:border-0">
              <span className="text-slate-500">{new Date(n.created_at).toLocaleString()}</span> — {n.note}
            </div>
          ))}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Log a manual outreach / contact attempt…"
            rows={2}
            className="mt-1 w-full resize-none rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={submit}
            disabled={saving || !note.trim()}
            className="mt-1 rounded bg-emerald-500/20 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save note"}
          </button>
        </div>
      )}
    </>
  );
}

function EngagementsQueue() {
  const [rows, setRows] = useState<EngagementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { engagements } = await adminApi.listEngagements();
      setRows(engagements);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load engagements");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Engagements</div>
      <h1 className="text-2xl font-semibold text-slate-100">Engagements</h1>
      <p className="mt-1 text-sm text-slate-400">
        POI hold-point queue · counterparty outreach and activation, across every workspace.
      </p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-100">POI hold-point queue</div>
            <div className="text-xs text-slate-500">Every match currently at (or past) its POI hold-point</div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {error && <p className="px-4 py-3 text-sm text-red-400">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Match</th>
                <th className="px-4 py-2 font-medium">Requester org</th>
                <th className="px-4 py-2 font-medium">POI status</th>
                <th className="px-4 py-2 font-medium">Created</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No engagements yet.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.poi_id} className="border-b border-white/5 align-top text-slate-300">
                  <td className="px-4 py-2.5">
                    <div className="font-mono text-[11px] text-slate-200">{row.transaction_id.slice(0, 8)}…</div>
                    <div className="max-w-[220px] truncate text-slate-500">{row.subject ?? "—"}</div>
                  </td>
                  <td className="px-4 py-2.5">{row.requester_org}</td>
                  <td className="px-4 py-2.5">
                    <StatusPill value={row.status} />
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5">
                    <NoteRow engagement={row} onAdded={load} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 px-4 py-2 text-[10px] text-slate-600">
          Showing {rows.length} most-recent POI hold-points
        </div>
      </div>
    </>
  );
}

export default function Engagements() {
  return <AdminAccessGate>{() => <EngagementsQueue />}</AdminAccessGate>;
}
