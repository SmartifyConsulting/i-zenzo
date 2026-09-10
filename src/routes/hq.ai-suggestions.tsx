import { createFileRoute } from "@tanstack/react-router";
import AiSuggestions from "@/pages/admin/AiSuggestions";

export const Route = createFileRoute("/hq/ai-suggestions")({
  head: () => ({
    meta: [{ title: "AI Suggestions — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AiSuggestions,
});
