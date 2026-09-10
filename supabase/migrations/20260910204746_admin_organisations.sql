-- Organisations: one row per registered organisation. Every workspace
-- created so far is backfilled as its own organisation (1:1 for now,
-- same as the workspace it came from), with a link table so a future
-- organisation can hold more than one workspace/user.
CREATE TABLE public.organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sandbox_enabled boolean NOT NULL DEFAULT true,
  clip_on_plan text NOT NULL DEFAULT 'per_request',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.organisation_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organisation_id, workspace_id)
);

GRANT SELECT ON public.organisations TO authenticated;
GRANT ALL ON public.organisations TO service_role;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read all" ON public.organisations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin write all" ON public.organisations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update all" ON public.organisations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.organisation_members TO authenticated;
GRANT ALL ON public.organisation_members TO service_role;
ALTER TABLE public.organisation_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read all" ON public.organisation_members FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin write all" ON public.organisation_members FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Backfill: one organisation per existing workspace.
INSERT INTO public.organisations (id, name, created_at)
SELECT gen_random_uuid(), w.name, w.created_at FROM public.workspaces w;

INSERT INTO public.organisation_members (organisation_id, workspace_id)
SELECT o.id, w.id
FROM public.workspaces w
JOIN public.organisations o ON o.name = w.name AND o.created_at = w.created_at;

-- Every future workspace automatically gets its own organisation too.
CREATE OR REPLACE FUNCTION public.create_organisation_for_workspace()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE org_id uuid;
BEGIN
  INSERT INTO public.organisations (name) VALUES (NEW.name) RETURNING id INTO org_id;
  INSERT INTO public.organisation_members (organisation_id, workspace_id) VALUES (org_id, NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER workspaces_create_organisation
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.create_organisation_for_workspace();
