import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type RequestRow = Awaited<ReturnType<typeof adminApi.listOnboardingRequests>>["requests"][number];

function Requests() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { requests } = await adminApi.listOnboardingRequests();
      setRequests(requests);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(r: RequestRow, approve: boolean) {
    setBusyId(r.id);
    try {
      await adminApi.decideOnboardingRequest(r.id, approve);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Funder Onboarding</div>
      <h1 className="text-2xl font-semibold text-slate-100">Onboarding requests</h1>
      <p className="mt-1 text-sm text-slate-400">Review, approve or reject funder onboarding requests.</p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Requests</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {!loading && requests.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No onboarding requests.</p>}
          {requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-300">
              <div>
                <div className="font-medium text-slate-100">{r.org_name}</div>
                <div className="mt-0.5 text-slate-500">{r.contact_email}</div>
                <span className={`mt-1 inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${r.status === "pending" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : r.status === "approved" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
                  {r.status}
                </span>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-1.5">
                  <button onClick={() => decide(r, true)} disabled={busyId === r.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">
                    Approve
                  </button>
                  <button onClick={() => decide(r, false)} disabled={busyId === r.id} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/20 disabled:opacity-50">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function FunderOnboarding() {
  return <AdminAccessGate>{() => <Requests />}</AdminAccessGate>;
}
