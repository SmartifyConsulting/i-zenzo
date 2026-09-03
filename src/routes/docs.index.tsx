import { createFileRoute } from "@tanstack/react-router";
import DocsIndex from "@/pages/docs/DocsIndex";

const title = "Developer Docs — Izenzo";
const description = "Build directly on the Izenzo Governance Network: quickstart, authentication, webhooks and the full API reference.";

export const Route = createFileRoute("/docs/")({
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
  component: DocsIndex,
});
