-- Admin notes logged against a POI hold-point while an admin is chasing
-- counterparty outreach/activation. One append-only log per POI.
CREATE TABLE public.engagement_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poi_id uuid NOT NULL REFERENCES public.pois(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid(),
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.engagement_notes TO authenticated;
GRANT ALL ON public.engagement_notes TO service_role;
ALTER TABLE public.engagement_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read all" ON public.engagement_notes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin write all" ON public.engagement_notes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
