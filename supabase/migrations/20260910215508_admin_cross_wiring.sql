-- Cross-wire the admin console's previously-isolated tables into one
-- connected data model:
--   1. Merge registry_companies into organisations (one idea of "a company").
--   2. Link facilitation_cases / compliance_cases / governance_cases to a
--      real spine_transactions row instead of free text.
--   3. Auto-create a facilitation case whenever a new match enters the spine.

/* ------------------------------------------------------------------ */
/* 1. Merge registry_companies into organisations                       */
/* ------------------------------------------------------------------ */

ALTER TABLE public.organisations
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS reg_no text,
  ADD COLUMN IF NOT EXISTS readiness text NOT NULL DEFAULT 'imported_unverified',
  ADD COLUMN IF NOT EXISTS has_claim boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

INSERT INTO public.organisations (name, country, reg_no, readiness, has_claim, is_public, created_at)
SELECT rc.company_name, rc.country, rc.reg_no, rc.readiness, rc.has_claim, rc.is_public, rc.created_at
FROM public.registry_companies rc
WHERE NOT EXISTS (SELECT 1 FROM public.organisations o WHERE o.name = rc.company_name);

ALTER TABLE public.registry_claims ADD COLUMN IF NOT EXISTS organisation_id uuid REFERENCES public.organisations(id) ON DELETE CASCADE;
UPDATE public.registry_claims rcl
SET organisation_id = o.id
FROM public.registry_companies rc
JOIN public.organisations o ON o.name = rc.company_name
WHERE rcl.company_id = rc.id AND rcl.organisation_id IS NULL;
ALTER TABLE public.registry_claims ALTER COLUMN organisation_id SET NOT NULL;
ALTER TABLE public.registry_claims DROP COLUMN company_id;

ALTER TABLE public.bank_verifications ADD COLUMN IF NOT EXISTS organisation_id uuid REFERENCES public.organisations(id) ON DELETE SET NULL;
UPDATE public.bank_verifications bv
SET organisation_id = o.id
FROM public.registry_companies rc
JOIN public.organisations o ON o.name = rc.company_name
WHERE bv.company_id = rc.id AND bv.organisation_id IS NULL;
ALTER TABLE public.bank_verifications DROP COLUMN company_id;

DROP TABLE public.registry_companies;

/* ------------------------------------------------------------------ */
/* 2. Link case queues to real spine_transactions                       */
/* ------------------------------------------------------------------ */

ALTER TABLE public.facilitation_cases ADD COLUMN IF NOT EXISTS transaction_id uuid REFERENCES public.spine_transactions(id) ON DELETE SET NULL;
ALTER TABLE public.compliance_cases ADD COLUMN IF NOT EXISTS transaction_id uuid REFERENCES public.spine_transactions(id) ON DELETE SET NULL;
ALTER TABLE public.governance_cases ADD COLUMN IF NOT EXISTS transaction_id uuid REFERENCES public.spine_transactions(id) ON DELETE SET NULL;

-- Best-effort backfill: pair each existing (unlinked) demo case with a real
-- transaction by insertion order, so the demo data reflects real linkage too.
WITH ranked_cases AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn
  FROM public.facilitation_cases WHERE transaction_id IS NULL
),
ranked_txns AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn FROM public.spine_transactions
)
UPDATE public.facilitation_cases fc
SET transaction_id = rt.id
FROM ranked_cases rc JOIN ranked_txns rt ON rc.rn = rt.rn
WHERE fc.id = rc.id;

WITH ranked_cases AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn
  FROM public.compliance_cases WHERE transaction_id IS NULL
),
ranked_txns AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn FROM public.spine_transactions
)
UPDATE public.compliance_cases cc
SET transaction_id = rt.id
FROM ranked_cases rc JOIN ranked_txns rt ON rc.rn = rt.rn
WHERE cc.id = rc.id;

WITH ranked_cases AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn
  FROM public.governance_cases WHERE transaction_id IS NULL
),
ranked_txns AS (
  SELECT id, row_number() OVER (ORDER BY created_at) AS rn FROM public.spine_transactions
)
UPDATE public.governance_cases gc
SET transaction_id = rt.id
FROM ranked_cases rc JOIN ranked_txns rt ON rc.rn = rt.rn
WHERE gc.id = rc.id;

/* ------------------------------------------------------------------ */
/* 3. Auto-create a facilitation case for every new match               */
/* ------------------------------------------------------------------ */

CREATE SEQUENCE IF NOT EXISTS public.facilitation_case_seq START 100;

CREATE OR REPLACE FUNCTION public.create_facilitation_case_for_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req_org text;
BEGIN
  SELECT w.name INTO req_org FROM public.workspaces w WHERE w.id = NEW.workspace_id;
  INSERT INTO public.facilitation_cases (case_number, status, requester_org, transaction_id, created_at)
  VALUES (
    'FAC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.facilitation_case_seq')::text, 6, '0'),
    'new_unassigned',
    coalesce(req_org, 'Unknown'),
    NEW.id,
    NEW.created_at
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER spine_transactions_create_facilitation_case
  AFTER INSERT ON public.spine_transactions
  FOR EACH ROW EXECUTE FUNCTION public.create_facilitation_case_for_transaction();
