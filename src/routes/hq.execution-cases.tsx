import { createFileRoute } from "@tanstack/react-router";
import ExecutionCases from "@/pages/admin/ExecutionCases";

export const Route = createFileRoute("/hq/execution-cases")({
  head: () => ({
    meta: [{ title: "Execution Cases — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: ExecutionCases,
});
