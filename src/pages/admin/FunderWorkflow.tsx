import { Link } from "@/lib/router-compat";
import { AdminAccessGate } from "@/components/izenzo/AdminAccessGate";

const SECTIONS = [
  { to: "/hq/funder/organisations", label: "Funder Organisations", desc: "Manage funder organisations and their named users." },
  { to: "/hq/funder/releases", label: "Release to Funder", desc: "Grant a named user access to a specific evidence pack version with expiry." },
  { to: "/hq/funder/onboarding", label: "Funder Requests", desc: "Triage funder requests; approve, reject, assign or close." },
  { to: "/hq/funder/audit", label: "Audit & Downloads", desc: "Read-only audit trail and document download history." },
];

function Workflow() {
  return (
    <>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Admin · Funder Workflow</div>
      <h1 className="text-2xl font-semibold text-slate-100">Funder Workflow</h1>
      <p className="mt-1 text-sm text-slate-400">
        Funder access is manual and granted only by platform admin. Funder roles do not inherit any internal
        admin, operator or compliance permissions.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="block rounded-lg border border-white/10 bg-white/[0.02] p-4 hover:bg-white/5">
            <div className="text-sm font-medium text-slate-100">{s.label}</div>
            <div className="mt-1 text-xs text-slate-500">{s.desc}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function FunderWorkflow() {
  return <AdminAccessGate>{() => <Workflow />}</AdminAccessGate>;
}
