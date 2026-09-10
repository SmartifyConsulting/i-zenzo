-- Funder Workspace: onboarding, approved funder orgs, deal releases, audit log.
CREATE TABLE public.funder_organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_email text NOT NULL,
  status text NOT NULL DEFAULT 'approved',
  approved_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.funder_onboarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text NOT NULL,
  contact_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.deal_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funder_org_id uuid NOT NULL REFERENCES public.funder_organisations(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES public.spine_transactions(id) ON DELETE SET NULL,
  pack_label text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  released_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  revoked_at timestamptz
);

CREATE TABLE public.funder_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL DEFAULT auth.uid(),
  event text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'funder_organisations','funder_onboarding_requests','deal_releases','funder_audit_log'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "admin read all" ON public.%I FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "admin write all" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "admin update all" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "admin delete all" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
  END LOOP;
END $$;

-- Seed data so the workspace isn't empty.
INSERT INTO public.funder_organisations (name, contact_email)
SELECT 'Mercuria Energy Trading SA', 'funding@mercuria.example.com'
WHERE NOT EXISTS (SELECT 1 FROM public.funder_organisations);
INSERT INTO public.funder_organisations (name, contact_email)
SELECT 'Glencore Singapore Pte Ltd', 'funding@glencore.example.com'
WHERE (SELECT count(*) FROM public.funder_organisations) < 2;

INSERT INTO public.funder_onboarding_requests (org_name, contact_email, status)
SELECT 'Koch Metals Trading', 'onboarding@kochmetals.example.com', 'pending'
WHERE NOT EXISTS (SELECT 1 FROM public.funder_onboarding_requests);

INSERT INTO public.deal_releases (funder_org_id, transaction_id, pack_label, status, expires_at)
SELECT f.id, t.id, 'Evidence pack — ' || t.trading_stage, 'active', now() + interval '30 days'
FROM public.funder_organisations f
CROSS JOIN LATERAL (SELECT id, trading_stage FROM public.spine_transactions LIMIT 2) t
WHERE NOT EXISTS (SELECT 1 FROM public.deal_releases)
LIMIT 2;
