import { createFileRoute } from "@tanstack/react-router";
import TradeDesk from "@/pages/products/TradeDesk";

const title = "Trade Desk — Izenzo";
const description = "Governance infrastructure for the deal maker: discover counterparties, run the 9-Gate compliance workflow and mint hash-sealed Proof of Intent.";

export const Route = createFileRoute("/products/trade-desk")({
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
  component: TradeDesk,
});
