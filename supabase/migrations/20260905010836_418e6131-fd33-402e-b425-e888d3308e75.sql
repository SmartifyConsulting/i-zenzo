ALTER TABLE public.counterparties
  ADD COLUMN IF NOT EXISTS approved_to_trade boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS risk_band text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS screened_at timestamptz,
  ADD COLUMN IF NOT EXISTS screening_result text NOT NULL DEFAULT 'clear',
  ADD COLUMN IF NOT EXISTS ubo_disclosed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS authority_to_bind boolean NOT NULL DEFAULT false;

ALTER TABLE public.intents
  ADD COLUMN IF NOT EXISTS completion_probability numeric;

UPDATE public.counterparties SET
  approved_to_trade = true,
  ubo_disclosed = true,
  authority_to_bind = true,
  screening_result = 'clear',
  screened_at = now() - (interval '1 day' * (2 + (abs(hashtext(short_code)) % 20))),
  risk_band = CASE (abs(hashtext(short_code)) % 10)
    WHEN 0 THEN 'low' WHEN 1 THEN 'low' WHEN 2 THEN 'low'
    WHEN 3 THEN 'medium' WHEN 4 THEN 'medium' WHEN 5 THEN 'medium' WHEN 6 THEN 'medium'
    ELSE 'medium' END;

-- a few deliberately non-compliant parties so every rule is visible in the demo
UPDATE public.counterparties SET screened_at = now() - interval '64 days'
  WHERE short_code IN (SELECT short_code FROM public.counterparties ORDER BY short_code LIMIT 2);

UPDATE public.counterparties SET risk_band = 'high'
  WHERE short_code IN (SELECT short_code FROM public.counterparties ORDER BY short_code DESC LIMIT 2);

UPDATE public.counterparties SET approved_to_trade = false
  WHERE short_code IN (SELECT short_code FROM public.counterparties ORDER BY short_code OFFSET 5 LIMIT 2);

UPDATE public.intents SET completion_probability = 0.5 + ((abs(hashtext(id::text)) % 480) / 1000.0)
  WHERE completion_probability IS NULL;