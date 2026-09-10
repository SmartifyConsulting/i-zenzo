import { useEffect, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

function Settings() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { settings } = await adminApi.getPlatformSettings();
      setWorkspaceName(settings?.workspace_name ?? "");
      setStatusMessage(settings?.system_status_message ?? "");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await adminApi.updatePlatformSettings(workspaceName, statusMessage);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Platform Settings</div>
      <h1 className="text-2xl font-semibold text-slate-100">Platform Settings</h1>
      <p className="mt-1 text-sm text-slate-400">Workspace label and system status banner shown across the admin console.</p>

      <div className="mt-6 max-w-md rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <label className="block text-[10px] uppercase tracking-wide text-slate-500">Workspace name</label>
        <input
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          disabled={loading}
          className="mt-1 w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <label className="mt-4 block text-[10px] uppercase tracking-wide text-slate-500">System status message</label>
        <input
          value={statusMessage}
          onChange={(e) => setStatusMessage(e.target.value)}
          disabled={loading}
          className="mt-1 w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />

        <button
          onClick={save}
          disabled={saving || loading}
          className="mt-4 rounded bg-emerald-500/20 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {saved && <span className="ml-3 text-xs text-emerald-400">Saved.</span>}
      </div>
    </>
  );
}

export default function PlatformSettings() {
  return <AdminAccessGate>{() => <Settings />}</AdminAccessGate>;
}
