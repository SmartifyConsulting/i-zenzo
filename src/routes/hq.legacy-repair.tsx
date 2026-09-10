import { createFileRoute } from "@tanstack/react-router";
import LegacyRepair from "@/pages/admin/LegacyRepair";

export const Route = createFileRoute("/hq/legacy-repair")({
  head: () => ({
    meta: [{ title: "Legacy Repair — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: LegacyRepair,
});
