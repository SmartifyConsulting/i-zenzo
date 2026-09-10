-- Remaining top-nav sections: AI Suggestions, Legacy Repair, Platform Settings.
-- Enterprise Identity, Revenue & Sales, Governance Records and Audit & Health
-- read existing tables (organisations, token_entries, audit_logs, spine_transactions)
-- and need no new schema.

CREATE TABLE public.ai_suggested_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  counterparty_name text NOT NULL,
  role text NOT NULL DEFAULT 'counterparty',
  confidence text NOT NULL DEFAULT 'medium',
  fit text NOT NULL DEFAULT 'good',
  risk text NOT NULL DEFAULT 'low',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.ai_dnc_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type text NOT NULL DEFAULT 'organisation',
  value text NOT NULL,
  reason text,
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.legacy_repair_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'flagged',
  flagged_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE public.platform_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  workspace_name text NOT NULL DEFAULT 'Platform HQ',
  system_status_message text NOT NULL DEFAULT 'OPERATIONAL',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'ai_suggested_matches','ai_dnc_rules','legacy_repair_flags','platform_settings'
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

INSERT INTO public.platform_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

-- Seed one legacy-flagged match and one AI suggestion so the queues aren't empty.
INSERT INTO public.legacy_repair_flags (transaction_id, reason)
SELECT id, 'Operator marker: legacy repair required'
FROM public.spine_transactions
WHERE NOT EXISTS (SELECT 1 FROM public.legacy_repair_flags)
LIMIT 1;

INSERT INTO public.ai_suggested_matches (transaction_id, counterparty_name, role, confidence, fit, risk)
SELECT id, 'Suggested Trading Partner Ltd', 'counterparty', 'medium', 'good', 'low'
FROM public.spine_transactions
WHERE NOT EXISTS (SELECT 1 FROM public.ai_suggested_matches)
LIMIT 1;
