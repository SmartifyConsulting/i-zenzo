import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type ClientRow = Awaited<ReturnType<typeof adminApi.listRegistryApiClients>>["clients"][number];

function ClientsTable() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { clients } = await adminApi.listRegistryApiClients();
      setClients(clients);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(c: ClientRow, status: string) {
    setBusyId(c.id);
    try {
      await adminApi.setApiClientStatus(c.id, status);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · API Clients</div>
      <h1 className="text-2xl font-semibold text-slate-900">Institutional API clients</h1>
      <p className="mt-1 text-sm text-slate-500">Read-only safe summary. No secrets, no full keys are rendered.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">{clients.length} clients</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {!loading && clients.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No API clients match the current filters.</p>}
          {clients.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-700">
              <div>
                <div className="text-slate-900">{c.client_name}</div>
                <div className="mt-1 flex gap-2 text-[10px]">
                  <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 capitalize text-slate-500">{c.lifecycle_status.replace(/_/g, " ")}</span>
                  <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 capitalize text-slate-500">{c.mode}</span>
                  {c.country && <span className="text-slate-400">{c.country}</span>}
                </div>
              </div>
              <div className="flex gap-1.5">
                {c.lifecycle_status !== "production_active" && (
                  <button onClick={() => setStatus(c, "production_active")} disabled={busyId === c.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-700 hover:bg-emerald-500/20 disabled:opacity-50">
                    Activate
                  </button>
                )}
                {c.lifecycle_status !== "suspended" && (
                  <button onClick={() => setStatus(c, "suspended")} disabled={busyId === c.id} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-700 hover:bg-red-500/20 disabled:opacity-50">
                    Suspend
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

export default function RegistryApiClients() {
  return <AdminAccessGate>{() => <ClientsTable />}</AdminAccessGate>;
}
