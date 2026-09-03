import { createFileRoute } from "@tanstack/react-router";
import Pricing from "@/pages/Pricing";

const title = "Pricing — Izenzo";
const description = "Transparent workspace and per-endpoint pricing for the Izenzo Governance Network.";

export const Route = createFileRoute("/pricing")({
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
  component: Pricing,
});
