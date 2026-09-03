
-- Certificates
DROP POLICY IF EXISTS "certificates public read" ON public.certificates;
REVOKE SELECT ON public.certificates FROM anon;
GRANT SELECT ON public.certificates TO authenticated;
CREATE POLICY "certificates authenticated read" ON public.certificates FOR SELECT TO authenticated USING (true);

-- Counterparties
DROP POLICY IF EXISTS "counterparties public read" ON public.counterparties;
REVOKE SELECT ON public.counterparties FROM anon;
GRANT SELECT ON public.counterparties TO authenticated;
CREATE POLICY "counterparties authenticated read" ON public.counterparties FOR SELECT TO authenticated USING (true);

-- Evidence packs
DROP POLICY IF EXISTS "evidence_packs public read" ON public.evidence_packs;
REVOKE SELECT ON public.evidence_packs FROM anon;
GRANT SELECT ON public.evidence_packs TO authenticated;
CREATE POLICY "evidence_packs authenticated read" ON public.evidence_packs FOR SELECT TO authenticated USING (true);

-- Gate events
DROP POLICY IF EXISTS "gate_events public read" ON public.gate_events;
REVOKE SELECT ON public.gate_events FROM anon;
GRANT SELECT ON public.gate_events TO authenticated;
CREATE POLICY "gate_events authenticated read" ON public.gate_events FOR SELECT TO authenticated USING (true);

-- Trade matches
DROP POLICY IF EXISTS "trade_matches public read" ON public.trade_matches;
REVOKE SELECT ON public.trade_matches FROM anon;
GRANT SELECT ON public.trade_matches TO authenticated;
CREATE POLICY "trade_matches authenticated read" ON public.trade_matches FOR SELECT TO authenticated USING (true);

-- Webhook events
DROP POLICY IF EXISTS "webhook_events public read" ON public.webhook_events;
REVOKE SELECT ON public.webhook_events FROM anon;
GRANT SELECT ON public.webhook_events TO authenticated;
CREATE POLICY "webhook_events authenticated read" ON public.webhook_events FOR SELECT TO authenticated USING (true);
