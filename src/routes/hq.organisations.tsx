import { createFileRoute } from "@tanstack/react-router";
import OrganisationManagement from "@/pages/admin/OrganisationManagement";

export const Route = createFileRoute("/hq/organisations")({
  head: () => ({
    meta: [{ title: "Organisation Management — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: OrganisationManagement,
});
