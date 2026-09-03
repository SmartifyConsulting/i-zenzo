import { createFileRoute } from "@tanstack/react-router";
import Sovereigns from "@/pages/solutions/Sovereigns";

const title = "For Sovereigns — Izenzo";
const description = "Jurisdictional governance infrastructure for state trading entities, regulators and sovereign commodity programmes.";

export const Route = createFileRoute("/solutions/sovereigns")({
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
  component: Sovereigns,
});
