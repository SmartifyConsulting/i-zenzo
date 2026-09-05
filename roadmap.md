# Roadmap

- [x] Port Izenzo look-and-feel UI (all marketing, docs, auth routes)
- [x] Auth UX: password show/hide, forgot-password out of tab order, /forgot-password + /reset-password
- [x] Demo data across all tables with consistent relationships
- [x] Pull updated `look-and-feel-clone` code: nav "Live Backend Demo" entry, `/live-demo`, `/checkout/$sessionId`
- [x] Rebuild the upstream Express/SQLite spine on Lovable Cloud (Postgres + RLS + server functions):
      strict stage order, hash-chained memory, token gates (POI 1/$10, WaD 3/$30), sandbox payment
      sessions with idempotent crediting, OFAC SDN whole-word sanctions screening, Finality certificates
- [x] Real auth wired to Cloud auth (sign in / create account → /live-demo)
- [x] Pull `add-dashboard` branch: /dashboard (wallet + transaction list), session-aware navbar, auth redirects to /dashboard
- [x] Visual-only Microsoft/Google sign-in buttons with "not switched on yet" notice
- [x] Anonymous demo account (confirmed, no link to the owner)
- [x] Page-by-page fidelity pass against izenzo.co.za (home, products, solutions, pricing, walkthrough, docs, trust, status, auth)
