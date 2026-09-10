import { createFileRoute } from "@tanstack/react-router";
import FunderOverview from "@/pages/admin/FunderOverview";

export const Route = createFileRoute("/hq/funder/")({
  head: () => ({
    meta: [{ title: "Funder Workspace — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: FunderOverview,
});
