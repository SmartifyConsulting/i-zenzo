import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type EventRow = Awaited<ReturnType<typeof adminApi.listFunderAuditLog>>["events"][number];

function AuditLog() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { events } = await adminApi.listFunderAuditLog();
      setEvents(events);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Audit &amp; Usage</div>
      <h1 className="text-2xl font-semibold text-slate-900">Audit &amp; usage</h1>
      <p className="mt-1 text-sm text-slate-500">Read-only audit trail of funder workspace actions.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">Recent events</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {!loading && events.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No audit events yet.</p>}
          {events.map((e) => (
            <div key={e.id} className="px-4 py-2.5 text-xs text-slate-700">
              <span className="text-slate-500">{new Date(e.created_at).toLocaleString()}</span>{" "}
              <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] capitalize text-slate-500">{e.event.replace(/_/g, " ")}</span>
              {e.detail && <span className="ml-2 text-slate-500">{e.detail}</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function FunderAudit() {
  return <AdminAccessGate>{() => <AuditLog />}</AdminAccessGate>;
}
