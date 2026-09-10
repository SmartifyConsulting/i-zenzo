import { createFileRoute } from "@tanstack/react-router";
import FunderWorkflow from "@/pages/admin/FunderWorkflow";

export const Route = createFileRoute("/hq/funder-workflow")({
  head: () => ({
    meta: [{ title: "Funder Workflow — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: FunderWorkflow,
});
