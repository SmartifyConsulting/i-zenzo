# Izenzo Look-and-Feel UI

Build the full marketing + docs interface from the `look-and-feel-clone` branch of `SmartifyConsulting/izenzo-inspired`, matching izenzo.co.za exactly: white background with soft emerald/indigo mesh glow, deep-emerald ink (`#0a2a1f`-family) primary, emerald accent on key words, Inter typography, mono uppercase technical labels, 6px radii, 1280px container, fixed 80px translucent header.

## Pages

Every path from the repo's router gets its own route file.

- `/` — home: badge pill, split-color hero headline, dual CTA, mono standards ticker, product/solution sections, certificate mock, footer
- Products: `/products/trade-desk`, `/products/compliance-engine`, `/products/audit-ledger`
- Solutions: `/solutions/traders`, `/solutions/finance`, `/solutions/sovereigns`
- `/pricing`, `/walkthrough`, `/trust`, `/status`, `/auth`
- Docs (sidebar layout): `/docs`, `/docs/api`, plus stub pages for quickstart, authentication, matches, counterparties, evidence, webhooks, api-pricing, errors

Copy is taken verbatim from izenzo.co.za / the repo's page components.

## Shared chrome

- Header with hover dropdowns for Products, Solutions, Developers, Resources; Log In + Create Account buttons; mobile menu
- Footer with link columns
- Docs sidebar layout wrapping all `/docs/*` pages
- Reusable UI primitives ported from the repo: buttons, cards, badges, section headers, marquee ticker, certificate mock, logo

## Auth page

`/auth` is UI only (no backend in this pass): sign in / create account tabs, password show/hide toggle, "Forgot password?" link skipped in tab order, plus `/forgot-password` and `/reset-password` screens in the same style.

## Technical notes

- Framework here is TanStack Start, not React Router — routes become files under `src/routes/` (e.g. `products.trade-desk.tsx`, `docs.route.tsx` + `docs.index.tsx`). No `react-router-dom`.
- The repo's `@theme` tokens (emerald brand/bright/muted/950, foreground, muted, border, radius) are ported into `src/styles.css` as semantic tokens in oklch; `gradient-text`, `mesh-bg`, and the marquee keyframes come across as utilities. No hardcoded color classes in components.
- Inter loaded via `<link>` in `__root.tsx` head.
- `lucide-react` for icons; the repo's `hero.png` and `icons.svg` are re-created as generated/inline assets.
- Each route defines its own `head()` with unique title, description, og:title, og:description.
- Static UI only — no database, auth backend, or API calls.
