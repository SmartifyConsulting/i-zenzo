import { useEffect, useMemo, useState } from "react";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";
import * as adminApi from "@/lib/admin-api";

type UserRow = Awaited<ReturnType<typeof adminApi.listUsers>>["users"][number];

function RolePill({ role }: { role: string }) {
  const tone =
    role === "admin"
      ? "bg-purple-500/10 text-purple-700 border-purple-500/30"
      : role === "moderator"
        ? "bg-sky-500/10 text-sky-700 border-sky-500/30"
        : "bg-slate-100 text-slate-500 border-slate-200";
  return <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>{role}</span>;
}

function UsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { users } = await adminApi.listUsers();
      setUsers(users);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q),
    );
  }, [users, query]);

  async function toggleAdmin(u: UserRow) {
    const isAdmin = u.roles.includes("admin");
    setBusyUserId(u.user_id);
    try {
      await adminApi.setUserRole(u.user_id, "admin", !isAdmin);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update role");
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · User Management</div>
      <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
      <p className="mt-1 text-sm text-slate-500">Profiles and role assignments across every workspace.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email or name…"
            className="w-full max-w-xs rounded border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={load}
            disabled={loading}
            className="shrink-0 rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {error && <p className="px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Registered</th>
                <th className="px-4 py-2 font-medium">Roles</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.user_id} className="border-b border-slate-100 text-slate-700">
                  <td className="px-4 py-2.5">{u.email}</td>
                  <td className="px-4 py-2.5">{u.name || "—"}</td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {new Date(u.registered_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      {u.roles.length === 0 ? (
                        <span className="text-slate-400">user</span>
                      ) : (
                        u.roles.map((r: string) => <RolePill key={r} role={r} />)
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => toggleAdmin(u)}
                      disabled={busyUserId === u.user_id}
                      className="rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {busyUserId === u.user_id
                        ? "Working…"
                        : u.roles.includes("admin")
                          ? "Revoke admin"
                          : "Grant admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 px-4 py-2 text-[10px] text-slate-400">
          {filtered.length} of {users.length} users shown
        </div>
      </div>
    </>
  );
}

export default function UserManagement() {
  return <AdminAccessGate>{() => <UsersTable />}</AdminAccessGate>;
}
