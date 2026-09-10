import { createFileRoute } from "@tanstack/react-router";
import PlatformSettings from "@/pages/admin/PlatformSettings";

export const Route = createFileRoute("/hq/settings")({
  head: () => ({
    meta: [{ title: "Platform Settings — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: PlatformSettings,
});
