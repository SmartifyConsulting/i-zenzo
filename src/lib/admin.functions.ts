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

/* ------------------------------------------------------------------ */
/* Engagements — POI hold-point queue across every workspace            */
/* ------------------------------------------------------------------ */

export const adminListEngagements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;

    const { data: pois, error } = await db
      .from("pois")
      .select("id, transaction_id, status, sealed_at, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    const txnIds = (pois ?? []).map((p: any) => p.transaction_id);
    const [{ data: txns }, { data: notes }] = await Promise.all([
      txnIds.length
        ? db.from("spine_transactions").select("id, workspace_id, trading_stage").in("id", txnIds)
        : { data: [] },
      db
        .from("engagement_notes")
        .select("id, poi_id, note, created_at")
        .in("poi_id", (pois ?? []).map((p: any) => p.id))
        .order("created_at", { ascending: false }),
    ]);

    const txnById = new Map((txns ?? []).map((t: any) => [t.id, t]));
    const workspaceIds = Array.from(new Set((txns ?? []).map((t: any) => t.workspace_id)));
    const { data: workspaces } = workspaceIds.length
      ? await db.from("workspaces").select("id, name, email").in("id", workspaceIds)
      : { data: [] };
    const workspaceById = new Map((workspaces ?? []).map((w: any) => [w.id, w]));

    const bidOffers = await Promise.all(
      (pois ?? []).map((p: any) =>
        db
          .from("bid_offers")
          .select("subject_description, represented_org")
          .eq("transaction_id", p.transaction_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ),
    );

    const notesByPoi = new Map<string, typeof notes>();
    for (const n of notes ?? []) {
      const list = notesByPoi.get(n.poi_id) ?? [];
      list.push(n);
      notesByPoi.set(n.poi_id, list as any);
    }

    const engagements = (pois ?? []).map((p: any, i: number) => {
      const txn = txnById.get(p.transaction_id) as { workspace_id?: string; trading_stage?: string } | undefined;
      const workspace = txn ? (workspaceById.get(txn.workspace_id) as { name?: string; email?: string } | undefined) : undefined;
      return {
        poi_id: p.id,
        transaction_id: p.transaction_id,
        status: p.status,
        sealed_at: p.sealed_at,
        created_at: p.created_at,
        subject: bidOffers[i].data?.subject_description ?? null,
        requester_org: bidOffers[i].data?.represented_org ?? workspace?.name ?? workspace?.email ?? "—",
        notes: notesByPoi.get(p.id) ?? [],
      };
    });

    return { engagements };
  });

export const adminAddEngagementNote = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { poiId: string; note: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("engagement_notes")
      .insert({ poi_id: data.poiId, note: data.note, author_id: ctx.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Facilitation — Phase 1 case queue + Phase 2 outreach                 */
/* ------------------------------------------------------------------ */

export const adminListFacilitationCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: cases, error } = await db
      .from("facilitation_cases")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const now = Date.now();
    const openCases = (cases ?? []).filter((c: any) => !c.closed_at);
    const overdue = openCases.filter((c: any) => c.due_date && new Date(c.due_date).getTime() < now);
    const weekAgo = now - 7 * 86400000;
    const monthAgo = now - 30 * 86400000;

    return {
      cases: cases ?? [],
      summary: {
        open_cases: openCases.length,
        new_this_week: (cases ?? []).filter((c: any) => new Date(c.created_at).getTime() >= weekAgo).length,
        new_this_month: (cases ?? []).filter((c: any) => new Date(c.created_at).getTime() >= monthAgo).length,
        overdue: overdue.length,
      },
    };
  });

export const adminAssignFacilitationCase = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { caseId: string; status?: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const patch: Record<string, unknown> = { owner_id: ctx.userId };
    if (data.status) patch["status"] = data.status;
    const { error } = await db.from("facilitation_cases").update(patch).eq("id", data.caseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListEmailTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("facilitation_email_templates")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return { templates: data ?? [] };
  });

