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
      { label: "Platform Spine", to: "/hq" },
      { label: "Users", to: "/hq/users" },
      { label: "Organisations", to: "/hq/organisations" },
      { label: "Engagements", to: "/hq/engagements" },
      { label: "Facilitation", to: "/hq/facilitation" },
    ],
  },
  {
    heading: "Compliance",
    items: [
      { label: "Compliance Workbench", to: "/hq/compliance" },
      { label: "IDV Review", to: "/hq/idv" },
      { label: "Governance Cases", to: "/hq/governance" },
      { label: "Disputes", to: "/hq/disputes" },
      { label: "Legal Holds", to: "/hq/legal-holds" },
    ],
  },
  {
    heading: "Funder Workspace",
    items: [
      { label: "Overview", to: "/hq/funder" },
      { label: "Onboarding", to: "/hq/funder/onboarding" },
      { label: "Funder Orgs", to: "/hq/funder/organisations" },
      { label: "Deal Releases", to: "/hq/funder/releases" },
      { label: "Audit & Usage", to: "/hq/funder/audit" },
      { label: "Funder Workflow", to: "/hq/funder-workflow" },
      { label: "Execution Cases", to: "/hq/execution-cases" },
    ],
  },
  {
    heading: "Registry",
    items: [
      { label: "Registry Console", to: "/hq/registry" },
      { label: "Operations", to: "/hq/registry/operations" },
      { label: "Records", to: "/hq/registry/records" },
      { label: "Claims", to: "/hq/registry/claims" },
      { label: "Bank Verification", to: "/hq/registry/bank-verification" },
      { label: "API Clients", to: "/hq/registry/api-clients" },
      { label: "API Usage", to: "/hq/registry/api-usage" },
    ],
  },
];

const TOP_TABS: NavItem[] = [
  { label: "Canonical Spine", to: "/hq" },
  { label: "User Management", to: "/hq/users" },
  { label: "Organisation Management", to: "/hq/organisations" },
  { label: "Enterprise Identity", to: "/hq/identity" },
  { label: "Engagements", to: "/hq/engagements" },
  { label: "Facilitation Queue", to: "/hq/facilitation" },
  { label: "AI Suggestions", to: "/hq/ai-suggestions" },
  { label: "Dispute Resolution", to: "/hq/disputes" },
  { label: "Revenue & Sales", to: "/hq/revenue" },
  { label: "Legacy Repair", to: "/hq/legacy-repair" },
  { label: "Retention & Holds", to: "/hq/legal-holds" },
  { label: "Governance Records", to: "/hq/governance-records" },
  { label: "Audit & Health", to: "/hq/audit" },
  { label: "System Health", to: "/hq/system-health" },
  { label: "Platform Settings", to: "/hq/settings" },
];

export function AdminShell({ userEmail, children }: { userEmail: string; children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  async function handleSignOut() {
    await api.logout();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500 text-xs font-bold text-white">
            IZ
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold tracking-wide text-slate-900">IZENZO · ADMIN</div>
            <div className="text-[10px] text-slate-500">PLATFORM ADMINISTRATION</div>
          </div>
          <div className="ml-4 rounded border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
            WORKSPACE
            <div className="text-xs font-medium text-slate-800">Platform HQ</div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/" className="text-slate-500 hover:text-slate-800">
            View Public Site
          </Link>
          <span className="text-slate-500">{userEmail}</span>
          <button onClick={handleSignOut} className="text-slate-500 hover:text-slate-800">
            Sign out
          </button>
        </div>
      </header>

      <nav className="flex items-center gap-5 overflow-x-auto border-b border-slate-200 bg-white px-4 text-xs">
        {TOP_TABS.map((tab) => {
          const active = tab.to && pathname === tab.to;
          const cls = `whitespace-nowrap border-b-2 py-2.5 ${
            active ? "border-emerald-500 text-slate-900" : "border-transparent text-slate-500"
          } ${tab.to ? "hover:text-slate-700" : "cursor-default"}`;
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
        <aside className="w-52 shrink-0 border-r border-slate-200 bg-white px-3 py-4 text-xs">
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
                        ? "bg-emerald-500/10 text-emerald-700"
                        : item.to
                          ? "text-slate-700 hover:bg-slate-50"
                          : "cursor-default text-slate-400"
                    }`}
                  >
                    <span>{item.label}</span>
                    {!item.to && <span className="text-[9px] text-slate-400">Soon</span>}
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
          <div className="mt-6 border-t border-slate-200 pt-3">
            <Link to="/dashboard" className="px-2 text-slate-500 hover:text-slate-700">
              ← Return to Desk
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
