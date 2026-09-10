-- Let admins read search_runs across every workspace so the AI Suggestions
-- console can source real candidates for a transaction (the "Source
-- counterparties" action), not just its own seeded demo table.
CREATE POLICY "admin read all" ON public.search_runs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
