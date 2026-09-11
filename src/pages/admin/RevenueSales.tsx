import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

function Revenue() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminApi.getRevenueOverview>> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setData(await adminApi.getRevenueOverview());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Revenue &amp; Sales</div>
      <h1 className="text-2xl font-semibold text-slate-900">Revenue &amp; sales</h1>
      <p className="mt-1 text-sm text-slate-500">Credit purchases, top buyers, per-org timeline.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Revenue", value: data ? `$${data.total_revenue.toFixed(2)}` : "—" },
          { label: "Credits sold", value: data?.total_credits },
          { label: "Purchases", value: data?.total_purchases },
          { label: "Unique buyers", value: data?.unique_buyers },
        ].map((t) => (
          <div key={t.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{t.value ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">Top buyers</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">#</th>
                <th className="px-4 py-2 font-medium">Organisation</th>
                <th className="px-4 py-2 font-medium">Revenue</th>
                <th className="px-4 py-2 font-medium">Purchases</th>
                <th className="px-4 py-2 font-medium">Last purchase</th>
              </tr>
            </thead>
            <tbody>
              {!loading && (data?.top_buyers.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No purchases yet.</td>
                </tr>
              )}
              {data?.top_buyers.map((b, i) => (
                <tr key={b.organisation} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-2.5">{i + 1}</td>
                  <td className="px-4 py-2.5">{b.organisation}</td>
                  <td className="px-4 py-2.5">${b.revenue.toFixed(2)}</td>
                  <td className="px-4 py-2.5">{b.purchases}</td>
                  <td className="px-4 py-2.5 text-slate-500">{new Date(b.last).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">Per-org purchase timeline</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">When</th>
                <th className="px-4 py-2 font-medium">Organisation</th>
                <th className="px-4 py-2 font-medium">Credits</th>
                <th className="px-4 py-2 font-medium">USD</th>
              </tr>
            </thead>
            <tbody>
              {!loading && (data?.timeline.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No purchases recorded.</td>
                </tr>
              )}
              {data?.timeline.map((t: { id: string; created_at: string; tokens: number; usd: number; organisation: string }) => (
                <tr key={t.id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-2.5 text-slate-500">{new Date(t.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2.5">{t.organisation}</td>
                  <td className="px-4 py-2.5">{t.tokens}</td>
                  <td className="px-4 py-2.5">${Number(t.usd).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function RevenueSales() {
  return <AdminAccessGate>{() => <Revenue />}</AdminAccessGate>;
}
