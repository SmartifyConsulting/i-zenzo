import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/izenzo/Layout";
import { Badge, Card } from "@/components/izenzo/ui";
import * as api from "@/lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const authed = await api.isLoggedIn();
      if (!authed) {
        navigate({ to: "/auth" });
        return;
      }
      try {
        const [txns, w] = await Promise.all([api.listTransactions(), api.getWallet()]);
        if (cancelled) return;
        setTransactions(txns.transactions);
        setWallet(w);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleLogout() {
    await api.logout();
    navigate({ to: "/auth" });
  }

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge>Workspace Dashboard</Badge>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">Your transactions</h1>
          </div>
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-foreground">
            Log out
          </button>
        </div>

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {wallet && (
          <Card className="p-6 mb-8">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60 mb-3">Wallet</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-foreground">
                  {(wallet.entries ?? []).filter((e: any) => Number(e.tokens) > 0).reduce((s: number, e: any) => s + Number(e.tokens), 0)}
                </div>
                <div className="text-xs text-muted-foreground/60">Tokens purchased</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">
                  {(wallet.entries ?? []).filter((e: any) => Number(e.tokens) < 0).reduce((s: number, e: any) => s + Math.abs(Number(e.tokens)), 0)}
                </div>
                <div className="text-xs text-muted-foreground/60">Tokens consumed</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-emerald-brand">{wallet.balance}</div>
                <div className="text-xs text-muted-foreground/60">Available</div>
              </div>
            </div>
          </Card>
        )}

        {!loading && transactions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">No transactions yet in this workspace.</p>
            <Link to="/live-demo" className="text-sm font-medium text-emerald-brand">
              Run the live demo →
            </Link>
          </Card>
        )}

        {transactions.length > 0 && (
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground/60">
                <tr>
                  <th className="text-left px-4 py-2">Transaction</th>
                  <th className="text-left px-4 py-2">Stage</th>
                  <th className="text-left px-4 py-2">POI</th>
                  <th className="text-left px-4 py-2">WaD</th>
                  <th className="text-left px-4 py-2">Finality</th>
                  <th className="text-left px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t) => (
                  <tr key={t.transaction_id}>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                      {String(t.transaction_id).slice(0, 12)}…
                    </td>
                    <td className="px-4 py-2 text-foreground">{t.trading_stage}</td>
                    <td className="px-4 py-2 text-muted-foreground">{t.poi_status || "—"}</td>
                    <td
                      className={`px-4 py-2 ${
                        t.wad_decision === "PASSED"
                          ? "text-emerald-brand"
                          : t.wad_decision === "FAILED"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {t.wad_decision || "—"}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{t.finality_status || "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground/60 text-xs">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
