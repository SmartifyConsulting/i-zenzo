import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import * as api from "@/lib/api";
import * as adminApi from "@/lib/admin-api";

export function useAdminAccess() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const authed = await api.isLoggedIn();
      if (!authed) {
        navigate({ to: "/auth" });
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      setEmail(data.user?.email ?? "");

      const { isAdmin } = await adminApi.checkAdminAccess();
      if (cancelled) return;
      setStatus(isAdmin ? "ok" : "denied");
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return { email, status };
}
