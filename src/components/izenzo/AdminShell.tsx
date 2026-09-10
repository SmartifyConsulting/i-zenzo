import type { ReactNode } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import * as api from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";

type NavItem = { label: string; to?: string };
type NavGroup = { heading: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    heading: "Command Centre",
    items: [
      { label: "HQ Overview", to: "/hq" },
      { label: "Platform Spine" },
      { label: "Users", to: "/hq/users" },
      { label: "Organisations" },
      { label: "Engagements" },
      { label: "Facilitation" },
    ],
  },
  {
    heading: "Compliance",
    items: [
      { label: "Compliance Workbench" },
      { label: "IDV Review" },
      { label: "Governance Cases" },
      { label: "Disputes" },
      { label: "Legal Holds" },
    ],
  },
  {
    heading: "Funder Workspace",
    items: [
      { label: "Overview" },
      { label: "Onboarding" },
      { label: "Funder Orgs" },
      { label: "Deal Releases" },
      { label: "Audit & Usage" },
      { label: "Funder Workflow" },
      { label: "Execution Cases" },
    ],
  },
  {
    heading: "Registry",
    items: [
      { label: "Registry Console" },
      { label: "Operations" },
      { label: "Records" },
      { label: "Claims" },
      { label: "Bank Verification" },
      { label: "API Clients" },
      { label: "API Usage" },
    ],
  },
];

const TOP_TABS: NavItem[] = [
  { label: "Canonical Spine", to: "/hq" },
  { label: "User Management", to: "/hq/users" },
  { label: "Organisation Management" },
  { label: "Enterprise Identity" },
  { label: "Engagements" },
  { label: "Facilitation Queue" },
  { label: "AI Suggestions" },
  { label: "Dispute Resolution" },
  { label: "Revenue & Sales" },
  { label: "Legacy Repair" },
  { label: "Retention & Holds" },
  { label: "Governance Records" },
  { label: "Audit & Health" },
  { label: "System Health" },
  { label: "Platform Settings" },
];

export function AdminShell({ userEmail, children }: { userEmail: string; children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  async function handleSignOut() {
    await api.logout();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0d1220] px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500 text-xs font-bold text-white">
            IZ
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold tracking-wide text-slate-100">IZENZO · ADMIN</div>
            <div className="text-[10px] text-slate-500">PLATFORM ADMINISTRATION</div>
          </div>
          <div className="ml-4 rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-400">
            WORKSPACE
            <div className="text-xs font-medium text-slate-200">Platform HQ</div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/" className="text-slate-400 hover:text-slate-200">
            View Public Site
          </Link>
          <span className="text-slate-400">{userEmail}</span>
          <button onClick={handleSignOut} className="text-slate-400 hover:text-slate-200">
            Sign out
          </button>
        </div>
      </header>

      <nav className="flex items-center gap-5 overflow-x-auto border-b border-white/10 bg-[#0d1220] px-4 text-xs">
        {TOP_TABS.map((tab) => {
          const active = tab.to && pathname === tab.to;
          const cls = `whitespace-nowrap border-b-2 py-2.5 ${
            active ? "border-emerald-500 text-slate-100" : "border-transparent text-slate-500"
          } ${tab.to ? "hover:text-slate-300" : "cursor-default"}`;
          return tab.to ? (
            <Link key={tab.label} to={tab.to} className={cls}>
              {tab.label}
            </Link>
          ) : (
            <span key={tab.label} className={cls}>
              {tab.label}
            </span>
          );
        })}
      </nav>

      <div className="flex">
        <aside className="w-52 shrink-0 border-r border-white/10 bg-[#0d1220] px-3 py-4 text-xs">
          {NAV.map((group) => (
            <div key={group.heading} className="mb-5">
              <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {group.heading}
              </div>
              {group.items.map((item) => {
                const active = item.to && pathname === item.to;
                const content = (
                  <div
                    className={`flex items-center justify-between rounded px-2 py-1.5 ${
                      active
                        ? "bg-emerald-500/10 text-emerald-400"
                        : item.to
                          ? "text-slate-300 hover:bg-white/5"
                          : "cursor-default text-slate-600"
                    }`}
                  >
                    <span>{item.label}</span>
                    {!item.to && <span className="text-[9px] text-slate-700">Soon</span>}
                  </div>
                );
                return item.to ? (
                  <Link key={item.label} to={item.to}>
                    {content}
                  </Link>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>
          ))}
          <div className="mt-6 border-t border-white/10 pt-3">
            <Link to="/dashboard" className="px-2 text-slate-500 hover:text-slate-300">
              ← Return to Desk
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
