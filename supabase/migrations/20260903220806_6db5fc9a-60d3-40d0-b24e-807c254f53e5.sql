-- Workspaces: one per authenticated user
CREATE TABLE public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT ALL ON public.workspaces TO service_role;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own workspace" ON public.workspaces FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.spine_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  lifecycle text NOT NULL DEFAULT 'OPEN',
  trading_stage text NOT NULL DEFAULT 'BID_OFFER',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bid_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  actor_person text,
  represented_org text,
  role text,
  contact text,
  subject_type text,
  subject_description text,
  commercial jsonb NOT NULL DEFAULT '{}'::jsonb,
  version integer NOT NULL DEFAULT 1,
  parent_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.other_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  semantic_type text NOT NULL,
  issuer text,
  subject text,
  extracted_facts jsonb NOT NULL DEFAULT '{}'::jsonb,
  content_hash text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.social_news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  source_url text,
  publisher text,
  subject_match text,
  excerpt text,
  observed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.search_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  queries jsonb NOT NULL DEFAULT '[]'::jsonb,
  candidates jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  search_run_id uuid NOT NULL REFERENCES public.search_runs(id) ON DELETE CASCADE,
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.decision_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  ai_analysis_id uuid NOT NULL REFERENCES public.ai_analyses(id) ON DELETE CASCADE,
  choice_set jsonb,
  status text NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.counterparty_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  decision_session_id uuid NOT NULL REFERENCES public.decision_sessions(id) ON DELETE CASCADE,
  entities jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  counterparty_set_id uuid NOT NULL REFERENCES public.counterparty_sets(id) ON DELETE CASCADE,
  selected_entity jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  choice_id uuid NOT NULL REFERENCES public.choices(id) ON DELETE CASCADE,
  frozen_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.token_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  transaction_id uuid REFERENCES public.spine_transactions(id) ON DELETE SET NULL,
  gate_type text NOT NULL,
  tokens integer NOT NULL,
  usd numeric NOT NULL,
  idempotency_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.payment_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  tokens integer NOT NULL,
  usd numeric NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);

CREATE TABLE public.pois (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL UNIQUE REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  intent_id uuid NOT NULL REFERENCES public.intents(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'DRAFT',
  token_entry_id uuid REFERENCES public.token_entries(id) ON DELETE SET NULL,
  canonical_hash text,
  sealed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.wads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL UNIQUE REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  poi_id uuid NOT NULL REFERENCES public.pois(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'PENDING',
  token_entry_id uuid REFERENCES public.token_entries(id) ON DELETE SET NULL,
  predicates jsonb,
  decision text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.memory_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  seq bigserial,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  prev_hash text,
  event_hash text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL UNIQUE REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  wad_id uuid NOT NULL REFERENCES public.wads(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'ENTRY_REVIEW',
  baseline jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id uuid NOT NULL REFERENCES public.executions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'AVAILABLE',
  evidence_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);

CREATE TABLE public.finality_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.spine_transactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  execution_id uuid NOT NULL REFERENCES public.executions(id) ON DELETE CASCADE,
  finality_type text NOT NULL DEFAULT 'OTHER',
  status text NOT NULL DEFAULT 'DRAFT',
  canonical_hash text,
  certificate jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  issued_at timestamptz
);

CREATE TABLE public.spine_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  key text NOT NULL UNIQUE,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  event text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Grants + RLS for every spine table
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'spine_transactions','bid_offers','other_documents','social_news_items','search_runs',
    'ai_analyses','decision_sessions','counterparty_sets','choices','intents',
    'token_entries','payment_sessions','pois','wads','memory_events','executions',
    'milestones','finality_records','spine_api_keys','audit_logs'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

GRANT USAGE, SELECT ON SEQUENCE public.memory_events_seq_seq TO authenticated;
GRANT ALL ON SEQUENCE public.memory_events_seq_seq TO service_role;

-- Full own-row access for mutable tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'spine_transactions','bid_offers','other_documents','social_news_items','search_runs',
    'ai_analyses','decision_sessions','counterparty_sets','choices','intents',
    'payment_sessions','pois','wads','executions','milestones','finality_records',
    'spine_api_keys','audit_logs'
  ] LOOP
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())',
      t || '_own', t);
  END LOOP;
END $$;

-- Append-only tables: read + insert own rows, no update/delete
CREATE POLICY "memory_events_read_own" ON public.memory_events FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "memory_events_insert_own" ON public.memory_events FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "token_entries_read_own" ON public.token_entries FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "token_entries_insert_own" ON public.token_entries FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
REVOKE UPDATE, DELETE ON public.memory_events FROM authenticated;
REVOKE UPDATE, DELETE ON public.token_entries FROM authenticated;

CREATE INDEX idx_memory_events_txn ON public.memory_events(transaction_id, seq);
CREATE INDEX idx_token_entries_ws ON public.token_entries(workspace_id);
CREATE INDEX idx_spine_txn_ws ON public.spine_transactions(workspace_id);