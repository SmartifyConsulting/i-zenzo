import { createFileRoute } from "@tanstack/react-router";
import Trust from "@/pages/Trust";

const title = "Trust & Security — Izenzo";
const description = "How Izenzo secures institutional trade data: hash-chained evidence, regional policy, encryption and independent verification.";

export const Route = createFileRoute("/trust")({
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
  component: Trust,
});
