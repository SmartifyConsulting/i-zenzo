import { createFileRoute } from "@tanstack/react-router";
import Disputes from "@/pages/admin/Disputes";

export const Route = createFileRoute("/hq/disputes")({
  head: () => ({
    meta: [{ title: "Dispute Resolution — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Disputes,
});
