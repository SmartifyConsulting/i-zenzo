
CREATE TABLE public.counterparties (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  short_code text not null unique,
  jurisdiction text not null,
  entity_type text not null,
  lei text,
  risk_tier text not null default 'standard',
  kyc_status text not null default 'verified',
  onboarded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.counterparties TO anon, authenticated;
GRANT ALL ON public.counterparties TO service_role;
ALTER TABLE public.counterparties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "counterparties public read" ON public.counterparties FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.trade_matches (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  buyer_id uuid not null references public.counterparties(id) on delete cascade,
  seller_id uuid not null references public.counterparties(id) on delete cascade,
  commodity text not null,
  incoterm text not null,
  quantity numeric not null,
  unit text not null,
  price_per_unit numeric not null,
  currency text not null default 'USD',
  notional_value numeric not null,
  status text not null default 'in_progress',
  gates_cleared int not null default 0,
  opened_at timestamptz not null default now(),
  settled_at timestamptz,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.trade_matches TO anon, authenticated;
GRANT ALL ON public.trade_matches TO service_role;
ALTER TABLE public.trade_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trade_matches public read" ON public.trade_matches FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.gate_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.trade_matches(id) on delete cascade,
  gate_number int not null,
  gate_name text not null,
  status text not null default 'pending',
  actor text not null,
  hash text,
  sealed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (match_id, gate_number)
);
GRANT SELECT ON public.gate_events TO anon, authenticated;
GRANT ALL ON public.gate_events TO service_role;
ALTER TABLE public.gate_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gate_events public read" ON public.gate_events FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.evidence_packs (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.trade_matches(id) on delete cascade,
  gate_number int,
  document_type text not null,
  filename text not null,
  sha256 text not null,
  size_bytes int not null,
  uploaded_by text not null,
  uploaded_at timestamptz not null default now()
);
GRANT SELECT ON public.evidence_packs TO anon, authenticated;
GRANT ALL ON public.evidence_packs TO service_role;
ALTER TABLE public.evidence_packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "evidence_packs public read" ON public.evidence_packs FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.certificates (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references public.trade_matches(id) on delete cascade,
  certificate_number text not null unique,
  root_hash text not null,
  issued_at timestamptz not null default now(),
  verifier_url text not null,
  status text not null default 'issued'
);
GRANT SELECT ON public.certificates TO anon, authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certificates public read" ON public.certificates FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.trade_matches(id) on delete cascade,
  event_type text not null,
  endpoint_url text not null,
  response_code int,
  attempts int not null default 1,
  delivered boolean not null default true,
  occurred_at timestamptz not null default now()
);
GRANT SELECT ON public.webhook_events TO anon, authenticated;
GRANT ALL ON public.webhook_events TO service_role;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "webhook_events public read" ON public.webhook_events FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null,
  monthly_price numeric,
  currency text not null default 'USD',
  match_allowance text not null,
  features jsonb not null default '[]'::jsonb,
  sort_order int not null default 0
);
GRANT SELECT ON public.pricing_plans TO anon, authenticated;
GRANT ALL ON public.pricing_plans TO service_role;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pricing_plans public read" ON public.pricing_plans FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.status_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  status text not null default 'operational',
  uptime_90d numeric not null default 100,
  sort_order int not null default 0
);
GRANT SELECT ON public.status_services TO anon, authenticated;
GRANT ALL ON public.status_services TO service_role;
ALTER TABLE public.status_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "status_services public read" ON public.status_services FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.status_incidents (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.status_services(id) on delete cascade,
  title text not null,
  impact text not null,
  body text not null,
  status text not null default 'resolved',
  started_at timestamptz not null,
  resolved_at timestamptz
);
GRANT SELECT ON public.status_incidents TO anon, authenticated;
GRANT ALL ON public.status_incidents TO service_role;
ALTER TABLE public.status_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "status_incidents public read" ON public.status_incidents FOR SELECT TO anon, authenticated USING (true);

-- ---------- demo data ----------
INSERT INTO public.counterparties (legal_name, short_code, jurisdiction, entity_type, lei, risk_tier, kyc_status, onboarded_at) VALUES
('Kalahari Metals Trading SA','KMT','ZA','Trading House','5493001KJTIIGC8Y1R12','standard','verified', now() - interval '412 days'),
('Emirates Bulk Commodities DMCC','EBC','AE','Trading House','254900BFPEPTIL8QVE96','elevated','verified', now() - interval '365 days'),
('Rotterdam Refined Holdings BV','RRH','NL','Refiner','724500VKKSH9QOLTFR81','standard','verified', now() - interval '298 days'),
('Sino-Pacific Resources Ltd','SPR','HK','Offtaker','300300E1000000012345','elevated','verified', now() - interval '250 days'),
('Banco Andino de Comercio','BAC','PE','Financial Institution','5493000IBP32UQZ0KL24','standard','verified', now() - interval '220 days'),
('Lagos Energy Partners Plc','LEP','NG','Producer','5967007LIEEXZX4LSD62','high','in_review', now() - interval '180 days'),
('Nordic Grain Cooperative AB','NGC','SE','Producer','549300NRQXKJZ0F8T173','low','verified', now() - interval '150 days'),
('Zambia Copperbelt Mining Ltd','ZCM','ZM','Producer',NULL,'elevated','verified', now() - interval '120 days'),
('Geneva Structured Trade SA','GST','CH','Financial Institution','506700GE1G29325QX363','low','verified', now() - interval '95 days'),
('Port Louis Freight Assurance','PLF','MU','Insurer',NULL,'standard','verified', now() - interval '60 days'),
('Singapore Sovereign Reserve Board','SSR','SG','Sovereign',NULL,'low','verified', now() - interval '45 days'),
('Casablanca Agri Exports SARL','CAE','MA','Producer',NULL,'standard','pending', now() - interval '20 days');

