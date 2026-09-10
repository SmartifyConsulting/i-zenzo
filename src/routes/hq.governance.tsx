import { createFileRoute } from "@tanstack/react-router";
import GovernanceCases from "@/pages/admin/GovernanceCases";

export const Route = createFileRoute("/hq/governance")({
  head: () => ({
    meta: [{ title: "Governance Cases — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: GovernanceCases,
});
