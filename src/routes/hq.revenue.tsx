import { createFileRoute } from "@tanstack/react-router";
import RevenueSales from "@/pages/admin/RevenueSales";

export const Route = createFileRoute("/hq/revenue")({
  head: () => ({
    meta: [{ title: "Revenue & Sales — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: RevenueSales,
});
