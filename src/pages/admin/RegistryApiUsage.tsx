import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type EventRow = Awaited<ReturnType<typeof adminApi.listRegistryApiUsage>>["events"][number];

function UsageLog() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { events } = await adminApi.listRegistryApiUsage();
      setEvents(events);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const blocked = events.filter((e) => e.blocked);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · API Usage</div>
      <h1 className="text-2xl font-semibold text-slate-900">API usage &amp; blocked events</h1>
      <p className="mt-1 text-sm text-slate-500">Safe audit-grade view. No raw payloads or full API keys are rendered.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">{events.length} usage events · {blocked.length} blocked</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Client</th>
                <th className="px-4 py-2 font-medium">Endpoint</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Flags</th>
                <th className="px-4 py-2 font-medium">Occurred</th>
              </tr>
            </thead>
            <tbody>
              {!loading && events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No usage events.</td>
                </tr>
              )}
              {events.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-2.5">{e.client_name}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px]">{e.endpoint}</td>
                  <td className="px-4 py-2.5">{e.status_code}</td>
                  <td className="px-4 py-2.5">
                    {e.blocked && <span className="mr-1 rounded border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-700">blocked</span>}
                    {e.rate_limited && <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-700">rate-limited</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{new Date(e.occurred_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function RegistryApiUsage() {
  return <AdminAccessGate>{() => <UsageLog />}</AdminAccessGate>;
}
