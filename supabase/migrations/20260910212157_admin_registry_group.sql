-- Registry group: company records, claims, bank verification, API clients/usage.

CREATE TABLE public.registry_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  country text NOT NULL,
  reg_no text NOT NULL,
  readiness text NOT NULL DEFAULT 'imported_unverified',
  has_claim boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.registry_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.registry_companies(id) ON DELETE CASCADE,
  claimant_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.bank_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.registry_companies(id) ON DELETE SET NULL,
  account_last4 text NOT NULL,
  status text NOT NULL DEFAULT 'manual_review_required',
  mode text NOT NULL DEFAULT 'manual_review_only',
  country text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.registry_api_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  lifecycle_status text NOT NULL DEFAULT 'pending_approval',
  mode text NOT NULL DEFAULT 'sandbox',
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.registry_api_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.registry_api_clients(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  status_code int NOT NULL DEFAULT 200,
  blocked boolean NOT NULL DEFAULT false,
  rate_limited boolean NOT NULL DEFAULT false,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'registry_companies','registry_claims','bank_verifications',
    'registry_api_clients','registry_api_usage_events'
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

-- Seed data matching the live console's sample records.
INSERT INTO public.registry_companies (company_name, country, reg_no, readiness, has_claim, is_public)
SELECT * FROM (VALUES
  ('Dangote Fertiliser Limited', 'NG', 'RC-702207', 'imported_unverified', true, true),
  ('Starfair 162', 'ZA', 'B2005147126', 'imported_unverified', true, true),
  ('Harith Holdings', 'ZA', 'K2013065738', 'imported_unverified', true, true),
  ('Laurium Capital', 'ZA', 'M2007026029', 'imported_unverified', true, true),
  ('Karoo Solar (Pty) Ltd', 'ZA', '2018/445221/07', 'imported_unverified', true, true)
) AS v(company_name, country, reg_no, readiness, has_claim, is_public)
WHERE NOT EXISTS (SELECT 1 FROM public.registry_companies);

INSERT INTO public.registry_claims (company_id, claimant_email, status)
SELECT id, 'ops@' || lower(replace(company_name, ' ', '')) || '.example.com', 'pending'
FROM public.registry_companies
WHERE NOT EXISTS (SELECT 1 FROM public.registry_claims)
LIMIT 1;

INSERT INTO public.bank_verifications (company_id, account_last4, status, mode, country)
SELECT id, '4821', 'manual_review_required', 'manual_review_only', country
FROM public.registry_companies
WHERE NOT EXISTS (SELECT 1 FROM public.bank_verifications)
LIMIT 1;

INSERT INTO public.registry_api_clients (client_name, lifecycle_status, mode, country)
SELECT 'Izenzo Sandbox Console', 'sandbox_active', 'sandbox', 'ZA'
WHERE NOT EXISTS (SELECT 1 FROM public.registry_api_clients);

INSERT INTO public.registry_api_usage_events (client_id, endpoint, status_code, blocked, rate_limited)
SELECT id, '/v1/matches', 200, false, false FROM public.registry_api_clients
WHERE NOT EXISTS (SELECT 1 FROM public.registry_api_usage_events)
LIMIT 1;
