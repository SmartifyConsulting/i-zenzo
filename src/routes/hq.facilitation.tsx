import { createFileRoute } from "@tanstack/react-router";
import Facilitation from "@/pages/admin/Facilitation";

export const Route = createFileRoute("/hq/facilitation")({
  head: () => ({
    meta: [{ title: "Facilitation — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Facilitation,
});
