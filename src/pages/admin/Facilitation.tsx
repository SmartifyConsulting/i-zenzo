import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type CasesData = Awaited<ReturnType<typeof adminApi.listFacilitationCases>>;
type CaseRow = CasesData["cases"][number];
type TemplateRow = Awaited<ReturnType<typeof adminApi.listEmailTemplates>>["templates"][number];
type DncRow = Awaited<ReturnType<typeof adminApi.listDncRules>>["rules"][number];

function Tile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function StatusPill({ status, overdue }: { status: string; overdue: boolean }) {
  const label = status.replace(/_/g, " ");
  const tone = overdue
    ? "bg-red-500/10 text-red-400 border-red-500/30"
    : status === "new_unassigned"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  return <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${tone}`}>{label}{overdue ? " · overdue" : ""}</span>;
}

function CaseQueue() {
  const [data, setData] = useState<CasesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setData(await adminApi.listFacilitationCases());
    } catch (e: any) {
      setError(e?.message ?? "Failed to load facilitation cases");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function assignToMe(c: CaseRow) {
    setBusyId(c.id);
    try {
      await adminApi.assignFacilitationCase(c.id, c.status === "new_unassigned" ? "assigned" : undefined);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const summary = data?.summary;

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Facilitation</div>
      <h1 className="text-2xl font-semibold text-slate-100">Facilitation</h1>
      <p className="mt-1 text-sm text-slate-400">
        Phase 1 queue + Phase 2 outreach (templates · do-not-contact · escalations).
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Open cases" value={summary?.open_cases ?? "—"} />
        <Tile label="New this week" value={summary?.new_this_week ?? "—"} />
        <Tile label="New this month" value={summary?.new_this_month ?? "—"} />
        <Tile label="Overdue" value={summary?.overdue ?? "—"} />
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-medium text-slate-100">Case queue</div>
          <button
            onClick={load}
            disabled={loading}
            className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        {error && <p className="px-4 py-3 text-sm text-red-400">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Case</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Match</th>
                <th className="px-4 py-2 font-medium">Requester org</th>
                <th className="px-4 py-2 font-medium">Counterparty</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="px-4 py-2 font-medium">Due</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && (data?.cases.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No cases yet.
                  </td>
                </tr>
              )}
              {data?.cases.map((c: CaseRow) => {
                const overdue = !!c.due_date && new Date(c.due_date).getTime() < Date.now() && !c.closed_at;
                return (
                  <tr key={c.id} className="border-b border-white/5 text-slate-300">
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-200">{c.case_number}</td>
                    <td className="px-4 py-2.5">
                      <StatusPill status={c.status} overdue={overdue} />
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">
                      {c.transaction_id ? `${c.transaction_id.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="px-4 py-2.5">{c.requester_org}</td>
                    <td className="px-4 py-2.5">{c.counterparty ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      {c.value ? `${c.currency} ${Number(c.value).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {c.due_date ? new Date(c.due_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      {!c.owner_id && (
                        <button
                          onClick={() => assignToMe(c)}
                          disabled={busyId === c.id}
                          className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50"
                        >
                          {busyId === c.id ? "Working…" : "Assign to me"}
                        </button>
                      )}
                      {c.owner_id && <span className="text-slate-600">Assigned</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function EmailTemplates() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { templates } = await adminApi.listEmailTemplates();
      setTemplates(templates);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleApprove(t: TemplateRow) {
    setBusyId(t.id);
    try {
      await adminApi.approveEmailTemplate(t.id, t.status !== "approved");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Outreach email templates</div>
        <div className="text-xs text-slate-500">Only approved templates can be used to contact a candidate.</div>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && templates.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No templates.</p>}
        {templates.map((t) => (
          <div key={t.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-100">
                  {t.name}
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] ${
                      t.status === "approved"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 bg-white/5 text-slate-500"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Subject: {t.subject}</div>
                <p className="mt-1 max-w-2xl whitespace-pre-line text-[11px] text-slate-400">{t.body}</p>
              </div>
              <button
                onClick={() => toggleApprove(t)}
                disabled={busyId === t.id}
                className="shrink-0 rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50"
              >
                {busyId === t.id ? "Working…" : t.status === "approved" ? "Revert to draft" : "Approve"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DncRules() {
  const [rules, setRules] = useState<DncRow[]>([]);
  const [ruleType, setRuleType] = useState("email");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { rules } = await adminApi.listDncRules();
      setRules(rules);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addRule() {
    if (!value.trim()) return;
    setSaving(true);
    try {
      await adminApi.addDncRule(ruleType, value.trim(), reason.trim() || undefined);
      setValue("");
      setReason("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await adminApi.deleteDncRule(id);
    await load();
  }

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Do-not-contact rules</div>
        <div className="text-xs text-slate-500">Prevent the platform from contacting an email, domain, or organisation.</div>
      </div>
      <div className="flex flex-wrap items-end gap-2 border-b border-white/10 px-4 py-3">
        <select
          value={ruleType}
          onChange={(e) => setRuleType(e.target.value)}
          className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="email">Specific email address</option>
          <option value="domain">Email domain</option>
          <option value="organisation">Organisation</option>
        </select>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value…"
          className="w-48 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)…"
          className="w-56 rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          onClick={addRule}
          disabled={saving || !value.trim()}
          className="rounded bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
        >
          {saving ? "Adding…" : "Add rule"}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && rules.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-slate-500">No do-not-contact rules.</p>
        )}
        {rules.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-300">
            <div>
              <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">
                {r.rule_type}
              </span>{" "}
              {r.value} {r.reason && <span className="text-slate-500">— {r.reason}</span>}
            </div>
            <button
              onClick={() => remove(r.id)}
              className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-400 hover:bg-white/5"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacilitationContent() {
  return (
    <>
      <CaseQueue />
      <EmailTemplates />
      <DncRules />
    </>
  );
}

export default function Facilitation() {
  return <AdminAccessGate>{() => <FacilitationContent />}</AdminAccessGate>;
}
