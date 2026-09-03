import { createFileRoute } from "@tanstack/react-router";
import AuditLedger from "@/pages/products/AuditLedger";

const title = "Audit Ledger — Izenzo";
const description = "A tamper-evident, SHA-256 hash-chained ledger that makes every trade decision independently verifiable.";

export const Route = createFileRoute("/products/audit-ledger")({
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
  component: AuditLedger,
});
