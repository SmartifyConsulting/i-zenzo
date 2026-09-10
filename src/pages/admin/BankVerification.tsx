import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type VerificationRow = Awaited<ReturnType<typeof adminApi.listBankVerifications>>["verifications"][number];

function Queue() {
  const [rows, setRows] = useState<VerificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { verifications } = await adminApi.listBankVerifications();
      setRows(verifications);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(r: VerificationRow, approve: boolean) {
    setBusyId(r.id);
    try {
      await adminApi.decideBankVerification(r.id, approve);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Bank Verification</div>
      <h1 className="text-2xl font-semibold text-slate-100">Bank verification, review queue</h1>
      <p className="mt-1 text-sm text-slate-400">
        Admin / compliance verification decision layer. Raw bank account details are never displayed — only masked
        summary fields are shown.
      </p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Verification requests ({rows.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Company</th>
                <th className="px-4 py-2 font-medium">Account</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Mode</th>
                <th className="px-4 py-2 font-medium">Country</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No verification requests visible.</td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5 text-slate-300">
                  <td className="px-4 py-2.5">{r.company_name}</td>
                  <td className="px-4 py-2.5 font-mono">····{r.account_last4}</td>
                  <td className="px-4 py-2.5 capitalize">{r.status.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2.5 capitalize">{r.mode.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2.5">{r.country ?? "—"}</td>
                  <td className="px-4 py-2.5">
                    {r.status === "manual_review_required" ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => decide(r, true)} disabled={busyId === r.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">
                          Verify
                        </button>
                        <button onClick={() => decide(r, false)} disabled={busyId === r.id} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/20 disabled:opacity-50">
                          Fail
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
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

export default function BankVerification() {
  return <AdminAccessGate>{() => <Queue />}</AdminAccessGate>;
}
