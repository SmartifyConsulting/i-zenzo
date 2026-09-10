import { createFileRoute } from "@tanstack/react-router";
import RegistryOperations from "@/pages/admin/RegistryOperations";

export const Route = createFileRoute("/hq/registry/operations")({
  head: () => ({
    meta: [{ title: "Registry Operations — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: RegistryOperations,
});
