import { createFileRoute } from "@tanstack/react-router";
import LiveDemo from "@/pages/LiveDemo";

const title = "Live Backend Demo — Izenzo";
const description =
  "Run the Izenzo Trading spine end-to-end: Bid/Offer through POI, WaD sanctions screening, Execution and Finality.";

export const Route = createFileRoute("/live-demo")({
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
  component: LiveDemo,
});
