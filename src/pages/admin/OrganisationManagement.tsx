import { useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

const TABS = [
  "Organisations",
  "Legal Entities",
  "Go-Live Verification",
  "KYB Documents",
  "API Clients",
  "API Plans",
  "API Usage",
  "API Monitoring",
  "API Security",
  "Sandbox Scenarios",
  "API Support",
] as const;
type Tab = (typeof TABS)[number];

function Pill({ tone, children }: { tone: "green" | "amber" | "red" | "slate"; children: React.ReactNode }) {
  const cls = {
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    red: "border-red-500/30 bg-red-500/10 text-red-400",
    slate: "border-white/10 bg-white/5 text-slate-400",
  }[tone];
  return <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${cls}`}>{children}</span>;
}

/* ------------------------------------------------------------------ */

type OrgRow = Awaited<ReturnType<typeof adminApi.listOrganisations>>["organisations"][number];

function OrganisationsTable() {
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { organisations } = await adminApi.listOrganisations();
      setOrgs(organisations);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orgs;
    return orgs.filter((o) => o.name.toLowerCase().includes(q));
  }, [orgs, query]);

  async function toggleSandbox(o: OrgRow) {
    setBusyId(o.id);
    try {
      await adminApi.updateOrganisation(o.id, { sandboxEnabled: !o.sandbox_enabled });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function toggleStatus(o: OrgRow) {
    setBusyId(o.id);
    try {
      await adminApi.updateOrganisation(o.id, { status: o.status === "active" ? "suspended" : "active" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-sm font-medium text-slate-100">Organisations</div>
          <div className="text-xs text-slate-500">View and manage organisations and their verification status</div>
        </div>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name…"
            className="w-56 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button onClick={load} disabled={loading} className="shrink-0 rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Users</th>
              <th className="px-4 py-2 font-medium">API Keys</th>
              <th className="px-4 py-2 font-medium">Sandbox</th>
              <th className="px-4 py-2 font-medium">Clip-on plan</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Created</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">No organisations found.</td>
              </tr>
            )}
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5">{o.name}</td>
                <td className="px-4 py-2.5">{o.users}</td>
                <td className="px-4 py-2.5">{o.api_keys}</td>
                <td className="px-4 py-2.5">{o.sandbox_enabled ? "Enabled" : "Disabled"}</td>
                <td className="px-4 py-2.5 capitalize">{o.clip_on_plan.replace("_", "-")}</td>
                <td className="px-4 py-2.5">
                  <Pill tone={o.status === "active" ? "green" : "red"}>{o.status}</Pill>
                </td>
                <td className="px-4 py-2.5 text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => toggleSandbox(o)} disabled={busyId === o.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">
                      {o.sandbox_enabled ? "Disable sandbox" : "Enable sandbox"}
                    </button>
                    <button onClick={() => toggleStatus(o)} disabled={busyId === o.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">
                      {o.status === "active" ? "Suspend" : "Reactivate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/10 px-4 py-2 text-[10px] text-slate-600">
        Showing {filtered.length} of {orgs.length} organisations
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type EntityRow = Awaited<ReturnType<typeof adminApi.listLegalEntities>>["entities"][number];

function LegalEntities() {
  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setEntities((await adminApi.listLegalEntities()).entities);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function act(id: string, fn: (id: string) => Promise<unknown>) {
    setBusyId(id);
    try {
      await fn(id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-sm font-medium text-slate-100">Entity Management</div>
          <div className="text-xs text-slate-500">Legal entities across all organisations, with screening capabilities</div>
        </div>
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Legal name</th>
              <th className="px-4 py-2 font-medium">Type</th>
              <th className="px-4 py-2 font-medium">Jurisdiction</th>
              <th className="px-4 py-2 font-medium">Reg. no.</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Screening</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && entities.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No legal entities.</td></tr>
            )}
            {entities.map((e) => (
              <tr key={e.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5">{e.legal_name}</td>
                <td className="px-4 py-2.5 uppercase text-slate-500">{e.entity_type}</td>
                <td className="px-4 py-2.5">{e.jurisdiction ?? "—"}</td>
                <td className="px-4 py-2.5 font-mono text-[11px]">{e.reg_no ?? "—"}</td>
                <td className="px-4 py-2.5"><Pill tone={e.status === "verified" ? "green" : "amber"}>{e.status}</Pill></td>
                <td className="px-4 py-2.5"><Pill tone={e.screening_status === "clear" ? "green" : "slate"}>{e.screening_status.replace(/_/g, " ")}</Pill></td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => act(e.id, adminApi.screenLegalEntity)} disabled={busyId === e.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">Screen</button>
                    <button onClick={() => act(e.id, adminApi.verifyLegalEntity)} disabled={busyId === e.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">Verify</button>
                    {e.entity_type === "company" && (
                      <button onClick={() => act(e.id, adminApi.bindLegalEntity)} disabled={busyId === e.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">Bind</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function GoLiveVerification() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof adminApi.listGoLiveVerifications>>["verifications"]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setRows((await adminApi.listGoLiveVerifications()).verifications);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, approve: boolean) {
    setBusyId(id);
    try {
      await adminApi.decideGoLiveVerification(id, approve);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const pending = rows.filter((r: any) => r.status === "pending");

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Pending: {pending.length}</div>
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && rows.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No verification packages are waiting for review.</p>}
        {rows.map((r: any) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-300">
            <div>
              <div className="text-slate-100">{r.legal_name}</div>
              <Pill tone={r.status === "approved" ? "green" : r.status === "rejected" ? "red" : "amber"}>{r.status}</Pill>
            </div>
            {r.status === "pending" && (
              <div className="flex gap-1.5">
                <button onClick={() => decide(r.id, true)} disabled={busyId === r.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">Approve</button>
                <button onClick={() => decide(r.id, false)} disabled={busyId === r.id} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/20 disabled:opacity-50">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function KybDocuments() {
  const [docs, setDocs] = useState<Awaited<ReturnType<typeof adminApi.listKycDocuments>>["documents"]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setDocs((await adminApi.listKycDocuments()).documents);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, approve: boolean) {
    setBusyId(id);
    try {
      await adminApi.reviewKycDocument(id, approve);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">KYC Documents</div>
        <div className="text-xs text-slate-500">Identity and verification documents uploaded for compliance purposes.</div>
      </div>
      <div className="flex items-center justify-end border-b border-white/10 px-4 py-2">
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && docs.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No KYC documents found.</p>}
        {docs.map((d: any) => (
          <div key={d.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-300">
            <div>
              <div className="text-slate-100">{d.legal_name} · {d.doc_type.replace(/_/g, " ")}</div>
              <Pill tone={d.status === "approved" ? "green" : d.status === "rejected" ? "red" : "amber"}>{d.status.replace(/_/g, " ")}</Pill>
            </div>
            {d.status === "pending_review" && (
              <div className="flex gap-1.5">
                <button onClick={() => decide(d.id, true)} disabled={busyId === d.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">Approve</button>
                <button onClick={() => decide(d.id, false)} disabled={busyId === d.id} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/20 disabled:opacity-50">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ApiClientsOnboarding() {
  const [clients, setClients] = useState<Awaited<ReturnType<typeof adminApi.listOrgApiClients>>["clients"]>([]);
  const [entities, setEntities] = useState<EntityRow[]>([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [{ clients }, { entities }] = await Promise.all([adminApi.listOrgApiClients(), adminApi.listLegalEntities()]);
      setClients(clients);
      setEntities(entities);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!selectedEntity) return;
    await adminApi.createOrgApiClient(selectedEntity);
    setSelectedEntity("");
    await load();
  }

  async function setAccess(id: string, field: "sandbox_enabled" | "production_enabled", value: boolean) {
    setBusyId(id);
    try {
      await adminApi.setOrgApiClientAccess(id, field, value);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">API Clients · institutional onboarding</div>
        <div className="text-xs text-slate-500">Onboarding records only. Key issuance, public endpoints, and billing are not part of this surface.</div>
      </div>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <select value={selectedEntity} onChange={(e) => setSelectedEntity(e.target.value)} className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          <option value="">Select legal entity…</option>
          {entities.map((e) => (
            <option key={e.id} value={e.id}>{e.legal_name}</option>
          ))}
        </select>
        <button onClick={create} disabled={!selectedEntity} className="rounded bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50">New API client</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Legal entity</th>
              <th className="px-4 py-2 font-medium">Country</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Sandbox</th>
              <th className="px-4 py-2 font-medium">Production</th>
              <th className="px-4 py-2 font-medium">Created</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && clients.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No API client onboarding records.</td></tr>
            )}
            {clients.map((c: any) => (
              <tr key={c.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5">{c.legal_name}</td>
                <td className="px-4 py-2.5">{c.country ?? "—"}</td>
                <td className="px-4 py-2.5"><Pill tone={c.status === "active" ? "green" : "amber"}>{c.status.replace(/_/g, " ")}</Pill></td>
                <td className="px-4 py-2.5">{c.sandbox_enabled ? "Enabled" : "—"}</td>
                <td className="px-4 py-2.5">{c.production_enabled ? "Enabled" : "—"}</td>
                <td className="px-4 py-2.5 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1.5">
                    {!c.sandbox_enabled && <button onClick={() => setAccess(c.id, "sandbox_enabled", true)} disabled={busyId === c.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">Enable sandbox</button>}
                    {!c.production_enabled && <button onClick={() => setAccess(c.id, "production_enabled", true)} disabled={busyId === c.id} className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50">Enable production</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ApiPlans() {
  const [plans, setPlans] = useState<Awaited<ReturnType<typeof adminApi.listApiPlans>>["plans"]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ planName: "", currency: "USD", monthlyFee: "0", includedAllowance: "0", overagePrice: "0", manualReviewFee: "0", overageAllowed: false });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setPlans((await adminApi.listApiPlans()).plans);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!form.planName.trim()) return;
    setSaving(true);
    try {
      await adminApi.createApiPlan({
        planName: form.planName.trim(),
        currency: form.currency,
        monthlyFee: Number(form.monthlyFee) || 0,
        includedAllowance: Number(form.includedAllowance) || 0,
        overagePrice: Number(form.overagePrice) || 0,
        manualReviewFee: Number(form.manualReviewFee) || 0,
        overageAllowed: form.overageAllowed,
      });
      setForm({ planName: "", currency: "USD", monthlyFee: "0", includedAllowance: "0", overagePrice: "0", manualReviewFee: "0", overageAllowed: false });
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Public API V1. Commercial plan catalogue</div>
        <div className="text-xs text-slate-500">Plans drive monthly allowance and billing-visibility estimates. No payment collection, no invoices.</div>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && plans.length === 0 && <p className="px-4 py-6 text-center text-xs text-slate-500">No plans configured yet.</p>}
        {plans.map((p: any) => (
          <div key={p.id} className="px-4 py-2.5 text-xs text-slate-300">
            <span className="text-slate-100">{p.plan_name}</span> — {p.currency} {Number(p.monthly_fee).toLocaleString()}/mo · {p.included_allowance} included lookups · overage {p.currency} {Number(p.overage_price).toLocaleString()}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-3">
        <div className="mb-2 text-xs font-medium text-slate-100">New plan</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} placeholder="Plan name" className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="Currency (ISO 3)" className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <input value={form.monthlyFee} onChange={(e) => setForm({ ...form, monthlyFee: e.target.value })} placeholder="Monthly fee" type="number" className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <input value={form.includedAllowance} onChange={(e) => setForm({ ...form, includedAllowance: e.target.value })} placeholder="Included allowance" type="number" className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <input value={form.overagePrice} onChange={(e) => setForm({ ...form, overagePrice: e.target.value })} placeholder="Overage price / lookup" type="number" className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <input value={form.manualReviewFee} onChange={(e) => setForm({ ...form, manualReviewFee: e.target.value })} placeholder="Manual review fee" type="number" className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          <label className="flex items-center gap-1.5 text-xs text-slate-400">
            <input type="checkbox" checked={form.overageAllowed} onChange={(e) => setForm({ ...form, overageAllowed: e.target.checked })} />
            Overage allowed (120% circuit breaker)
          </label>
          <button onClick={create} disabled={saving || !form.planName.trim()} className="rounded bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50">
            {saving ? "Creating…" : "Create plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function useOrgApiOperations() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminApi.getOrgApiOperations>> | null>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setData(await adminApi.getOrgApiOperations());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  return { data, loading, load };
}

function ApiUsage() {
  const { data, loading, load } = useOrgApiOperations();
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">API Usage ({data?.usage.length ?? 0} events)</div>
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Endpoint</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Flags</th>
              <th className="px-4 py-2 font-medium">Occurred</th>
            </tr>
          </thead>
          <tbody>
            {!loading && (data?.usage.length ?? 0) === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No rows for the selected filters.</td></tr>
            )}
            {data?.usage.map((e: any, i: number) => (
              <tr key={i} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5 font-mono text-[11px]">{e.endpoint}</td>
                <td className="px-4 py-2.5">{e.status_code}</td>
                <td className="px-4 py-2.5">
                  {e.blocked && <Pill tone="red">blocked</Pill>} {e.rate_limited && <Pill tone="amber">rate-limited</Pill>}
                </td>
                <td className="px-4 py-2.5 text-slate-500">{new Date(e.occurred_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApiMonitoring() {
  const { data, loading, load } = useOrgApiOperations();
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Internal Public API V1 monitoring</div>
        <div className="text-xs text-slate-500">Operational status per onboarded API client. Estimates are visibility only, not invoices.</div>
      </div>
      <div className="flex items-center justify-end border-b border-white/10 px-4 py-2">
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Client</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Sandbox</th>
              <th className="px-4 py-2 font-medium">Production</th>
              <th className="px-4 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {!loading && (data?.clients.length ?? 0) === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No rows for the selected filters.</td></tr>
            )}
            {data?.clients.map((c: any) => (
              <tr key={c.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5">{c.legal_name}</td>
                <td className="px-4 py-2.5"><Pill tone={c.status === "active" ? "green" : "slate"}>{c.status.replace(/_/g, " ")}</Pill></td>
                <td className="px-4 py-2.5">{c.sandbox_enabled ? "yes" : "no"}</td>
                <td className="px-4 py-2.5">{c.production_enabled ? "yes" : "no"}</td>
                <td className="px-4 py-2.5 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApiSecurity() {
  const { data, loading, load } = useOrgApiOperations();
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Public API V1 security signals (current UTC month)</div>
        <div className="text-xs text-slate-500">Failed authentication, rate-limit and monthly-limit blocks, active IP exceptions.</div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-white/10 p-4 sm:grid-cols-4">
        {[
          { label: "Clients with signals", value: data?.security.clients_with_signals },
          { label: "Failed auth attempts", value: data?.security.failed_auth_attempts },
          { label: "Rate-limit events", value: data?.security.rate_limit_events },
          { label: "Blocked events", value: data?.security.blocked_events },
        ].map((t) => (
          <div key={t.label} className="rounded border border-white/10 bg-white/[0.03] p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.label}</div>
            <div className="mt-1 text-lg font-semibold text-slate-100">{t.value ?? 0}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end px-4 py-2">
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SandboxScenarios() {
  const [scenarios, setScenarios] = useState<Awaited<ReturnType<typeof adminApi.listSandboxScenarios>>["scenarios"]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setScenarios((await adminApi.listSandboxScenarios()).scenarios);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Sandbox scenario catalogue · read-only</div>
        <div className="text-xs text-slate-500">Deterministic test records. Never real counterparties, never returned in production.</div>
      </div>
      <div className="flex items-center justify-end border-b border-white/10 px-4 py-2">
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Scenario</th>
              <th className="px-4 py-2 font-medium">Legal name</th>
              <th className="px-4 py-2 font-medium">Country</th>
              <th className="px-4 py-2 font-medium">Match status</th>
              <th className="px-4 py-2 font-medium">Next action</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s: any) => (
              <tr key={s.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5 font-mono text-[11px]">{s.scenario}</td>
                <td className="px-4 py-2.5">{s.legal_name ?? "—"}</td>
                <td className="px-4 py-2.5">{s.country ?? "—"}</td>
                <td className="px-4 py-2.5">{s.match_status ?? "—"}</td>
                <td className="px-4 py-2.5 text-slate-500">{s.next_action ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ApiSupport() {
  const [tickets, setTickets] = useState<Awaited<ReturnType<typeof adminApi.listApiSupportTickets>>["tickets"]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setTickets((await adminApi.listApiSupportTickets()).tickets);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function close(id: string) {
    setBusyId(id);
    try {
      await adminApi.updateSupportTicketStatus(id, "closed");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const open = tickets.filter((t: any) => t.status === "open");

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">
          {tickets.length} ticket(s) · {open.length} open
        </div>
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && tickets.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No tickets.</p>}
        {tickets.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-300">
            <div>
              <div className="text-slate-100">{t.subject}</div>
              <div className="mt-1 flex gap-2 text-[10px]">
                <Pill tone={t.status === "open" ? "amber" : "slate"}>{t.status}</Pill>
                <Pill tone={t.severity === "urgent" ? "red" : "slate"}>{t.severity}</Pill>
                <span className="text-slate-600">{t.environment}</span>
              </div>
            </div>
            {t.status === "open" && (
              <button onClick={() => close(t.id)} disabled={busyId === t.id} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/5 disabled:opacity-50">Close</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function OrganisationManagementContent() {
  const [tab, setTab] = useState<Tab>("Organisations");

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Organisation Management</div>
      <h1 className="text-2xl font-semibold text-slate-100">Organisation Management</h1>
      <p className="mt-1 text-sm text-slate-400">KYB lifecycle, legal entities, KYC document verification.</p>

      <div className="mt-4 flex gap-4 overflow-x-auto border-b border-white/10 text-xs">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 py-2 ${
              tab === t ? "border-emerald-500 text-slate-100" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Organisations" && <OrganisationsTable />}
        {tab === "Legal Entities" && <LegalEntities />}
        {tab === "Go-Live Verification" && <GoLiveVerification />}
        {tab === "KYB Documents" && <KybDocuments />}
        {tab === "API Clients" && <ApiClientsOnboarding />}
        {tab === "API Plans" && <ApiPlans />}
        {tab === "API Usage" && <ApiUsage />}
        {tab === "API Monitoring" && <ApiMonitoring />}
        {tab === "API Security" && <ApiSecurity />}
        {tab === "Sandbox Scenarios" && <SandboxScenarios />}
        {tab === "API Support" && <ApiSupport />}
      </div>
    </>
  );
}

export default function OrganisationManagement() {
  return <AdminAccessGate>{() => <OrganisationManagementContent />}</AdminAccessGate>;
}
