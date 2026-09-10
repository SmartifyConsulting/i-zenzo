import { createFileRoute } from "@tanstack/react-router";
import BankVerification from "@/pages/admin/BankVerification";

export const Route = createFileRoute("/hq/registry/bank-verification")({
  head: () => ({
    meta: [{ title: "Bank Verification — Izenzo Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: BankVerification,
});
