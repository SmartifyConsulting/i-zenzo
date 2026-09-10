import { createFileRoute } from "@tanstack/react-router";
import RegistryRecords from "@/pages/admin/RegistryRecords";

export const Route = createFileRoute("/hq/registry/records")({
  head: () => ({
    meta: [{ title: "Registry Records — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: RegistryRecords,
});
