import { createFileRoute } from "@tanstack/react-router";
import RegistryApiClients from "@/pages/admin/RegistryApiClients";

export const Route = createFileRoute("/hq/registry/api-clients")({
  head: () => ({
    meta: [{ title: "Registry API Clients — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: RegistryApiClients,
});
