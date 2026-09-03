import { createFileRoute } from "@tanstack/react-router";
import ComplianceEngine from "@/pages/products/ComplianceEngine";

const title = "Compliance Engine — Izenzo";
const description = "Policy-as-code compliance for institutional trade: sanctions screening, UBO disclosure, jurisdiction resolution and authority binding.";

export const Route = createFileRoute("/products/compliance-engine")({
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
  component: ComplianceEngine,
});