INSERT INTO public.trade_matches (reference, buyer_id, seller_id, commodity, incoterm, quantity, unit, price_per_unit, notional_value, status, gates_cleared, opened_at, settled_at)
SELECT v.reference, b.id, s.id, v.commodity, v.incoterm, v.quantity, v.unit, v.price, v.quantity * v.price, v.status, v.gates,
       now() - (v.age || ' days')::interval,
       CASE WHEN v.status = 'settled' THEN now() - ((v.age - 12) || ' days')::interval ELSE NULL END
FROM (VALUES
  ('IZ-MTC-24-0001','SPR','ZCM','Copper Cathode Grade A','CIF',2500,'MT',8420,'settled',9,140),
  ('IZ-MTC-24-0002','RRH','LEP','Crude Oil - Bonny Light','FOB',95000,'BBL',78.4,'settled',9,124),
  ('IZ-MTC-24-0003','EBC','NGC','Milling Wheat 12.5%','CFR',30000,'MT',241,'settled',9,110),
  ('IZ-MTC-24-0004','KMT','ZCM','Copper Concentrate','FCA',1800,'MT',3960,'settled',9,88),
  ('IZ-MTC-25-0005','SPR','CAE','Phosphate Rock 30% BPL','FOB',45000,'MT',132,'in_progress',6,42),
  ('IZ-MTC-25-0006','GST','LEP','Low Sulphur Fuel Oil','CIF',22000,'MT',512,'in_progress',4,31),
  ('IZ-MTC-25-0007','EBC','NGC','Feed Barley','FOB',18000,'MT',196,'in_progress',7,24),
  ('IZ-MTC-25-0008','BAC','ZCM','Copper Cathode Grade A','CIF',900,'MT',8615,'in_progress',3,17),
  ('IZ-MTC-25-0009','SSR','KMT','Gold Doré Bars','DAP',420,'KG',68200,'in_progress',8,11),
  ('IZ-MTC-25-0010','RRH','CAE','Refined Sunflower Oil','CFR',6500,'MT',1042,'pending',1,6),
  ('IZ-MTC-25-0011','SPR','LEP','LPG Propane','FOB',12000,'MT',604,'pending',2,3),
  ('IZ-MTC-25-0012','GST','ZCM','Cobalt Hydroxide','FCA',350,'MT',24600,'halted',5,9)
) AS v(reference, buyer_code, seller_code, commodity, incoterm, quantity, unit, price, status, gates, age)
JOIN public.counterparties b ON b.short_code = v.buyer_code
JOIN public.counterparties s ON s.short_code = v.seller_code;

INSERT INTO public.gate_events (match_id, gate_number, gate_name, status, actor, hash, sealed_at)
SELECT m.id, g.n, g.name,
  CASE WHEN g.n <= m.gates_cleared THEN 'sealed'
       WHEN m.status = 'halted' AND g.n = m.gates_cleared + 1 THEN 'halted'
       WHEN g.n = m.gates_cleared + 1 THEN 'active' ELSE 'pending' END,
  g.actor,
  CASE WHEN g.n <= m.gates_cleared THEN '0x' || encode(digest(m.reference || ':' || g.n, 'sha256'), 'hex') ELSE NULL END,
  CASE WHEN g.n <= m.gates_cleared THEN m.opened_at + (g.n || ' days')::interval ELSE NULL END
FROM public.trade_matches m
CROSS JOIN (VALUES
  (1,'Identity Attestation','Compliance Engine'),
  (2,'Counterparty Screening','Compliance Engine'),
  (3,'Mandate Verification','Buyer Mandate Officer'),
  (4,'Commercial Terms Lock','Trade Desk'),
  (5,'Proof of Product','Seller Operations'),
  (6,'Proof of Funds','Financial Institution'),
  (7,'Logistics Binding','Freight Coordinator'),
  (8,'Settlement Instruction','Settlement Agent'),
  (9,'Certificate Seal','Izenzo Audit Ledger')
) AS g(n, name, actor);