export const adminApproveEmailTemplate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { templateId: string; approve: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const patch = data.approve
      ? { status: "approved", approved_at: new Date().toISOString() }
      : { status: "draft", approved_at: null };
    const { error } = await db.from("facilitation_email_templates").update(patch).eq("id", data.templateId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListDncRules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("facilitation_dnc_rules")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rules: data ?? [] };
  });

export const adminAddDncRule = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { ruleType: string; value: string; reason?: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db.from("facilitation_dnc_rules").insert({
      rule_type: data.ruleType,
      value: data.value,
      reason: data.reason ?? null,
      created_by: ctx.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteDncRule = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { ruleId: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db.from("facilitation_dnc_rules").delete().eq("id", data.ruleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Compliance Workbench                                                 */
/* ------------------------------------------------------------------ */

export const adminListComplianceCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("compliance_cases").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { cases: data ?? [] };
  });

export const adminUpdateComplianceCase = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { caseId: string; status: string; claim?: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const patch: Record<string, unknown> = { status: data.status };
    if (data.claim) patch["assigned_to"] = ctx.userId;
    if (data.status === "resolved") patch["resolved_at"] = new Date().toISOString();
    const { error } = await db.from("compliance_cases").update(patch).eq("id", data.caseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* IDV Review                                                           */
/* ------------------------------------------------------------------ */

export const adminListIdvReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("idv_reviews").select("*").order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { reviews: data ?? [] };
  });

export const adminDecideIdvReview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { reviewId: string; approve: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("idv_reviews")
      .update({
        status: data.approve ? "approved" : "rejected",
        reviewed_by: ctx.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.reviewId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Governance Cases (P-5)                                               */
/* ------------------------------------------------------------------ */

export const adminListGovernanceCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("governance_cases").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { cases: data ?? [] };
  });

export const adminClaimGovernanceCase = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { caseId: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("governance_cases")
      .update({ assigned_to: ctx.userId, status: "in_progress" })
      .eq("id", data.caseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Dispute Resolution                                                    */
/* ------------------------------------------------------------------ */

export const adminListDisputes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("disputes").select("*").order("raised_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { disputes: data ?? [] };
  });

export const adminResolveDispute = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { disputeId: string; notes: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("disputes")
      .update({ status: "resolved", resolution_notes: data.notes, resolved_at: new Date().toISOString() })
      .eq("id", data.disputeId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Legal Holds                                                          */
/* ------------------------------------------------------------------ */

export const adminListLegalHolds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("legal_holds").select("*").order("applied_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { holds: data ?? [] };
  });

export const adminApplyLegalHold = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { scopeType: string; scopeId: string; reason: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    if (data.reason.trim().length < 10) throw new Error("Reason must be at least 10 characters");
    const db = ctx.supabase as any;
    const { error } = await db.from("legal_holds").insert({
      scope_type: data.scopeType,
      scope_id: data.scopeId,
      reason: data.reason,
      applied_by: ctx.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReleaseLegalHold = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { holdId: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("legal_holds")
      .update({ status: "released", released_at: new Date().toISOString(), released_by: ctx.userId })
      .eq("id", data.holdId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Funder Workspace                                                      */
/* ------------------------------------------------------------------ */

async function logFunderAudit(db: any, actorId: string, event: string, detail?: string) {
  await db.from("funder_audit_log").insert({ actor_id: actorId, event, detail: detail ?? null });
}

export const adminGetFunderOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const [orgs, pending, releases, revoked] = await Promise.all([
      db.from("funder_organisations").select("id", { count: "exact", head: true }),
      db.from("funder_onboarding_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      db.from("deal_releases").select("id", { count: "exact", head: true }).eq("status", "active"),
      db.from("deal_releases").select("id", { count: "exact", head: true }).eq("status", "revoked"),
    ]);
    return {
      approved_organisations: orgs.count ?? 0,
      pending_onboarding: pending.count ?? 0,
      active_releases: releases.count ?? 0,
      revoked_releases: revoked.count ?? 0,
    };
  });

export const adminListOnboardingRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("funder_onboarding_requests")
      .select("*")
      .order("requested_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { requests: data ?? [] };
  });

export const adminDecideOnboardingRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { requestId: string; approve: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: reqRow, error: fetchErr } = await db
      .from("funder_onboarding_requests")
      .select("*")
      .eq("id", data.requestId)
      .single();
    if (fetchErr) throw new Error(fetchErr.message);

    const { error } = await db
      .from("funder_onboarding_requests")
      .update({
        status: data.approve ? "approved" : "rejected",
        decided_at: new Date().toISOString(),
        decided_by: ctx.userId,
      })
      .eq("id", data.requestId);
    if (error) throw new Error(error.message);

    if (data.approve) {
      await db
        .from("funder_organisations")
        .insert({ name: reqRow.org_name, contact_email: reqRow.contact_email });
    }
    await logFunderAudit(db, ctx.userId, data.approve ? "onboarding_approved" : "onboarding_rejected", reqRow.org_name);
    return { ok: true };
  });

export const adminListFunderOrganisations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("funder_organisations").select("*").order("approved_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { organisations: data ?? [] };
  });

export const adminListDealReleases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: releases, error } = await db
      .from("deal_releases")
      .select("*")
      .order("released_at", { ascending: false });
    if (error) throw new Error(error.message);

    const orgIds = Array.from(new Set((releases ?? []).map((r: any) => r.funder_org_id)));
    const { data: orgs } = orgIds.length
      ? await db.from("funder_organisations").select("id, name").in("id", orgIds)
      : { data: [] };
    const orgById = new Map((orgs ?? []).map((o: any) => [o.id, o.name]));

    return {
      releases: (releases ?? []).map((r: any) => ({ ...r, funder_org_name: orgById.get(r.funder_org_id) ?? "—" })),
    };
  });

export const adminCreateDealRelease = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { funderOrgId: string; packLabel: string; expiresInDays?: number })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const expiresAt = data.expiresInDays
      ? new Date(Date.now() + data.expiresInDays * 86400000).toISOString()
      : null;
    const { error } = await db.from("deal_releases").insert({
      funder_org_id: data.funderOrgId,
      pack_label: data.packLabel,
      expires_at: expiresAt,
    });
    if (error) throw new Error(error.message);
    await logFunderAudit(db, ctx.userId, "deal_release_created", data.packLabel);
    return { ok: true };
  });

