import { createFileRoute } from "@tanstack/react-router";
import ApiReference from "@/pages/docs/ApiReference";

const title = "API Reference — Izenzo";
const description = "Every Izenzo Governance Network endpoint, request and response, with base URL and versioning.";

export const Route = createFileRoute("/docs/api")({
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
  component: ApiReference,
});
