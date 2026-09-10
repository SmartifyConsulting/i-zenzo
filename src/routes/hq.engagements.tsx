import { createFileRoute } from "@tanstack/react-router";
import Engagements from "@/pages/admin/Engagements";

export const Route = createFileRoute("/hq/engagements")({
  head: () => ({
    meta: [{ title: "Engagements — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Engagements,
});
