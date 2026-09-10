import { createFileRoute } from "@tanstack/react-router";
import GovernanceRecords from "@/pages/admin/GovernanceRecords";

export const Route = createFileRoute("/hq/governance-records")({
  head: () => ({
    meta: [{ title: "Governance Records — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: GovernanceRecords,
});