export const adminRevokeDealRelease = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { releaseId: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("deal_releases")
      .update({ status: "revoked", revoked_at: new Date().toISOString() })
      .eq("id", data.releaseId);
    if (error) throw new Error(error.message);
    await logFunderAudit(db, ctx.userId, "deal_release_revoked", data.releaseId);
    return { ok: true };
  });

export const adminListFunderAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("funder_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { events: data ?? [] };
  });

/* ------------------------------------------------------------------ */
/* Execution Cases — reuses the existing spine executions/milestones    */
/* ------------------------------------------------------------------ */

export const adminListExecutionCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: executions, error } = await db
      .from("executions")
      .select("id, transaction_id, status, created_at, completed_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);

    const txnIds = (executions ?? []).map((e: any) => e.transaction_id);
    const [{ data: txns }, { data: milestones }] = await Promise.all([
      txnIds.length ? db.from("spine_transactions").select("id, trading_stage").in("id", txnIds) : { data: [] },
      (executions ?? []).length
        ? db.from("milestones").select("execution_id, status").in("execution_id", (executions ?? []).map((e: any) => e.id))
        : { data: [] },
    ]);
    const txnById = new Map((txns ?? []).map((t: any) => [t.id, t]));
    const milestoneCounts = new Map<string, { total: number; accepted: number }>();
    for (const m of milestones ?? []) {
      const c = milestoneCounts.get(m.execution_id) ?? { total: 0, accepted: 0 };
      c.total += 1;
      if (m.status === "ACCEPTED") c.accepted += 1;
      milestoneCounts.set(m.execution_id, c);
    }

    return {
      cases: (executions ?? []).map((e: any) => ({
        ...e,
        trading_stage: (txnById.get(e.transaction_id) as any)?.trading_stage ?? null,
        milestones: milestoneCounts.get(e.id) ?? { total: 0, accepted: 0 },
      })),
    };
  });

