-- Grant the admin role to georgia.adams@smartify.co.za (idempotent).
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'georgia.adams@smartify.co.za'
ON CONFLICT (user_id, role) DO NOTHING;

-- Admin cross-workspace read access for the HQ Overview / Canonical Spine view.
-- Regular users can only ever see rows for their own workspace (existing "own
-- workspace" style policies); admins additionally get a SELECT-only policy on
-- every table the Canonical Spine view reads from.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'workspaces','spine_transactions','bid_offers','counterparty_sets',
    'pois','wads','executions','finality_records'
  ] LOOP
    EXECUTE format(
      'CREATE POLICY "admin read all" ON public.%I FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''))',
      t
    );
  END LOOP;
END $$;
