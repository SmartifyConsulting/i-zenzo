import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type ClaimRow = Awaited<ReturnType<typeof adminApi.listRegistryClaims>>["claims"][number];

function ClaimQueue() {
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { claims } = await adminApi.listRegistryClaims();
      setClaims(claims);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(c: ClaimRow, approve: boolean) {
    setBusyId(c.id);
    try {
      await adminApi.decideRegistryClaim(c.id, approve);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Registry Claims</div>
      <h1 className="text-2xl font-semibold text-slate-900">Claim queue</h1>
      <p className="mt-1 text-sm text-slate-500">Company ownership claims awaiting review.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">Claims ({claims.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {!loading && claims.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No claims have been submitted yet.</p>}
          {claims.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-700">
              <div>
                <div className="text-slate-900">{c.company_name}</div>
                <div className="mt-0.5 text-slate-500">{c.claimant_email}</div>
                <span className={`mt-1 inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${c.status === "pending" ? "border-amber-500/30 bg-amber-500/10 text-amber-700" : c.status === "approved" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-red-500/30 bg-red-500/10 text-red-700"}`}>
                  {c.status}
                </span>
              </div>
              {c.status === "pending" && (
                <div className="flex gap-1.5">
                  <button onClick={() => decide(c, true)} disabled={busyId === c.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-700 hover:bg-emerald-500/20 disabled:opacity-50">
                    Approve
                  </button>
                  <button onClick={() => decide(c, false)} disabled={busyId === c.id} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-700 hover:bg-red-500/20 disabled:opacity-50">
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

export default function RegistryClaims() {
  return <AdminAccessGate>{() => <ClaimQueue />}</AdminAccessGate>;
}
