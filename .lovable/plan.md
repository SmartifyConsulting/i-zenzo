# Social sign-in buttons + full page-by-page fidelity pass

## 1. Google and Microsoft sign-in (visual only)

- Add "Continue with Google" and "Continue with Microsoft" buttons above the email/password form on the sign-in and create-account views, with a "or continue with email" divider.
- Buttons use the official brand marks and match the existing button sizing/border styling.
- Clicking either shows a short inline notice: "Social sign-in isn't switched on yet — please use email and password." No provider is enabled and no keys are needed.
- Everything already in place stays: password show/hide toggles, "Forgot password?" skipped in tab order, working forgot/reset pages.

## 2. Anonymous demo account

- Create a neutral, pre-confirmed account with no connection to you (e.g. `demo.trader@izenzo-demo.co.za`) and a generated password, and hand you the credentials in chat.
- Standard user only — no admin role, no access to your data.
- Used to check every signed-in screen (dashboard, live demo, checkout) during the review.

## 3. Page-by-page comparison against izenzo.co.za

Compare each live page against ours and correct content differences — missing sections, wrong or paraphrased wording, wrong section order, missing links, wrong stats/labels/CTAs. Keep our current spacing and component styling (your chosen "same content, our polish" level).

Order of work, one pass over everything:

1. Home
2. Products: Trade Desk, Compliance Engine, Audit Ledger
3. Solutions: Traders, Finance, Sovereigns
4. Pricing
5. Walkthrough
6. Docs index, API reference, and each docs sub-page
7. Trust, Status
8. Auth, forgot/reset password, dashboard, live demo, checkout (our own screens — checked for consistency, not against the live site)

For each page I'll capture the live page, list the differences, then apply the fixes. Pages already matching get left alone.

## 4. Verification

- Load every page in a browser and confirm no errors and correct rendering.
- Sign in with the anonymous account and walk the signed-in screens.
- Report a short per-page summary of what changed.

## Technical notes

- Social buttons are presentational; `supabase--configure_social_auth` is deliberately not called, so no provider is enabled yet. Wiring them up later is a small follow-up.
- Demo user created via the admin API with email pre-confirmed; no role row added.
- The live site is a client-rendered app, so page capture uses a headless browser rather than plain HTML fetches.
- Copy/content edits stay inside `src/pages/**` and `src/components/izenzo/**`; no backend or data-model changes.
