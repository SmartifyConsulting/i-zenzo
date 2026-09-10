import { createFileRoute } from "@tanstack/react-router";
import FunderOnboarding from "@/pages/admin/FunderOnboarding";

export const Route = createFileRoute("/hq/funder/onboarding")({
  head: () => ({
    meta: [{ title: "Funder Onboarding — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: FunderOnboarding,
});
