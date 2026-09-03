import { createFileRoute } from "@tanstack/react-router";
import Finance from "@/pages/solutions/Finance";

const title = "For Trade Finance — Izenzo";
const description = "Bankable evidence packs and verifiable trade records for lenders, insurers and trade finance desks.";

export const Route = createFileRoute("/solutions/finance")({
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
  component: Finance,
});