/* ------------------------------------------------------------------ */
/* Registry                                                              */
/* ------------------------------------------------------------------ */

export const adminGetRegistrySummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const [companies, claims, bankQueue, apiClients] = await Promise.all([
      db.from("organisations").select("id", { count: "exact", head: true }),
      db.from("registry_claims").select("id", { count: "exact", head: true }).eq("status", "pending"),
      db.from("bank_verifications").select("id", { count: "exact", head: true }).eq("status", "manual_review_required"),
      db.from("registry_api_clients").select("id", { count: "exact", head: true }),
    ]);
    return {
      total_companies: companies.count ?? 0,
      pending_claims: claims.count ?? 0,
      pending_bank_reviews: bankQueue.count ?? 0,
      api_clients: apiClients.count ?? 0,
    };
  });

export const adminListRegistryCompanies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("organisations")
      .select("id, name, country, reg_no, readiness, has_claim, is_public, created_at")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return {
      companies: (data ?? []).map((o: any) => ({
        id: o.id,
        company_name: o.name,
        country: o.country ?? "—",
        reg_no: o.reg_no ?? "—",
        readiness: o.readiness,
        has_claim: o.has_claim,
        is_public: o.is_public,
        created_at: o.created_at,
      })),
    };
  });

export const adminListRegistryClaims = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: claims, error } = await db.from("registry_claims").select("*").order("submitted_at", { ascending: false });
    if (error) throw new Error(error.message);
    const orgIds = Array.from(new Set((claims ?? []).map((c: any) => c.organisation_id)));
    const { data: orgs } = orgIds.length
      ? await db.from("organisations").select("id, name").in("id", orgIds)
      : { data: [] };
    const nameById = new Map((orgs ?? []).map((o: any) => [o.id, o.name]));
    return { claims: (claims ?? []).map((c: any) => ({ ...c, company_name: nameById.get(c.organisation_id) ?? "—" })) };
  });

export const adminDecideRegistryClaim = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { claimId: string; approve: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: claim, error: fetchErr } = await db
      .from("registry_claims")
      .select("organisation_id")
      .eq("id", data.claimId)
      .single();
    if (fetchErr) throw new Error(fetchErr.message);

    const { error } = await db
      .from("registry_claims")
      .update({
        status: data.approve ? "approved" : "rejected",
        decided_at: new Date().toISOString(),
        decided_by: ctx.userId,
      })
      .eq("id", data.claimId);
    if (error) throw new Error(error.message);

    if (data.approve) {
      await db.from("organisations").update({ has_claim: true }).eq("id", claim.organisation_id);
    }
    return { ok: true };
  });

export const adminListBankVerifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: rows, error } = await db.from("bank_verifications").select("*").order("requested_at", { ascending: false });
    if (error) throw new Error(error.message);
    const orgIds = Array.from(new Set((rows ?? []).map((r: any) => r.organisation_id).filter(Boolean)));
    const { data: orgs } = orgIds.length
      ? await db.from("organisations").select("id, name").in("id", orgIds)
      : { data: [] };
    const nameById = new Map((orgs ?? []).map((o: any) => [o.id, o.name]));
    return { verifications: (rows ?? []).map((r: any) => ({ ...r, company_name: nameById.get(r.organisation_id) ?? "—" })) };
  });

export const adminDecideBankVerification = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { verificationId: string; approve: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("bank_verifications")
      .update({
        status: data.approve ? "manual_verified" : "failed",
        decided_at: new Date().toISOString(),
        decided_by: ctx.userId,
      })
      .eq("id", data.verificationId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListRegistryApiClients = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("registry_api_clients").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { clients: data ?? [] };
  });

