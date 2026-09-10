-- Organisation Management sub-tabs: Legal Entities, Go-Live Verification,
-- KYB Documents, API Clients (onboarding), API Plans, Sandbox Scenarios,
-- API Support. (API Usage/Monitoring/Security are derived views over
-- registry_api_usage_events + org_api_clients, no new tables needed.)

CREATE TABLE public.legal_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name text NOT NULL,
  entity_type text NOT NULL DEFAULT 'individual',
  jurisdiction text,
  reg_no text,
  status text NOT NULL DEFAULT 'pending',
  screening_status text NOT NULL DEFAULT 'not_started',
  ubo_verified boolean NOT NULL DEFAULT false,
  authority_to_bind boolean NOT NULL DEFAULT false,
  organisation_id uuid REFERENCES public.organisations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.go_live_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_entity_id uuid REFERENCES public.legal_entities(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_entity_id uuid REFERENCES public.legal_entities(id) ON DELETE CASCADE,
  doc_type text NOT NULL DEFAULT 'other',
  status text NOT NULL DEFAULT 'pending_review',
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.org_api_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_entity_id uuid REFERENCES public.legal_entities(id) ON DELETE SET NULL,
  country text,
  status text NOT NULL DEFAULT 'pending_approval',
  sandbox_enabled boolean NOT NULL DEFAULT false,
  production_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.api_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  monthly_fee numeric NOT NULL DEFAULT 0,
  included_allowance int NOT NULL DEFAULT 0,
  overage_price numeric NOT NULL DEFAULT 0,
  manual_review_fee numeric NOT NULL DEFAULT 0,
  overage_allowed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.api_sandbox_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario text NOT NULL UNIQUE,
  legal_name text,
  country text,
  match_status text,
  confidence text,
  verification text,
  scope text NOT NULL DEFAULT 'sandbox_only',
  next_action text,
  freshness date,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE public.api_support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  client_ref text,
  environment text NOT NULL DEFAULT 'sandbox',
  severity text NOT NULL DEFAULT 'normal',
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'open',
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'legal_entities','go_live_verifications','kyc_documents','org_api_clients',
    'api_plans','api_sandbox_scenarios','api_support_tickets'
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

-- Seed legal entities from the organisations already on the platform.
INSERT INTO public.legal_entities (legal_name, entity_type, jurisdiction, reg_no, status, organisation_id, created_at)
SELECT o.name, 'company', o.country, o.reg_no, 'pending', o.id, o.created_at
FROM public.organisations o
WHERE NOT EXISTS (SELECT 1 FROM public.legal_entities WHERE organisation_id = o.id);

-- Seed the sandbox scenario catalogue (deterministic test data — this is the
-- documented, non-sensitive fixture list the live console itself ships).
INSERT INTO public.api_sandbox_scenarios (scenario, legal_name, country, match_status, confidence, verification, next_action, freshness) VALUES
  ('verified_match', 'Acme Test Trading Ltd', 'GB', 'match', 'high', 'verified', 'Proceed with engagement workflow.', '2026-06-01'),
  ('unverified_match', 'Beta Sandbox Holdings', 'GB', 'match', 'medium', 'unverified', 'Collect additional identifiers before relying on this record.', '2026-05-15'),
  ('multiple_possible_matches', 'Delta Test Group', 'GB', 'multiple_matches', 'low', 'unverified', 'Disambiguate using registration number or country.', '2026-04-20'),
  ('no_match', NULL, NULL, 'no_match', 'none', 'not_applicable', 'Provide additional identifiers or escalate to manual review.', NULL),
  ('stale_record', 'Foxtrot Outdated Test Ltd', 'GB', 'match', 'low', 'stale', 'Treat as stale — refresh or escalate.', '2023-01-10'),
  ('blocked_record', 'Echo Restricted Test Co', 'GB', 'blocked', 'none', 'blocked', 'No further detail available — contact compliance.', '2026-06-01'),
  ('sandbox_only_record', 'Hotel Sandbox Only Test Ltd', 'GB', 'match', 'high', 'verified', 'Available only with sandbox keys.', '2026-06-01'),
  ('unsupported_country', 'Golf Offworld Test SA', 'ZZ', 'no_match', 'none', 'not_applicable', 'Use a supported country code.', NULL),
  ('za_verified_match', 'TEST Verified Energy (Pty) Ltd', 'ZA', 'match', 'high', 'verified', 'Proceed with engagement workflow.', '2026-06-01'),
  ('za_unverified_match', 'TEST Unverified Trading Ltd', 'ZA', 'match', 'medium', 'unverified', 'Collect additional identifiers before relying on this record.', '2026-05-15'),
  ('za_multiple_possible_matches', 'TEST Duplicate Supplies Ltd', 'ZA', 'multiple_matches', 'low', 'unverified', 'Disambiguate using registration number or country.', '2026-04-20'),
  ('za_no_match', 'TEST No Match Holdings', 'ZA', 'no_match', 'none', 'not_applicable', 'Submit additional identifiers or request manual review.', NULL),
  ('za_stale_record', 'TEST Stale Agrivoltaics Ltd', 'ZA', 'stale_record', 'low', 'stale', 'Refresh or escalate to manual review.', '2023-01-10'),
  ('za_blocked_record', 'TEST Blocked Entity Ltd', 'ZA', 'blocked_record', 'none', 'blocked', 'Manual review required.', '2026-06-01'),
  ('invalid_api_key', NULL, NULL, NULL, NULL, NULL, 'Use a valid sandbox API key.', NULL),
  ('expired_api_key', NULL, NULL, NULL, NULL, NULL, 'Rotate the sandbox API key.', NULL),
  ('insufficient_scope', NULL, NULL, NULL, NULL, NULL, 'Request the required scope during onboarding.', NULL),
  ('rate_limit_exceeded', NULL, NULL, NULL, NULL, NULL, 'Back off and retry after the rate-limit window.', NULL),
  ('provider_unavailable', NULL, NULL, NULL, NULL, NULL, 'Retry later — upstream provider is unavailable in this scenario.', NULL),
  ('internal_error', NULL, NULL, NULL, NULL, NULL, 'Retry later — sandbox internal_error scenario.', NULL),
  ('missing_required_field', NULL, NULL, NULL, NULL, NULL, 'Caller must include all required fields.', NULL),
  ('production_access_required', NULL, NULL, NULL, NULL, NULL, 'Upgrade to production access to retrieve real records.', NULL)
ON CONFLICT (scenario) DO NOTHING;
