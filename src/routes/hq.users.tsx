import { createFileRoute } from "@tanstack/react-router";
import UserManagement from "@/pages/admin/UserManagement";

export const Route = createFileRoute("/hq/users")({
  head: () => ({
    meta: [{ title: "User Management — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: UserManagement,
});