export const adminSetApiClientStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { clientId: string; status: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("registry_api_clients")
      .update({ lifecycle_status: data.status })
      .eq("id", data.clientId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListRegistryApiUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: events, error } = await db
      .from("registry_api_usage_events")
      .select("*")
      .order("occurred_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    const clientIds = Array.from(new Set((events ?? []).map((e: any) => e.client_id).filter(Boolean)));
    const { data: clients } = clientIds.length
      ? await db.from("registry_api_clients").select("id, client_name").in("id", clientIds)
      : { data: [] };
    const nameById = new Map((clients ?? []).map((c: any) => [c.id, c.client_name]));
    return { events: (events ?? []).map((e: any) => ({ ...e, client_name: nameById.get(e.client_id) ?? "—" })) };
  });

/* ------------------------------------------------------------------ */
/* Enterprise Identity — org-level SSO/SCIM shell (reuses organisations) */
/* ------------------------------------------------------------------ */

export const adminListEnterpriseIdentity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("organisations").select("id, name, created_at").order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return { organisations: data ?? [] };
  });

/* ------------------------------------------------------------------ */
/* AI Suggestions — advisory review queue                               */
/* ------------------------------------------------------------------ */

export const adminListAiTradeRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("spine_transactions")
      .select("id, trading_stage, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return { requests: data ?? [] };
  });

export const adminSourceCounterparties = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { transactionId: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;

    const { data: run, error: runErr } = await db
      .from("search_runs")
      .select("candidates")
      .eq("transaction_id", data.transactionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (runErr) throw new Error(runErr.message);
    const candidates = (run?.candidates ?? []) as any[];
    if (candidates.length === 0) throw new Error("No search candidates found for this trade request yet");

    const bidOffer = (
      await db
        .from("bid_offers")
        .select("subject_description")
        .eq("transaction_id", data.transactionId)
        .limit(1)
        .maybeSingle()
    ).data;

    const { rankCandidatesWithClaude } = await import("@/lib/ai/anthropic.server");
    const rankings = await rankCandidatesWithClaude({
      subject: bidOffer?.subject_description ?? null,
      candidates,
    });

    const rows = rankings.map((r) => ({
      transaction_id: data.transactionId,
      counterparty_name: r.name,
      confidence: r.confidence >= 0.75 ? "high" : r.confidence >= 0.5 ? "medium" : "low",
      fit: "good",
      risk: "low",
      status: "new",
      // stash the model's own words for the admin to read verbatim
    }));
    if (rows.length === 0) throw new Error("Claude returned no candidates");

    const { error: insertErr } = await db.from("ai_suggested_matches").insert(
      rows.map((r, i) => ({ ...r, counterparty_name: `${r.counterparty_name} — ${rankings[i]?.rationale ?? ""}` })),
    );
    if (insertErr) throw new Error(insertErr.message);
    return { ok: true, count: rows.length };
  });

export const adminListAiSuggestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("ai_suggested_matches")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { suggestions: data ?? [] };
  });

export const adminDecideAiSuggestion = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { suggestionId: string; status: "approved" | "rejected" | "archived" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("ai_suggested_matches")
      .update({ status: data.status, decided_at: new Date().toISOString(), decided_by: ctx.userId })
      .eq("id", data.suggestionId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListAiDncRules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("ai_dnc_rules").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rules: data ?? [] };
  });

