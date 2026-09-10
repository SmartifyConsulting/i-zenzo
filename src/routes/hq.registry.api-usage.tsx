import { createFileRoute } from "@tanstack/react-router";
import RegistryApiUsage from "@/pages/admin/RegistryApiUsage";

export const Route = createFileRoute("/hq/registry/api-usage")({
  head: () => ({
    meta: [{ title: "Registry API Usage — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: RegistryApiUsage,
});
