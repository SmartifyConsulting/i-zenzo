import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type HoldRow = Awaited<ReturnType<typeof adminApi.listLegalHolds>>["holds"][number];

function ApplyHoldForm({ onApplied }: { onApplied: () => void }) {
  const [scopeType, setScopeType] = useState("user");
  const [scopeId, setScopeId] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters");
      return;
    }
    setSaving(true);
    try {
      await adminApi.applyLegalHold(scopeType, scopeId.trim(), reason.trim());
      setScopeId("");
      setReason("");
      onApplied();
    } catch (e: any) {
      setError(e?.message ?? "Failed to apply hold");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-b border-white/10 px-4 py-3">
      <div className="text-sm font-medium text-slate-100">Apply legal hold</div>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <div>
          <label className="block text-[10px] uppercase tracking-wide text-slate-500">Scope type</label>
          <select value={scopeType} onChange={(e) => setScopeType(e.target.value)} className="mt-1 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            <option value="user">user</option>
            <option value="organisation">organisation</option>
            <option value="transaction">transaction</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wide text-slate-500">Scope ID (UUID)</label>
          <input value={scopeId} onChange={(e) => setScopeId(e.target.value)} placeholder="00000000-0000-…" className="mt-1 w-56 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="block text-[10px] uppercase tracking-wide text-slate-500">Reason (mandatory, ≥10 chars)</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why this hold is being applied…" className="mt-1 w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </div>
        <button onClick={submit} disabled={saving} className="rounded bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50">
          {saving ? "Applying…" : "Apply hold"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Holds() {
  const [holds, setHolds] = useState<HoldRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { holds } = await adminApi.listLegalHolds();
      setHolds(holds);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function release(h: HoldRow) {
    setBusyId(h.id);
    try {
      await adminApi.releaseLegalHold(h.id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const active = holds.filter((h) => h.status === "active");
  const released = holds.filter((h) => h.status === "released");

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Legal Holds</div>
      <h1 className="text-2xl font-semibold text-slate-100">Retention &amp; Holds</h1>
      <p className="mt-1 text-sm text-slate-400">
        Legal holds block deletion/anonymisation/purge/export-destruction for the scoped record.
      </p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <ApplyHoldForm onApplied={load} />
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">
            Active ({active.length}) · Released ({released.length})
          </div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {!loading && holds.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No active legal holds.</p>}
          {holds.map((h) => (
            <div key={h.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-300">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] capitalize text-slate-400">{h.scope_type}</span>
                  <span className="font-mono text-[11px] text-slate-200">{h.scope_id}</span>
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${h.status === "active" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"}`}>
                    {h.status}
                  </span>
                </div>
                <div className="mt-1 text-slate-400">{h.reason}</div>
                <div className="mt-0.5 text-[11px] text-slate-600">Applied {new Date(h.applied_at).toLocaleString()}</div>
              </div>
              {h.status === "active" && (
                <button onClick={() => release(h)} disabled={busyId === h.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">
                  {busyId === h.id ? "Working…" : "Release"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function LegalHolds() {
  return <AdminAccessGate>{() => <Holds />}</AdminAccessGate>;
}