export const adminAddAiDncRule = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { ruleType: string; value: string; reason?: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db.from("ai_dnc_rules").insert({
      rule_type: data.ruleType,
      value: data.value,
      reason: data.reason ?? null,
      created_by: ctx.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Revenue & Sales — reuses token_entries + workspaces                  */
/* ------------------------------------------------------------------ */

export const adminGetRevenueOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: entries, error } = await db
      .from("token_entries")
      .select("id, workspace_id, tokens, usd, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const workspaceIds = Array.from(new Set((entries ?? []).map((e: any) => e.workspace_id)));
    const { data: workspaces } = workspaceIds.length
      ? await db.from("workspaces").select("id, name").in("id", workspaceIds)
      : { data: [] };
    const nameById = new Map<string, string>((workspaces ?? []).map((w: any) => [w.id, w.name]));

    const totalRevenue = (entries ?? []).reduce((sum: number, e: any) => sum + Number(e.usd ?? 0), 0);
    const totalCredits = (entries ?? []).reduce((sum: number, e: any) => sum + Number(e.tokens ?? 0), 0);
    const uniqueBuyers = new Set((entries ?? []).map((e: any) => e.workspace_id)).size;

    const byOrg = new Map<string, { revenue: number; purchases: number; last: string }>();
    for (const e of entries ?? []) {
      const name: string = nameById.get(e.workspace_id) ?? "—";
      const row = byOrg.get(name) ?? { revenue: 0, purchases: 0, last: e.created_at };
      row.revenue += Number(e.usd ?? 0);
      row.purchases += 1;
      if (new Date(e.created_at) > new Date(row.last)) row.last = e.created_at;
      byOrg.set(name, row);
    }
    const topBuyers = Array.from(byOrg.entries())
      .map(([organisation, v]) => ({ organisation, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      total_revenue: totalRevenue,
      total_credits: totalCredits,
      total_purchases: (entries ?? []).length,
      unique_buyers: uniqueBuyers,
      top_buyers: topBuyers,
      timeline: (entries ?? []).slice(0, 30).map((e: any) => ({
        ...e,
        organisation: nameById.get(e.workspace_id) ?? "—",
      })),
    };
  });

/* ------------------------------------------------------------------ */
/* Legacy Repair                                                        */
/* ------------------------------------------------------------------ */

export const adminListLegacyRepairFlags = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: flags, error } = await db
      .from("legacy_repair_flags")
      .select("*")
      .eq("status", "flagged")
      .order("flagged_at", { ascending: false });
    if (error) throw new Error(error.message);

    const txnIds = (flags ?? []).map((f: any) => f.transaction_id);
    const { data: txns } = txnIds.length
      ? await db.from("spine_transactions").select("id, trading_stage").in("id", txnIds)
      : { data: [] };
    const txnById = new Map((txns ?? []).map((t: any) => [t.id, t.trading_stage]));

    return {
      flags: (flags ?? []).map((f: any) => ({ ...f, trading_stage: txnById.get(f.transaction_id) ?? "—" })),
    };
  });

export const adminResolveLegacyFlag = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { flagId: string; action: "archive" | "repair" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("legacy_repair_flags")
      .update({
        status: data.action === "archive" ? "archived" : "repaired",
        resolved_at: new Date().toISOString(),
        resolved_by: ctx.userId,
      })
      .eq("id", data.flagId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Governance Records — merged spine_transactions + audit_logs          */
/* ------------------------------------------------------------------ */

export const adminListGovernanceRecords = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("spine_transactions")
      .select("id, lifecycle, trading_stage, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { records: data ?? [] };
  });

/* ------------------------------------------------------------------ */
/* Audit & Health — reuses audit_logs                                   */
/* ------------------------------------------------------------------ */

export const adminListAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { logs: data ?? [] };
  });

/* ------------------------------------------------------------------ */
/* System Health — live DB reachability + basic counters                */
/* ------------------------------------------------------------------ */

export const adminGetSystemHealth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const start = Date.now();
    const [workspaces, transactions, executions] = await Promise.all([
      db.from("workspaces").select("id", { count: "exact", head: true }),
      db.from("spine_transactions").select("id", { count: "exact", head: true }),
      db.from("executions").select("id", { count: "exact", head: true }).neq("status", "COMPLETE"),
    ]);
    const latencyMs = Date.now() - start;
    return {
      database_reachable: !workspaces.error,
      latency_ms: latencyMs,
      total_workspaces: workspaces.count ?? 0,
      total_transactions: transactions.count ?? 0,
      executions_in_progress: executions.count ?? 0,
    };
  });

/* ------------------------------------------------------------------ */
/* Platform Settings                                                    */
/* ------------------------------------------------------------------ */

export const adminGetPlatformSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("platform_settings").select("*").eq("id", true).maybeSingle();
    if (error) throw new Error(error.message);
    return { settings: data };
  });

export const adminUpdatePlatformSettings = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { workspaceName: string; systemStatusMessage: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("platform_settings")
      .update({
        workspace_name: data.workspaceName,
        system_status_message: data.systemStatusMessage,
        updated_at: new Date().toISOString(),
        updated_by: ctx.userId,
      })
      .eq("id", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/* Organisation Management sub-tabs                                     */
/* ------------------------------------------------------------------ */

export const adminListLegalEntities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("legal_entities").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { entities: data ?? [] };
  });

