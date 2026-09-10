import { createFileRoute } from "@tanstack/react-router";
import AuditHealth from "@/pages/admin/AuditHealth";

export const Route = createFileRoute("/hq/audit")({
  head: () => ({
    meta: [{ title: "Audit & Health — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AuditHealth,
});
