import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type SuggestionRow = Awaited<ReturnType<typeof adminApi.listAiSuggestions>>["suggestions"][number];
type DncRow = Awaited<ReturnType<typeof adminApi.listAiDncRules>>["rules"][number];

function SuggestionsQueue() {
  const [suggestions, setSuggestions] = useState<SuggestionRow[]>([]);
  const [rules, setRules] = useState<DncRow[]>([]);
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [{ suggestions }, { rules }] = await Promise.all([adminApi.listAiSuggestions(), adminApi.listAiDncRules()]);
      setSuggestions(suggestions);
      setRules(rules);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(s: SuggestionRow, status: "approved" | "rejected" | "archived") {
    setBusyId(s.id);
    try {
      await adminApi.decideAiSuggestion(s.id, status);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function addRule() {
    if (!value.trim()) return;
    await adminApi.addAiDncRule("organisation", value.trim(), reason.trim() || undefined);
    setValue("");
    setReason("");
    await load();
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · AI Suggestions</div>
      <h1 className="text-2xl font-semibold text-slate-100">AI Light-Intel review workspace</h1>
      <p className="mt-1 text-sm text-slate-400">
        Advisory only. Nothing here contacts a counterparty, creates a POI/WaD, or asserts verification.
      </p>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">AI-proposed matches ({suggestions.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {!loading && suggestions.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No AI proposed matches yet.</p>}
          {suggestions.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-300">
              <div>
                <div className="text-slate-100">{s.counterparty_name}</div>
                <div className="mt-1 flex gap-2 text-[10px]">
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 capitalize text-slate-400">{s.role}</span>
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 capitalize text-slate-500">confidence: {s.confidence}</span>
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 capitalize text-slate-500">fit: {s.fit}</span>
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 capitalize text-slate-500">risk: {s.risk}</span>
                </div>
              </div>
              {s.status === "new" ? (
                <div className="flex gap-1.5">
                  <button onClick={() => decide(s, "approved")} disabled={busyId === s.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">
                    Approve
                  </button>
                  <button onClick={() => decide(s, "rejected")} disabled={busyId === s.id} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/20 disabled:opacity-50">
                    Reject
                  </button>
                  <button onClick={() => decide(s, "archived")} disabled={busyId === s.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">
                    Archive
                  </button>
                </div>
              ) : (
                <span className="capitalize text-slate-600">{s.status}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Do-not-contact rules (AI sourcing-time filter)</div>
        </div>
        <div className="flex flex-wrap items-end gap-2 border-b border-white/10 px-4 py-3">
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Organisation to exclude…" className="w-56 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)…" className="w-56 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <button onClick={addRule} disabled={!value.trim()} className="rounded bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50">
            Add rule
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {!loading && rules.length === 0 && <p className="px-4 py-6 text-center text-xs text-slate-500">No do-not-contact rules.</p>}
          {rules.map((r) => (
            <div key={r.id} className="px-4 py-2.5 text-xs text-slate-300">
              <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">{r.rule_type}</span> {r.value}
              {r.reason && <span className="text-slate-500"> — {r.reason}</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function AiSuggestions() {
  return <AdminAccessGate>{() => <SuggestionsQueue />}</AdminAccessGate>;
}
