import { createFileRoute } from "@tanstack/react-router";
import IdvReview from "@/pages/admin/IdvReview";

export const Route = createFileRoute("/hq/idv")({
  head: () => ({
    meta: [{ title: "IDV Review — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: IdvReview,
});
