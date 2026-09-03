import { createFileRoute } from "@tanstack/react-router";
import Walkthrough from "@/pages/Walkthrough";

const title = "Walkthrough — Izenzo";
const description = "Follow a live institutional trade through all nine governance gates, from match creation to WaD certificate issuance.";

export const Route = createFileRoute("/walkthrough")({
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
  component: Walkthrough,
});