export const adminScreenLegalEntity = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { entityId: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db.from("legal_entities").update({ screening_status: "clear" }).eq("id", data.entityId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminVerifyLegalEntity = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { entityId: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("legal_entities")
      .update({ ubo_verified: true, status: "verified" })
      .eq("id", data.entityId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminBindLegalEntity = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { entityId: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db.from("legal_entities").update({ authority_to_bind: true }).eq("id", data.entityId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListGoLiveVerifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("go_live_verifications")
      .select("*, legal_entities(legal_name)")
      .order("submitted_at", { ascending: false });
    if (error) throw new Error(error.message);
    return {
      verifications: (data ?? []).map((v: any) => ({ ...v, legal_name: v.legal_entities?.legal_name ?? "—" })),
    };
  });

export const adminDecideGoLiveVerification = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { verificationId: string; approve: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("go_live_verifications")
      .update({
        status: data.approve ? "approved" : "rejected",
        decided_at: new Date().toISOString(),
        decided_by: ctx.userId,
      })
      .eq("id", data.verificationId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListKycDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("kyc_documents")
      .select("*, legal_entities(legal_name)")
      .order("uploaded_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { documents: (data ?? []).map((d: any) => ({ ...d, legal_name: d.legal_entities?.legal_name ?? "—" })) };
  });

export const adminReviewKycDocument = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { documentId: string; approve: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("kyc_documents")
      .update({
        status: data.approve ? "approved" : "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: ctx.userId,
      })
      .eq("id", data.documentId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListOrgApiClients = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("org_api_clients")
      .select("*, legal_entities(legal_name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return {
      clients: (data ?? []).map((c: any) => ({ ...c, legal_name: c.legal_entities?.legal_name ?? "—" })),
    };
  });

export const adminCreateOrgApiClient = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { legalEntityId: string; country?: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("org_api_clients")
      .insert({ legal_entity_id: data.legalEntityId, country: data.country ?? null });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSetOrgApiClientAccess = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { clientId: string; field: "sandbox_enabled" | "production_enabled"; value: boolean })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const patch: Record<string, unknown> = { [data.field]: data.value };
    if (data.field === "production_enabled" && data.value) patch["status"] = "active";
    const { error } = await db.from("org_api_clients").update(patch).eq("id", data.clientId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListApiPlans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("api_plans").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { plans: data ?? [] };
  });

export const adminCreateApiPlan = createServerFn({ method: "POST" })
  .inputValidator(
    (d: unknown) =>
      d as {
        planName: string;
        currency: string;
        monthlyFee: number;
        includedAllowance: number;
        overagePrice: number;
        manualReviewFee: number;
        overageAllowed: boolean;
      },
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db.from("api_plans").insert({
      plan_name: data.planName,
      currency: data.currency,
      monthly_fee: data.monthlyFee,
      included_allowance: data.includedAllowance,
      overage_price: data.overagePrice,
      manual_review_fee: data.manualReviewFee,
      overage_allowed: data.overageAllowed,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListSandboxScenarios = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("api_sandbox_scenarios").select("*").order("scenario", { ascending: true });
    if (error) throw new Error(error.message);
    return { scenarios: data ?? [] };
  });

export const adminListApiSupportTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("api_support_tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { tickets: data ?? [] };
  });

export const adminUpdateSupportTicketStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d as { ticketId: string; status: string })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { error } = await db
      .from("api_support_tickets")
      .update({ status: data.status, owner_id: ctx.userId })
      .eq("id", data.ticketId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// API Usage / Monitoring / Security — derived views over the org's API
// clients + the platform-wide usage events already recorded by Registry.
export const adminGetOrgApiOperations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const [{ data: clients }, { data: events }] = await Promise.all([
      db.from("org_api_clients").select("*, legal_entities(legal_name)"),
      db.from("registry_api_usage_events").select("*").order("occurred_at", { ascending: false }).limit(200),
    ]);

    const usage = (events ?? []).map((e: any) => ({
      client_id: e.client_id,
      endpoint: e.endpoint,
      status_code: e.status_code,
      blocked: e.blocked,
      rate_limited: e.rate_limited,
      occurred_at: e.occurred_at,
    }));

    const failedAuth = usage.filter((e: any) => e.status_code === 401).length;
    const rateLimited = usage.filter((e: any) => e.rate_limited).length;
    const blocked = usage.filter((e: any) => e.blocked).length;

    return {
      clients: (clients ?? []).map((c: any) => ({ ...c, legal_name: c.legal_entities?.legal_name ?? "—" })),
      usage,
      security: {
        clients_with_signals: new Set(usage.filter((e: any) => e.blocked || e.rate_limited).map((e: any) => e.client_id)).size,
        failed_auth_attempts: failedAuth,
        rate_limit_events: rateLimited,
        blocked_events: blocked,
      },
    };
  });

/* ------------------------------------------------------------------ */
/* Audit & Health sub-tabs                                              */
/* ------------------------------------------------------------------ */

export const adminListRatingAppeals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.from("rating_appeals").select("*").order("submitted_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { appeals: data ?? [] };
  });

export const adminListNotificationPreferences = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data: prefs, error } = await db
      .from("notification_preferences")
      .select("*, workspaces(name, email)")
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return {
      preferences: (prefs ?? []).map((p: any) => ({
        ...p,
        workspace_name: p.workspaces?.name ?? "—",
        workspace_email: p.workspaces?.email ?? "—",
      })),
    };
  });

