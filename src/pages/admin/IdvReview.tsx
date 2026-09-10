import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type ReviewRow = Awaited<ReturnType<typeof adminApi.listIdvReviews>>["reviews"][number];

function ReviewQueue() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { reviews } = await adminApi.listIdvReviews();
      setReviews(reviews);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(r: ReviewRow, approve: boolean) {
    setBusyId(r.id);
    try {
      await adminApi.decideIdvReview(r.id, approve);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · IDV Review</div>
      <h1 className="text-2xl font-semibold text-slate-100">IDV Manual Review</h1>
      <p className="mt-1 text-sm text-slate-400">Category: idv_person. Person-only decisions.</p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Cases requiring review</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Person</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Updated</th>
                <th className="px-4 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && reviews.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No cases requiring review.</td>
                </tr>
              )}
              {reviews.map((r) => (
                <tr key={r.id} className="border-b border-white/5 text-slate-300">
                  <td className="px-4 py-2.5">{r.subject_label}</td>
                  <td className="px-4 py-2.5 capitalize">{r.status.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2.5 text-slate-500">{new Date(r.updated_at).toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    {r.status === "manual_review_required" ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => decide(r, true)} disabled={busyId === r.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">
                          Approve
                        </button>
                        <button onClick={() => decide(r, false)} disabled={busyId === r.id} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/20 disabled:opacity-50">
                          Reject
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

export default function IdvReview() {
  return <AdminAccessGate>{() => <ReviewQueue />}</AdminAccessGate>;
}
