import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type ReleaseRow = Awaited<ReturnType<typeof adminApi.listDealReleases>>["releases"][number];
type OrgRow = Awaited<ReturnType<typeof adminApi.listFunderOrganisations>>["organisations"][number];

function NewReleaseForm({ orgs, onCreated }: { orgs: OrgRow[]; onCreated: () => void }) {
  const [funderOrgId, setFunderOrgId] = useState("");
  const [packLabel, setPackLabel] = useState("");
  const [days, setDays] = useState("30");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!funderOrgId || !packLabel.trim()) return;
    setSaving(true);
    try {
      await adminApi.createDealRelease(funderOrgId, packLabel.trim(), days ? Number(days) : undefined);
      setPackLabel("");
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-b border-slate-200 px-4 py-3">
      <div className="text-sm font-medium text-slate-900">New deal release</div>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <select value={funderOrgId} onChange={(e) => setFunderOrgId(e.target.value)} className="rounded border border-slate-200 bg-slate-100 px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          <option value="">Select funder org…</option>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
        <input value={packLabel} onChange={(e) => setPackLabel(e.target.value)} placeholder="Evidence pack label…" className="w-56 rounded border border-slate-200 bg-slate-100 px-2 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        <input value={days} onChange={(e) => setDays(e.target.value)} type="number" placeholder="Expires in days" className="w-28 rounded border border-slate-200 bg-slate-100 px-2 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        <button onClick={submit} disabled={saving || !funderOrgId || !packLabel.trim()} className="rounded bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-500/30 disabled:opacity-50">
          {saving ? "Releasing…" : "Release"}
        </button>
      </div>
    </div>
  );
}

function Releases() {
  const [releases, setReleases] = useState<ReleaseRow[]>([]);
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [{ releases }, { organisations }] = await Promise.all([
        adminApi.listDealReleases(),
        adminApi.listFunderOrganisations(),
      ]);
      setReleases(releases);
      setOrgs(organisations);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function revoke(r: ReleaseRow) {
    setBusyId(r.id);
    try {
      await adminApi.revokeDealRelease(r.id);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Deal Releases</div>
      <h1 className="text-2xl font-semibold text-slate-900">Deal releases</h1>
      <p className="mt-1 text-sm text-slate-500">Evidence packs released to funders, expiry and revocation.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <NewReleaseForm orgs={orgs} onCreated={load} />
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-sm font-medium text-slate-900">Releases ({releases.length})</div>
          <button onClick={load} disabled={loading} className="rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {!loading && releases.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No deal releases.</p>}
          {releases.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3 text-xs text-slate-700">
              <div>
                <div className="text-slate-900">{r.pack_label}</div>
                <div className="mt-0.5 text-slate-500">{r.funder_org_name}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium capitalize ${r.status === "active" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-red-500/30 bg-red-500/10 text-red-700"}`}>
                    {r.status}
                  </span>
                  {r.expires_at && <span className="text-slate-400">expires {new Date(r.expires_at).toLocaleDateString()}</span>}
                </div>
              </div>
              {r.status === "active" && (
                <button onClick={() => revoke(r)} disabled={busyId === r.id} className="rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  {busyId === r.id ? "Working…" : "Revoke"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function DealReleases() {
  return <AdminAccessGate>{() => <Releases />}</AdminAccessGate>;
}
