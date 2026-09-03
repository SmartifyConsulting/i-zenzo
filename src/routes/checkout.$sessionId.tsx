import { createFileRoute } from "@tanstack/react-router";
import Checkout from "@/pages/Checkout";

const title = "Sandbox Checkout — Izenzo";
const description = "Simulated token purchase checkout for the Izenzo Governance Network sandbox.";

function CheckoutRoute() {
  const { sessionId } = Route.useParams();
  return <Checkout sessionId={sessionId} />;
}

export const Route = createFileRoute("/checkout/$sessionId")({
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
  component: CheckoutRoute,
});
