import { createFileRoute } from "@tanstack/react-router";
import DealReleases from "@/pages/admin/DealReleases";

export const Route = createFileRoute("/hq/funder/releases")({
  head: () => ({
    meta: [{ title: "Deal Releases — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: DealReleases,
});
