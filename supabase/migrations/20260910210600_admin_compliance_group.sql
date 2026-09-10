-- Compliance group: Compliance Workbench, IDV Review, Governance Cases,
-- Disputes, Legal Holds.

CREATE TABLE public.compliance_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'unassigned',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subject text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE public.idv_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'idv_person',
  subject_label text NOT NULL,
  status text NOT NULL DEFAULT 'manual_review_required',
  updated_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.governance_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'open',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.spine_transactions(id) ON DELETE SET NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  resolution_notes text,
  raised_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE public.legal_holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type text NOT NULL DEFAULT 'user',
  scope_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  applied_by uuid NOT NULL DEFAULT auth.uid(),
  applied_at timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz,
  released_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'compliance_cases','idv_reviews','governance_cases','disputes','legal_holds'
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

-- Seed data so each queue has something real to show.
INSERT INTO public.compliance_cases (case_number, category, status, subject) VALUES
  ('CMP-2026-0001', 'kyb', 'unassigned', 'Enhanced due diligence — Glencore Singapore Pte Ltd'),
  ('CMP-2026-0002', 'sanctions', 'pending_approval', 'Sanctions screening hit review — Nyrstar Sales & Marketing')
ON CONFLICT (case_number) DO NOTHING;

INSERT INTO public.idv_reviews (category, subject_label, status)
SELECT 'idv_person', 'trade@izenzo.co.za (ZA)', 'manual_review_required'
WHERE NOT EXISTS (SELECT 1 FROM public.idv_reviews);

INSERT INTO public.governance_cases (case_number, category, status, summary) VALUES
  ('GOV-2026-0001', 'p5_readiness', 'ready_to_proceed', 'Provider credential rotation — pending confirmation')
ON CONFLICT (case_number) DO NOTHING;

INSERT INTO public.disputes (transaction_id, reason, status, raised_at)
SELECT id, 'Counterparty failed to provide shipping documents within agreed timeframe', 'resolved', created_at
FROM public.spine_transactions
WHERE NOT EXISTS (SELECT 1 FROM public.disputes)
LIMIT 3;

INSERT INTO public.disputes (reason, status)
SELECT 'Counterparty disputes being named', 'open'
WHERE NOT EXISTS (SELECT 1 FROM public.disputes WHERE reason = 'Counterparty disputes being named');
