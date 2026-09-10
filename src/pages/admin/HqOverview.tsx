import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type SpineRow = Awaited<ReturnType<typeof adminApi.listSpine>>["matches"][number];

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

function StagePill({ value }: { value: string | null }) {
  if (!value) return <span className="text-slate-600">-</span>;
  const tone =
    value === "COMPLETE" || value === "COMPLETED" || value === "APPROVED" || value === "SEALED"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : value === "REJECTED" || value === "EXPIRED" || value === "FAILED"
        ? "bg-red-500/10 text-red-400 border-red-500/30"
        : "bg-amber-500/10 text-amber-400 border-amber-500/30";
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>
      {value.toLowerCase()}
    </span>
  );
}

function CanonicalSpine() {
  const [rows, setRows] = useState<SpineRow[]>([]);
  const [summary, setSummary] = useState<{
    total_matches: number;
    total_workspaces: number;
    wads_pending: number;
    executions_open: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [spine, hqSummary] = await Promise.all([adminApi.listSpine(), adminApi.getHqSummary()]);
      setRows(spine.matches);
      setSummary(hqSummary);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load Canonical Spine");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · HQ Overview</div>
      <h1 className="text-2xl font-semibold text-slate-100">Canonical Spine</h1>
      <p className="mt-1 text-sm text-slate-400">
        Unified live view of every match across Search → Match → POI → WaD → Execution.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total matches", value: summary?.total_matches },
          { label: "Workspaces", value: summary?.total_workspaces },
          { label: "WaDs pending", value: summary?.wads_pending },
          { label: "Executions open", value: summary?.executions_open },
        ].map((tile) => (
          <div key={tile.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{tile.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-100">{tile.value ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-slate-100">Canonical Spine</div>
            <div className="text-xs text-slate-500">
              One row per match · live status across Search → Match → POI → WaD → Execution
            </div>
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
                <th className="px-4 py-2 font-medium">Stage</th>
                <th className="px-4 py-2 font-medium">POI</th>
                <th className="px-4 py-2 font-medium">WaD</th>
                <th className="px-4 py-2 font-medium">Execution</th>
                <th className="px-4 py-2 font-medium">Age</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No matches yet.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.transaction_id} className="border-b border-white/5 text-slate-300">
                  <td className="px-4 py-2.5">
                    <div className="font-mono text-[11px] text-slate-200">
                      {row.transaction_id.slice(0, 8)}…
                    </div>
                    <div className="max-w-[220px] truncate text-slate-500">{row.subject ?? "—"}</div>
                  </td>
                  <td className="px-4 py-2.5">{row.requester_org}</td>
                  <td className="px-4 py-2.5">
                    <StagePill value={row.trading_stage} />
                  </td>
                  <td className="px-4 py-2.5">
                    <StagePill value={row.poi_status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <StagePill value={row.wad_status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <StagePill value={row.execution_status} />
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{timeAgo(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 px-4 py-2 text-[10px] text-slate-600">
          Showing {rows.length} most-recent matches
        </div>
      </div>
    </>
  );
}

export default function HqOverview() {
  return <AdminAccessGate>{() => <CanonicalSpine />}</AdminAccessGate>;
}
