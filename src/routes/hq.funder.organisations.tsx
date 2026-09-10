import { createFileRoute } from "@tanstack/react-router";
import FunderOrganisations from "@/pages/admin/FunderOrganisations";

export const Route = createFileRoute("/hq/funder/organisations")({
  head: () => ({
    meta: [{ title: "Funder Organisations — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: FunderOrganisations,
});
