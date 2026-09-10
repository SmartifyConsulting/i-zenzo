import { createFileRoute } from "@tanstack/react-router";
import LegalHolds from "@/pages/admin/LegalHolds";

export const Route = createFileRoute("/hq/legal-holds")({
  head: () => ({
    meta: [{ title: "Legal Holds — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: LegalHolds,
});
