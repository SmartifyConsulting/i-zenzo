# Enforce the Izenzo business rules in the deal engine

Bring our engine in line with the rules published on izenzo.co.za, so the demo behaves the way the site says the platform behaves.

## Rules to enforce

Each rule becomes a hard, non-waivable server-side check with a clear message when it blocks.

1. **Approved to Trade** — a deal cannot progress past intent unless both parties carry an Approved-to-Trade status.
2. **Screening freshness (30 days)** — sanctions/PEP screening must be clear and no older than 30 days for both parties at the moment the certificate is issued.
3. **Risk band** — parties in the high or critical band are rejected outright.
4. **Intent completion probability ≥ 50.1%** — the intent cannot be collapsed (sealed) below this threshold. The score is computed from evidence completeness, gate progress and counterparty risk, and stored with the intent so it is auditable.
5. **Credit rules** — 1 credit = 1 Trade Request, priced at $10.00, with purchase bundles of 1 / 10 / 50 / 200. Credit burn stays atomic and idempotent as it is today.
6. **Nine gates unchanged** — entity, UBO, sanctions, jurisdiction, authority, terms, evidence, bilateral collapse sign, WaD certificate. Each gate's pass/fail is recorded on the certificate rather than assumed.

## What changes for the user

- Counterparty records gain compliance state: approved-to-trade flag, risk band, last screening date and result, UBO disclosed, authority-to-bind on file.
- The intent screen shows a completion probability and refuses to seal below 50.1%, explaining what is missing.
- The certificate lists all nine gates with their result, instead of three predicates.
- Blocked deals show the specific reason (stale screening, high risk, not approved, probability too low) rather than a generic failure.
- Pricing and the buy-credits screen use the site's wording and bundles.

## Demo data

The existing seeded transactions are updated so the population spans the new states: most counterparties approved with fresh screening, a few with stale screening, a few high-risk, and a few intents below the probability threshold — so every rule is visible in the demo without breaking the deals that currently reach finality.

## Technical notes

- Migration: add compliance columns to `counterparties` (`approved_to_trade`, `risk_band`, `screened_at`, `screening_result`, `ubo_disclosed`, `authority_to_bind`) and `completion_probability` to `intents`; backfill existing rows.
- `src/lib/spine/core.server.ts`: add a `runHardGates()` helper returning per-gate results, plus `assertTradeEligible()` (approval, freshness, risk band) and `computeCompletionProbability()`.
- `src/lib/spine.functions.ts`: `sealPoi` enforces the probability threshold; `createWad` runs all nine gates and fails the certificate on any gate failure; `createExecution` keeps requiring a PASSED WaD.
- Pricing constants: keep `TOKEN_UNIT_USD = 10` and POI = 1 credit; the extra 3-credit WaD charge is removed so billing matches "pay only for the Proof-of-Intent records you mint". Bundles become 1 / 10 / 50 / 200.
- Wallet history stays append-only; no existing ledger rows are rewritten.
