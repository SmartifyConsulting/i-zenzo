import { createFileRoute } from "@tanstack/react-router";
import HqOverview from "@/pages/admin/HqOverview";

export const Route = createFileRoute("/hq/")({
  head: () => ({
    meta: [{ title: "Platform HQ — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: HqOverview,
});
