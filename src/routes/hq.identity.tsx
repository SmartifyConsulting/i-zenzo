import { createFileRoute } from "@tanstack/react-router";
import EnterpriseIdentity from "@/pages/admin/EnterpriseIdentity";

export const Route = createFileRoute("/hq/identity")({
  head: () => ({
    meta: [{ title: "Enterprise Identity — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: EnterpriseIdentity,
});
