import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: unknown; userId: string; claims: Record<string, unknown> };

async function requireAdmin(context: Ctx) {
  const db = context.supabase as any;
  const { data, error } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

/* ------------------------------------------------------------------ */
/* Access check — used by the /hq route guard, never throws             */
/* ------------------------------------------------------------------ */

export const adminCheckAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    const db = ctx.supabase as any;
    const { data } = await db
      .from("user_roles")
      .select("role")
      .eq("user_id", ctx.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

/* ------------------------------------------------------------------ */
/* HQ Overview — Canonical Spine: one row per match, live status       */
/* across Search -> Match -> POI -> WaD -> Execution, across every      */
/* workspace (not just the caller's own).                               */
/* ------------------------------------------------------------------ */

export const adminListSpine = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;

    const { data: rows, error } = await db
      .from("spine_transactions")
      .select("id, lifecycle, trading_stage, created_at, workspace_id")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);

    const workspaceIds = Array.from(new Set((rows ?? []).map((r: any) => r.workspace_id)));
    const { data: workspaces } = workspaceIds.length
      ? await db.from("workspaces").select("id, name, email").in("id", workspaceIds)
      : { data: [] };
    const workspaceById = new Map((workspaces ?? []).map((w: any) => [w.id, w]));

    const matches = await Promise.all(
      (rows ?? []).map(async (t: any) => {
        const [bidOffer, poi, wad, execution] = await Promise.all([
          db
            .from("bid_offers")
            .select("subject_description, represented_org, actor_person")
            .eq("transaction_id", t.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          db.from("pois").select("status").eq("transaction_id", t.id).maybeSingle(),
          db.from("wads").select("status, decision").eq("transaction_id", t.id).maybeSingle(),
          db.from("executions").select("status").eq("transaction_id", t.id).maybeSingle(),
        ]);
        const workspace = workspaceById.get(t.workspace_id) as { name?: string; email?: string } | undefined;
        return {
          transaction_id: t.id,
          lifecycle: t.lifecycle,
          trading_stage: t.trading_stage,
          subject: bidOffer.data?.subject_description ?? null,
          requester_org: bidOffer.data?.represented_org ?? workspace?.name ?? workspace?.email ?? "—",
          poi_status: poi.data?.status ?? null,
          wad_status: wad.data?.decision ?? wad.data?.status ?? null,
          execution_status: execution.data?.status ?? null,
          created_at: t.created_at,
        };
      }),
    );

    return { matches };
  });

/* ------------------------------------------------------------------ */
/* HQ Overview — summary counters for the header tiles                  */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* User Management — every registered workspace + its role assignments  */
/* ------------------------------------------------------------------ */

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;

    const { data: workspaces, error } = await db
      .from("workspaces")
      .select("id, user_id, name, email, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const { data: roles } = await db.from("user_roles").select("user_id, role");
    const rolesByUser = new Map<string, string[]>();
    for (const r of roles ?? []) {
      const list = rolesByUser.get(r.user_id) ?? [];
      list.push(r.role);
      rolesByUser.set(r.user_id, list);
    }

    const users = (workspaces ?? []).map((w: any) => ({
      user_id: w.user_id,
      name: w.name,
      email: w.email,
      registered_at: w.created_at,
      roles: rolesByUser.get(w.user_id) ?? [],
    }));

    return { users };
  });

type AppRole = "admin" | "moderator" | "user";

export const adminSetUserRole = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { userId: string; role: AppRole; grant: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;

    if (data.grant) {
      const { error } = await db
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await db
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Organisation Management                                              */
/* ------------------------------------------------------------------ */

export const adminListOrganisations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;

    const { data: orgs, error } = await db
      .from("organisations")
      .select("id, name, sandbox_enabled, clip_on_plan, status, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const orgIds = (orgs ?? []).map((o: any) => o.id);
    const { data: members } = orgIds.length
      ? await db.from("organisation_members").select("organisation_id, workspace_id").in("organisation_id", orgIds)
      : { data: [] };

    const workspaceIds = Array.from(new Set((members ?? []).map((m: any) => m.workspace_id)));
    const { data: apiKeys } = workspaceIds.length
      ? await db.from("spine_api_keys").select("id, workspace_id").in("workspace_id", workspaceIds)
      : { data: [] };

    const membersByOrg = new Map<string, string[]>();
    for (const m of members ?? []) {
      const list = membersByOrg.get(m.organisation_id) ?? [];
      list.push(m.workspace_id);
      membersByOrg.set(m.organisation_id, list);
    }
    const apiKeyCountByWorkspace = new Map<string, number>();
    for (const k of apiKeys ?? []) {
      apiKeyCountByWorkspace.set(k.workspace_id, (apiKeyCountByWorkspace.get(k.workspace_id) ?? 0) + 1);
    }

    const organisations = (orgs ?? []).map((o: any) => {
      const workspaceIdsForOrg = membersByOrg.get(o.id) ?? [];
      const apiKeyCount = workspaceIdsForOrg.reduce(
        (sum, wsId) => sum + (apiKeyCountByWorkspace.get(wsId) ?? 0),
        0,
      );
      return {
        id: o.id,
        name: o.name,
        users: workspaceIdsForOrg.length,
        api_keys: apiKeyCount,
        sandbox_enabled: o.sandbox_enabled,
        clip_on_plan: o.clip_on_plan,
        status: o.status,
        created_at: o.created_at,
      };
    });

    return { organisations };
  });

export const adminUpdateOrganisation = createServerFn({ method: "POST" })
  .inputValidator(
    (d: unknown) =>
      d as { organisationId: string; status?: "active" | "suspended"; sandboxEnabled?: boolean },
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;

    const patch: Record<string, unknown> = {};
    if (data.status !== undefined) patch["status"] = data.status;
    if (data.sandboxEnabled !== undefined) patch["sandbox_enabled"] = data.sandboxEnabled;

    const { error } = await db.from("organisations").update(patch).eq("id", data.organisationId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetHqSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;

    const [txns, workspaces, wads, executions] = await Promise.all([
      db.from("spine_transactions").select("id", { count: "exact", head: true }),
      db.from("workspaces").select("id", { count: "exact", head: true }),
      db.from("wads").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
      db.from("executions").select("id", { count: "exact", head: true }).neq("status", "COMPLETE"),
    ]);

    return {
      total_matches: txns.count ?? 0,
      total_workspaces: workspaces.count ?? 0,
      wads_pending: wads.count ?? 0,
      executions_open: executions.count ?? 0,
    };
  });
