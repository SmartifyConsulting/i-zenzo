import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

const title = "Izenzo — Governance Infrastructure for Institutional Trade";
const description =
  "One cryptographic network for institutional commodity trade: turnkey Trade Desk, Compliance Profile risk management, and a hash-sealed, independently verifiable API.";

export const Route = createFileRoute("/")({
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
  component: Home,
});
