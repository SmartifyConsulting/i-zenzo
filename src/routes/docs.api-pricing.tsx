import { createFileRoute } from "@tanstack/react-router";
import DocStubPage from "@/pages/docs/Stub";

const title = "Endpoint pricing — Izenzo Docs";
const description = "Endpoint pricing reference for the Izenzo Governance Network API.";

export const Route = createFileRoute("/docs/api-pricing")({
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