export const adminListOutreachBlocks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("audit_logs")
      .select("*")
      .ilike("event", "%outreach%block%")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { blocks: data ?? [] };
  });

export const adminListUploadAudit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("audit_logs")
      .select("*")
      .ilike("event", "%document.upload%")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { attempts: data ?? [] };
  });

export const adminGetRevenueNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("token_entries")
      .select("id, tokens, usd, created_at")
      .gt("usd", 0)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return {
      notifications: (data ?? []).map((e: any) => ({
        id: e.id,
        event_type: "credit_purchase",
        status: "sent",
        amount_usd: e.usd,
        created_at: e.created_at,
      })),
    };
  });

export const adminRunTenantBoundaryProbe = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db.rpc("admin_tenant_boundary_probe");
    if (error) throw new Error(error.message);
    const result = data?.[0] ?? { tables_checked: 0, tables_pass: 0, tables_fail: 0 };
    const { error: insertErr } = await db.from("tenant_boundary_runs").insert({
      tables_checked: result.tables_checked,
      tables_pass: result.tables_pass,
      tables_fail: result.tables_fail,
      run_by: ctx.userId,
    });
    if (insertErr) throw new Error(insertErr.message);
    return { ok: true, ...result };
  });

export const adminListTenantBoundaryRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("tenant_boundary_runs")
      .select("*")
      .order("run_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return { runs: data ?? [] };
  });

export const adminListEventStore = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const { data, error } = await db
      .from("memory_events")
      .select("id, event_type, transaction_id, event_hash, occurred_at")
      .order("occurred_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { events: data ?? [] };
  });

export const adminGetSystemAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await requireAdmin(ctx);
    const db = ctx.supabase as any;
    const [workspaces, organisations, apiKeys, transactions, webhooks] = await Promise.all([
      db.from("workspaces").select("id", { count: "exact", head: true }),
      db.from("organisations").select("id", { count: "exact", head: true }),
      db.from("spine_api_keys").select("id", { count: "exact", head: true }).is("revoked_at", null),
      db.from("spine_transactions").select("id", { count: "exact", head: true }),
      db.from("webhook_events").select("id", { count: "exact", head: true }),
    ]);
    return {
      users: workspaces.count ?? 0,
      organisations: organisations.count ?? 0,
      api_keys: apiKeys.count ?? 0,
      matches: transactions.count ?? 0,
      webhooks: webhooks.count ?? 0,
    };
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
