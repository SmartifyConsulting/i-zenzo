import { createFileRoute } from "@tanstack/react-router";
import RegistryClaims from "@/pages/admin/RegistryClaims";

export const Route = createFileRoute("/hq/registry/claims")({
  head: () => ({
    meta: [{ title: "Registry Claims — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: RegistryClaims,
});
