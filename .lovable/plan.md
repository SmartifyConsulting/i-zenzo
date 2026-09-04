# Pull the `add-dashboard` branch

I reviewed the branch. There is no open pull request — the link is GitHub's "create a PR" page — but the branch itself is one commit ahead of `main` and nothing on `main` has moved since, so it applies cleanly. It is worth pulling.

## What the branch adds

- **A workspace dashboard at `/dashboard`** — wallet summary plus a table of your transactions with stage, POI status, WaD decision, finality status and created date.
- **Navbar becomes session-aware** — signed-in visitors see a "Dashboard" button instead of "Log In / Create Account".
- **Sign-in and sign-up now land on `/dashboard`** instead of `/live-demo` (including the confirmation-email redirect).
- **A new `listTransactions` server function** that returns this workspace's transactions with their stage summary.
- **Small auth-screen tweak** — the logo is no longer part of the "Back to Izenzo home" link.

## What I'll do

1. Apply all seven file changes from the branch (5 modified, 2 new: `src/pages/Dashboard.tsx`, `src/routes/dashboard.tsx`).
2. Two small hardening fixes on top of what the branch ships:
   - The dashboard's per-transaction lookups use `maybeSingle()`, which errors if a transaction ever has more than one POI/WaD/finality row. Switch to a bounded single-row read so one odd record can't blank the whole dashboard.
   - The navbar decides logged-in state after mount, so it briefly renders "Log In" for signed-in users. Render the auth buttons only once the session check has resolved to avoid the flicker.
3. Verify: typecheck, then sign in in a browser and confirm `/dashboard` loads the wallet and the transaction list, the navbar switches, and log-out returns to `/auth`.

## Notes

- The dashboard's redirect for signed-out visitors is client-side, but the data itself is protected server-side by row-level security, so nothing leaks.
- You mentioned you have a spec to upload — this plan just brings the branch in as-is. Share the spec and I'll plan the additional dashboard work separately.
