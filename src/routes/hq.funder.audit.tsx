import { createFileRoute } from "@tanstack/react-router";
import FunderAudit from "@/pages/admin/FunderAudit";

export const Route = createFileRoute("/hq/funder/audit")({
  head: () => ({
    meta: [{ title: "Funder Audit & Usage — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: FunderAudit,
});
