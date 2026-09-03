import { createFileRoute } from "@tanstack/react-router";
import Status from "@/pages/Status";

const title = "Status — Izenzo";
const description = "Live operational status for the Izenzo Governance Network API, ledger and webhooks.";

export const Route = createFileRoute("/status")({
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
  component: Status,
});
