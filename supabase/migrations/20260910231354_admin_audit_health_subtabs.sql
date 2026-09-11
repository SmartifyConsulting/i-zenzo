-- Audit & Health sub-tabs: Rating Appeals, Notification Preferences,
-- Tenant Boundary probe. (Audit Logs, Outreach Blocks, Upload Audit,
-- Revenue Notifications and System Analytics are derived views over
-- existing audit_logs/token_entries/workspaces/organisations data;
-- Event Store reuses memory_events with a new admin read policy.)

CREATE TABLE public.rating_appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE UNIQUE,
  channels_disabled boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'receiving',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tenant_boundary_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at timestamptz NOT NULL DEFAULT now(),
  tables_checked int NOT NULL,
  tables_pass int NOT NULL,
  tables_fail int NOT NULL,
  status text NOT NULL DEFAULT 'complete',
  manifest_sha256 text,
  run_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['rating_appeals','notification_preferences','tenant_boundary_runs'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "admin read all" ON public.%I FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "admin write all" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "admin update all" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
  END LOOP;
END $$;

-- Event Store: admins can read the hash-chained memory_events across every
-- workspace (previously owner-scoped only).
CREATE POLICY "admin read all" ON public.memory_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- System Analytics needs a cross-workspace count of active API keys.
CREATE POLICY "admin read all" ON public.spine_api_keys FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed one notification-preference row per existing workspace.
INSERT INTO public.notification_preferences (workspace_id)
SELECT id FROM public.workspaces
WHERE NOT EXISTS (SELECT 1 FROM public.notification_preferences np WHERE np.workspace_id = workspaces.id);

-- A real, live tenant-boundary probe: count how many public-schema tables
-- have RLS enabled, and how many have at least one policy that actually
-- references auth.uid() or has_role() (not a bare USING (true)).
CREATE OR REPLACE FUNCTION public.admin_tenant_boundary_probe()
RETURNS TABLE (tables_checked int, tables_pass int, tables_fail int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total int;
  passing int;
BEGIN
  SELECT count(*) INTO total
  FROM pg_tables
  WHERE schemaname = 'public';

  SELECT count(*) INTO passing
  FROM pg_tables t
  WHERE t.schemaname = 'public'
    AND t.rowsecurity = true
    AND EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = 'public' AND p.tablename = t.tablename
        AND (p.qual ILIKE '%auth.uid()%' OR p.qual ILIKE '%has_role(%')
    );

  RETURN QUERY SELECT total, passing, total - passing;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_tenant_boundary_probe() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_tenant_boundary_probe() TO authenticated;
