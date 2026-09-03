# Pull the updated izenzo-inspired code into this app

The `look-and-feel-clone` branch has moved on since the first port. Latest commit: "Update RUN.md for the payment gateway and real auth flow". I can't switch which GitHub repo this project syncs to (your project is linked to `i-zenzo`, which only has `main`) — but I can re-fetch that branch and re-apply everything it contains here.

## What changed upstream

**UI updates** to Home, Auth, Pricing, Status, Trust, Walkthrough, Navbar, Footer, Logo, DocsLayout and shared UI primitives.

**Two new pages**
- `/live-demo` — runs the full Trading → POI → WaD → Execution → Finality spine live and shows each stage light up, plus a Memory hash-chain view
- `/checkout/:sessionId` — token-purchase checkout that settles via a signed callback

**A real backend** (previously the repo was static). Express + SQLite with ~23 tables and endpoints for signup/login, token purchases and payment sessions, bid offers, documents, news items, search runs, AI analyses, decision sessions, counterparties, intents, POIs, WaDs, executions, milestones, finality records, CDAs, transaction timeline and lineage, wallets, API keys, and audit logs. It also does live sanctions screening against the checked-in OFAC SDN list, non-waivable token gates, SHA-256 sealing, and an append-only hash-chained memory substrate.

## What I'll do

1. **Port all UI changes** — updated pages/components brought across, adapted to TanStack routing (this app has no `react-router-dom`), keeping the existing per-page SEO metadata.
2. **Add the two new routes** — `/live-demo` and `/checkout/$sessionId`.
3. **Rebuild the backend on this stack.** The Express server and SQLite file can't run here — this app is TanStack Start on an edge runtime with Lovable Cloud (Postgres) behind it. Each endpoint becomes a server function, and the SQLite schema becomes a Postgres migration with row-level security so a workspace only sees its own records. Stage-order enforcement, token gates, hash sealing and the memory chain are ported logic-for-logic.
4. **Auth** — the upstream server rolls its own bcrypt signup/login. Here it maps onto the app's existing Cloud auth (which already has your admin account), so accounts persist properly and sessions work across the app.
5. **Sanctions screening** — the OFAC SDN list (~19k entries) is loaded into a database table rather than read from a CSV on disk, and screened against at the WaD gate, so the "Vladimir Putin blocks the gate" proof point still works live.
6. **Payments** — the sandbox session → signed callback → idempotent credit flow is kept as-is, with the callback as a public API route that verifies its signature. No real money moves.

## Notes

- The existing demo tables in this app (counterparties, trade matches, gate events, evidence packs, certificates, etc.) stay; the new spine tables are added alongside.
- The upstream `RUN.md` two-terminal setup doesn't apply here — everything runs as one app, no separate backend to start.
- Anything upstream calls out as not built (AI document extraction, live payment processor, OAuth sign-in, password reset in that flow) stays not built, unless you ask for it.
- This is a large port. If you'd rather start with just the UI refresh and the two new pages, and leave the backend spine for a second pass, say so and I'll split it.
