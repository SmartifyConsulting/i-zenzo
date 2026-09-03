import { createFileRoute } from "@tanstack/react-router";
import Traders from "@/pages/solutions/Traders";

const title = "For Traders — Izenzo";
const description = "Close cross-border commodity deals faster with governed counterparty discovery and cryptographic Proof of Intent.";

export const Route = createFileRoute("/solutions/traders")({
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
  component: Traders,
});
