import { createFileRoute } from "@tanstack/react-router";
import SystemHealth from "@/pages/admin/SystemHealth";

export const Route = createFileRoute("/hq/system-health")({
  head: () => ({
    meta: [{ title: "System Health — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: SystemHealth,
});
