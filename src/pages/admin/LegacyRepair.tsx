import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type FlagRow = Awaited<ReturnType<typeof adminApi.listLegacyRepairFlags>>["flags"][number];

function Repair() {
  const [flags, setFlags] = useState<FlagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { flags } = await adminApi.listLegacyRepairFlags();
      setFlags(flags);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function resolve(f: FlagRow, action: "archive" | "repair") {
    setBusyId(f.id);
    try {
      await adminApi.resolveLegacyFlag(f.id, action);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Legacy Repair</div>
      <h1 className="text-2xl font-semibold text-slate-900">Legacy Repair</h1>
      <p className="mt-1 text-sm text-slate-500">Matches with conflicting status/state/POI fields. Hidden from user views.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">{flags.length} match(es) flagged for repair</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Match</th>
                <th className="px-4 py-2 font-medium">Stage</th>
                <th className="px-4 py-2 font-medium">Reason</th>
                <th className="px-4 py-2 font-medium">Flagged</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && flags.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No matches flagged for repair.</td>
                </tr>
              )}
              {flags.map((f) => (
                <tr key={f.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-2.5 font-mono text-[11px]">{f.transaction_id.slice(0, 8)}…</td>
                  <td className="px-4 py-2.5 text-slate-500">{f.trading_stage}</td>
                  <td className="px-4 py-2.5">{f.reason}</td>
                  <td className="px-4 py-2.5 text-slate-500">{new Date(f.flagged_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => resolve(f, "archive")} disabled={busyId === f.id} className="rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                        Archive
                      </button>
                      <button onClick={() => resolve(f, "repair")} disabled={busyId === f.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-700 hover:bg-emerald-500/20 disabled:opacity-50">
                        Repair
                      </button>
                    </div>
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

export default function LegacyRepair() {
  return <AdminAccessGate>{() => <Repair />}</AdminAccessGate>;
}
