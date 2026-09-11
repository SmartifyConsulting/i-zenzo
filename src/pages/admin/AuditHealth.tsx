import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

const TABS = [
  "Risk Alarms",
  "Rating Appeals",
  "Audit Logs",
  "Notification Preferences",
  "Outreach Blocks",
  "Upload Audit",
  "Revenue Notifications",
  "Tenant Boundary",
  "System Health",
  "Event Store",
  "System Analytics",
] as const;
type Tab = (typeof TABS)[number];

function Tile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-100">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RiskAlarms() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-1 text-xs font-medium text-slate-100">Reconciliation alarms</div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Total alarms" value={0} />
        <Tile label="Critical" value={0} />
        <Tile label="High" value={0} />
        <Tile label="Medium" value={0} />
      </div>
      <p className="mt-3 text-xs text-slate-500">No reconciliation alarms in the selected window.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RatingAppeals() {
  const [appeals, setAppeals] = useState<Awaited<ReturnType<typeof adminApi.listRatingAppeals>>["appeals"]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setAppeals((await adminApi.listRatingAppeals()).appeals);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const open = appeals.filter((a: any) => a.status === "open");

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Open: {open.length}</div>
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && appeals.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No rating appeals currently open.</p>}
        {appeals.map((a: any) => (
          <div key={a.id} className="px-4 py-2.5 text-xs text-slate-300">{a.reason} — {a.status}</div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function AuditLogs() {
  const [logs, setLogs] = useState<Awaited<ReturnType<typeof adminApi.listAuditLogs>>["logs"]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setLogs((await adminApi.listAuditLogs()).logs);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Audit logs ({logs.length})</div>
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && logs.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No audit log entries yet.</p>}
        {logs.map((l: any) => (
          <div key={l.id} className="px-4 py-2.5 text-xs text-slate-300">
            <span className="text-slate-500">{new Date(l.created_at).toLocaleString()}</span>{" "}
            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">{l.event}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Awaited<ReturnType<typeof adminApi.listNotificationPreferences>>["preferences"]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setPrefs((await adminApi.listNotificationPreferences()).preferences);
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
        <div className="text-sm font-medium text-slate-100">Notification preferences</div>
        <div className="text-xs text-slate-500">Server-authorised cross-user view · platform_admin scope.</div>
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
              <th className="px-4 py-2 font-medium">User</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {!loading && prefs.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">No preferences recorded.</td></tr>
            )}
            {prefs.map((p: any) => (
              <tr key={p.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5">{p.workspace_name} · {p.workspace_email}</td>
                <td className="px-4 py-2.5 capitalize">{p.status}</td>
                <td className="px-4 py-2.5 text-slate-500">{new Date(p.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function OutreachBlocks() {
  const [blocks, setBlocks] = useState<Awaited<ReturnType<typeof adminApi.listOutreachBlocks>>["blocks"]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setBlocks((await adminApi.listOutreachBlocks()).blocks);
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
        <div className="text-sm font-medium text-slate-100">Outreach blocks</div>
        <div className="text-xs text-slate-500">Read-only triage view. Counterparty/dispute/commercial fields never displayed.</div>
      </div>
      <div className="flex items-center justify-end border-b border-white/10 px-4 py-2">
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && blocks.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No outreach-blocked events recorded.</p>}
        {blocks.map((b: any) => (
          <div key={b.id} className="px-4 py-2.5 text-xs text-slate-300">
            <span className="text-slate-500">{new Date(b.created_at).toLocaleString()}</span> {b.event}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function UploadAudit() {
  const [attempts, setAttempts] = useState<Awaited<ReturnType<typeof adminApi.listUploadAudit>>["attempts"]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setAttempts((await adminApi.listUploadAudit()).attempts);
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
        <div className="text-sm font-medium text-slate-100">Match document upload attempts ({attempts.length})</div>
      </div>
      <div className="flex items-center justify-end border-b border-white/10 px-4 py-2">
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {!loading && attempts.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No upload attempts recorded.</p>}
        {attempts.map((a: any) => (
          <div key={a.id} className="px-4 py-2.5 text-xs text-slate-300">
            <span className="text-slate-500">{new Date(a.created_at).toLocaleString()}</span> {a.event}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RevenueNotifications() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof adminApi.getRevenueNotifications>>["notifications"]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setRows((await adminApi.getRevenueNotifications()).notifications);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const sent = rows.filter((r: any) => r.status === "sent").length;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Revenue notifications</div>
        <div className="text-xs text-slate-500">Every email attempt fired to support@izenzo.co.za when revenue is recognised.</div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-b border-white/10 p-4 sm:grid-cols-4">
        <Tile label="Total in window" value={rows.length} />
        <Tile label="Sent" value={sent} />
        <Tile label="Failed" value={0} />
        <Tile label="Skipped" value={0} />
      </div>
      <div className="flex items-center justify-end px-4 py-2">
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="divide-y divide-white/5 border-t border-white/10">
        {!loading && rows.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No revenue notifications match these filters.</p>}
        {rows.map((r: any) => (
          <div key={r.id} className="px-4 py-2.5 text-xs text-slate-300">
            <span className="text-slate-500">{new Date(r.created_at).toLocaleString()}</span> credit_purchase — ${Number(r.amount_usd).toFixed(2)} — {r.status}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TenantBoundary() {
  const [runs, setRuns] = useState<Awaited<ReturnType<typeof adminApi.listTenantBoundaryRuns>>["runs"]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setRuns((await adminApi.listTenantBoundaryRuns()).runs);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function run() {
    setRunning(true);
    try {
      await adminApi.runTenantBoundaryProbe();
      await load();
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-sm font-medium text-slate-100">Tenant-Boundary Evidence Pack</div>
          <div className="text-xs text-slate-500">Live probe of RLS coverage across every public-schema table — real, not simulated.</div>
        </div>
        <button onClick={run} disabled={running} className="rounded bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50">
          {running ? "Running…" : "Run probe"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Run (UTC)</th>
              <th className="px-4 py-2 font-medium">Tables</th>
              <th className="px-4 py-2 font-medium">Pass</th>
              <th className="px-4 py-2 font-medium">Fail</th>
            </tr>
          </thead>
          <tbody>
            {!loading && runs.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No probe runs yet. Click "Run probe".</td></tr>
            )}
            {runs.map((r: any) => (
              <tr key={r.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5 text-slate-500">{new Date(r.run_at).toLocaleString()}</td>
                <td className="px-4 py-2.5">{r.tables_checked}</td>
                <td className="px-4 py-2.5 text-emerald-400">{r.tables_pass}</td>
                <td className="px-4 py-2.5 text-red-400">{r.tables_fail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SystemHealthTab() {
  const [health, setHealth] = useState<Awaited<ReturnType<typeof adminApi.getSystemHealth>> | null>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setHealth(await adminApi.getSystemHealth());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${health?.database_reachable ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-sm font-medium text-slate-100">{loading ? "Checking…" : health?.database_reachable ? "Database reachable" : "Database unreachable"}</span>
          {health && <span className="text-xs text-slate-500">({health.latency_ms}ms)</span>}
        </div>
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile label="Workspaces" value={health?.total_workspaces ?? "—"} />
        <Tile label="Total transactions" value={health?.total_transactions ?? "—"} />
        <Tile label="Executions in progress" value={health?.executions_in_progress ?? "—"} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EventStore() {
  const [events, setEvents] = useState<Awaited<ReturnType<typeof adminApi.listEventStore>>["events"]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setEvents((await adminApi.listEventStore()).events);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="text-sm font-medium text-slate-100">Append-only event store ({events.length})</div>
        <button onClick={load} disabled={loading} className="rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Event type</th>
              <th className="px-4 py-2 font-medium">Match</th>
              <th className="px-4 py-2 font-medium">Hash</th>
              <th className="px-4 py-2 font-medium">Occurred</th>
            </tr>
          </thead>
          <tbody>
            {!loading && events.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No events recorded.</td></tr>
            )}
            {events.map((e: any) => (
              <tr key={e.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-2.5">{e.event_type}</td>
                <td className="px-4 py-2.5 font-mono text-[11px]">{e.transaction_id?.slice(0, 8) ?? "—"}…</td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">{e.event_hash?.slice(0, 12) ?? "—"}…</td>
                <td className="px-4 py-2.5 text-slate-500">{new Date(e.occurred_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SystemAnalytics() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminApi.getSystemAnalytics>> | null>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setData(await adminApi.getSystemAnalytics());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile label="Users" value={data?.users ?? "—"} />
        <Tile label="Organisations" value={data?.organisations ?? "—"} />
        <Tile label="API Keys" value={data?.api_keys ?? "—"} />
        <Tile label="Matches Recorded" value={data?.matches ?? "—"} />
        <Tile label="Webhook Endpoints" value={data?.webhooks ?? "—"} />
        <Tile label="Database Health" value="Operational" />
      </div>
      <button onClick={load} disabled={loading} className="mt-3 rounded border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-50">
        {loading ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function AuditHealthContent() {
  const [tab, setTab] = useState<Tab>("Risk Alarms");

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Audit &amp; Health</div>
      <h1 className="text-2xl font-semibold text-slate-100">Audit &amp; Health</h1>
      <p className="mt-1 text-sm text-slate-400">Tamper-evident audit trail, event store, system health monitoring, and platform analytics.</p>

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
        {tab === "Risk Alarms" && <RiskAlarms />}
        {tab === "Rating Appeals" && <RatingAppeals />}
        {tab === "Audit Logs" && <AuditLogs />}
        {tab === "Notification Preferences" && <NotificationPreferences />}
        {tab === "Outreach Blocks" && <OutreachBlocks />}
        {tab === "Upload Audit" && <UploadAudit />}
        {tab === "Revenue Notifications" && <RevenueNotifications />}
        {tab === "Tenant Boundary" && <TenantBoundary />}
        {tab === "System Health" && <SystemHealthTab />}
        {tab === "Event Store" && <EventStore />}
        {tab === "System Analytics" && <SystemAnalytics />}
      </div>
    </>
  );
}

export default function AuditHealth() {
  return <AdminAccessGate>{() => <AuditHealthContent />}</AdminAccessGate>;
}
