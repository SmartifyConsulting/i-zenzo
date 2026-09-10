-- Facilitation: Phase 1 case queue + Phase 2 outreach (templates, DNC rules).
CREATE TABLE public.facilitation_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'new_unassigned',
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  requester_org text NOT NULL,
  requester_user text,
  counterparty text,
  country text,
  sector text,
  value numeric,
  currency text NOT NULL DEFAULT 'USD',
  due_date date,
  final_outcome text,
  created_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

CREATE TABLE public.facilitation_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  version int NOT NULL DEFAULT 1,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz
);

CREATE TABLE public.facilitation_dnc_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type text NOT NULL DEFAULT 'email',
  value text NOT NULL,
  reason text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['facilitation_cases','facilitation_email_templates','facilitation_dnc_rules'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "admin read all" ON public.%I FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "admin write all" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "admin update all" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "admin delete all" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
  END LOOP;
END $$;

-- Seed the same 7 outreach templates the live console ships with, as drafts.
INSERT INTO public.facilitation_email_templates (key, name, subject, body, status) VALUES
  ('facilitation-case-assigned', 'Case assigned — owner update v1',
   'Your request {{case_number}} has been assigned',
   E'Hello {{requester_name}},\n\nYour request {{case_number}} regarding {{counterparty_name}} has been assigned and is now in progress. Current status: {{status_label}}.\n\nThank you,\nIzenzo', 'draft'),
  ('facilitation-case-created', 'Case created — acknowledgement v1',
   'We have received your request {{case_number}}',
   E'Hello {{requester_name}},\n\nWe have received your request {{case_number}} regarding {{counterparty_name}}. A facilitator will be in touch shortly.\n\nThank you,\nIzenzo', 'draft'),
  ('facilitation-more-info-requested', 'More information needed v1',
   'Action needed on request {{case_number}}',
   E'Hello {{requester_name}},\n\nWe need a little more information to continue with your request {{case_number}} regarding {{counterparty_name}}. Please reply by {{due_date}}.\n\nThank you,\nIzenzo', 'draft'),
  ('facilitation-case-ready-for-poi', 'Ready for the next step v1',
   'Your request {{case_number}} is ready for the next step',
   E'Hello {{requester_name}},\n\nYour request {{case_number}} regarding {{counterparty_name}} is ready for the next step. Please log in to review and continue.\n\nIzenzo', 'draft'),
  ('facilitation-invite-unopened-flagged', 'Reminder — counterparty invitation pending v1',
   'A reminder on your request {{case_number}}',
   E'Hello {{requester_name}},\n\nThe counterparty for your request {{case_number}} has not yet responded to our invitation. We will continue to follow up.\n\nIzenzo', 'draft'),
  ('facilitation-case-closed', 'Request closed v1',
   'Your request {{case_number}} has been closed',
   E'Hello {{requester_name}},\n\nYour request {{case_number}} regarding {{counterparty_name}} has been closed. Final status: {{status_label}}.\n\nThank you for using Izenzo.', 'draft'),
  ('facilitation-compliance-review-required', 'Under review — no action needed v1',
   'Your request {{case_number}} is under review',
   E'Hello {{requester_name}},\n\nYour request {{case_number}} regarding {{counterparty_name}} is currently under review. We will let you know as soon as the next step is ready. Current status: {{status_label}}.\n\nIzenzo', 'draft')
ON CONFLICT (key) DO NOTHING;

-- Seed a handful of demo cases so the queue isn't empty.
INSERT INTO public.facilitation_cases (case_number, status, requester_org, requester_user, counterparty, country, value, due_date, created_at) VALUES
  ('FAC-2026-000001', 'new_unassigned', 'New Organisation', 'facilitation-org-a@test.izenzo.co.za', 'UAT Counterparty Ltd', 'GB', 1000, NULL, now() - interval '89 days'),
  ('FAC-2026-000002', 'new_unassigned', 'New Organisation', 'facilitation-org-a@test.izenzo.co.za', 'UAT Counterparty Ltd', 'GB', 1000, NULL, now() - interval '89 days'),
  ('FAC-2026-000003', 'ready_for_poi', 'New Organisation', 'facilitation-org-a@test.izenzo.co.za', 'UAT Counterparty Ltd', 'GB', 1000, now() - interval '74 days', now() - interval '89 days')
ON CONFLICT (case_number) DO NOTHING;
