import { createFileRoute } from "@tanstack/react-router";
import DocStubPage from "@/pages/docs/Stub";

const title = "Webhooks — Izenzo Docs";
const description = "Webhooks reference for the Izenzo Governance Network API.";

export const Route = createFileRoute("/docs/webhooks")({
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
  component: DocStubPage,
});
