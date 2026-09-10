import { createFileRoute } from "@tanstack/react-router";
import RegistryConsole from "@/pages/admin/RegistryConsole";

export const Route = createFileRoute("/hq/registry/")({
  head: () => ({
    meta: [{ title: "Registry Console — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: RegistryConsole,
});
