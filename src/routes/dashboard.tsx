import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";

const title = "Workspace Dashboard — Izenzo";
const description = "Your transactions, wallet balance, and gate status across the Izenzo Trading spine.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
