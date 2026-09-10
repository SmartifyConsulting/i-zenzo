import { createFileRoute } from "@tanstack/react-router";
import ComplianceWorkbench from "@/pages/admin/ComplianceWorkbench";

export const Route = createFileRoute("/hq/compliance")({
  head: () => ({
    meta: [{ title: "Compliance Workbench — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: ComplianceWorkbench,
});
