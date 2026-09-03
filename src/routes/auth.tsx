import { createFileRoute } from "@tanstack/react-router";
import Auth from "@/pages/Auth";

const title = "Sign in — Izenzo";
const description = "Sign in to your Izenzo workspace or create an account on the Izenzo Governance Network.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Auth,
});