INSERT INTO public.evidence_packs (match_id, gate_number, document_type, filename, sha256, size_bytes, uploaded_by, uploaded_at)
SELECT ge.match_id, ge.gate_number, d.doc_type,
  lower(replace(d.doc_type,' ','_')) || '_' || ge.gate_number || '.pdf',
  encode(digest(ge.match_id::text || ge.gate_number || d.doc_type, 'sha256'),'hex'),
  (140000 + (ge.gate_number * 8123))::int,
  ge.actor,
  ge.sealed_at
FROM public.gate_events ge
JOIN (VALUES
  (1,'Certificate of Incorporation'),
  (2,'Sanctions Screening Report'),
  (3,'Corporate Mandate Letter'),
  (4,'Signed Term Sheet'),
  (5,'SGS Inspection Certificate'),
  (6,'Bank Comfort Letter'),
  (7,'Bill of Lading'),
  (8,'SWIFT MT760 Confirmation'),
  (9,'Sealed Audit Manifest')
) AS d(gate_no, doc_type) ON d.gate_no = ge.gate_number
WHERE ge.status = 'sealed';

INSERT INTO public.certificates (match_id, certificate_number, root_hash, issued_at, verifier_url, status)
SELECT m.id,
  'IZ-COI-' || right(m.reference, 4),
  '0x' || encode(digest(m.reference || ':root', 'sha256'),'hex'),
  coalesce(m.settled_at, now()),
  'https://verify.izenzo.co.za/' || lower(right(m.reference,4)),
  'issued'
FROM public.trade_matches m
WHERE m.status = 'settled';

INSERT INTO public.webhook_events (match_id, event_type, endpoint_url, response_code, attempts, delivered, occurred_at)
SELECT ge.match_id,
  'gate.' || ge.gate_number || '.sealed',
  'https://api.' || lower(cp.short_code) || '.example.com/izenzo/hooks',
  CASE WHEN ge.gate_number = 6 AND m.reference = 'IZ-MTC-25-0008' THEN 500 ELSE 200 END,
  CASE WHEN ge.gate_number = 6 AND m.reference = 'IZ-MTC-25-0008' THEN 3 ELSE 1 END,
  NOT (ge.gate_number = 6 AND m.reference = 'IZ-MTC-25-0008'),
  ge.sealed_at
FROM public.gate_events ge
JOIN public.trade_matches m ON m.id = ge.match_id
JOIN public.counterparties cp ON cp.id = m.buyer_id
WHERE ge.status = 'sealed';

INSERT INTO public.pricing_plans (slug, name, tagline, monthly_price, match_allowance, features, sort_order) VALUES
('desk','Trade Desk','For institutions running governed trade flows.',2400,'Up to 25 matches / month',
 '["Turnkey Trade Desk workspace","Nine-Gate governance trail","Certificate of Intent issuance","Standard compliance screening","Email support"]'::jsonb,1),
('compliance','Compliance Profile','For risk teams that own the mandate.',6800,'Up to 120 matches / month',
 '["Everything in Trade Desk","Configurable gate policy","Sanctions and PEP screening","Evidence pack retention 7 years","Named compliance contact"]'::jsonb,2),
('network','Network API','Build directly on the governance network.',NULL,'Unlimited matches',
 '["Full REST and webhook API","Audit Ledger read access","Dedicated environments","99.95% uptime commitment","24/7 institutional support"]'::jsonb,3);

INSERT INTO public.status_services (slug, name, description, status, uptime_90d, sort_order) VALUES
('governance-api','Governance API','Match creation, gate transitions, evidence submission.','operational',99.98,1),
('compliance-engine','Compliance Engine','Screening, mandate checks, policy evaluation.','operational',99.95,2),
('audit-ledger','Audit Ledger','Hash sealing, certificate issuance, verification.','operational',100,3),
('trade-desk','Trade Desk','Institutional workspace UI.','degraded',99.82,4),
('webhooks','Webhook Delivery','Outbound event delivery to counterparty endpoints.','operational',99.91,5);

INSERT INTO public.status_incidents (service_id, title, impact, body, status, started_at, resolved_at)
SELECT s.id, i.title, i.impact, i.body, i.status, now() - (i.age_h || ' hours')::interval,
  CASE WHEN i.status = 'resolved' THEN now() - ((i.age_h - i.dur_h) || ' hours')::interval ELSE NULL END
FROM (VALUES
  ('trade-desk','Elevated latency on workspace load','minor','A caching layer in the Trade Desk was returning stale workspace manifests. Mitigated by draining the affected node. No governance data was affected.','monitoring',5,0),
  ('webhooks','Delayed webhook delivery to EU endpoints','minor','Retry backlog cleared after an upstream DNS provider incident. All events were delivered within the retry window.','resolved',72,4),
  ('compliance-engine','Screening provider timeout','major','A third-party sanctions list provider timed out, pausing gate 2 transitions. Gates resumed automatically once the provider recovered.','resolved',240,3),
  ('governance-api','Scheduled maintenance - ledger index rebuild','maintenance','Planned index rebuild on the Audit Ledger. Reads remained available throughout.','resolved',480,2)
) AS i(service_slug, title, impact, body, status, age_h, dur_h)
JOIN public.status_services s ON s.slug = i.service_slug;
