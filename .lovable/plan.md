# Full database export: structure plus data

The built-in export in Cloud gives you the rows only. You asked for the structure as well, so I will produce a complete package you can download.

## What you get

A single ZIP file containing:

1. `schema.sql` — a setup script that recreates every table (all 31 of them), including columns, types, defaults, keys, relationships between tables, indexes, the access rules, and the small helper used for admin checks.
2. `data/` — one CSV file per table with all current rows, named after the table.
3. `data.sql` — the same rows as insert statements, so `schema.sql` followed by `data.sql` rebuilds the whole database from scratch.
4. `README.txt` — short notes on the export date, table row counts, and the order to run the two scripts in.

## Notes

- Sign-in accounts and passwords are managed by the platform's own auth system and are not part of this package; only the app tables are included.
- No secrets or keys are written into the files.

## Technical details

- Tables covered: the 31 tables in the `public` schema (workspaces, spine_transactions, counterparties, intents, pois, wads, executions, milestones, finality_records, memory_events, token_entries, payment_sessions, audit_logs, trade_matches, gate_events, evidence_packs, certificates, webhook_events, status_services, status_incidents, pricing_plans, user_roles, and the rest).
- Structure is reconstructed by reading the catalog through read-only queries (columns, constraints, indexes, policies, grants, the `app_role` enum, and `has_role`), since full dumps are not available in this environment.
- Data is exported with `COPY ... TO STDOUT WITH CSV HEADER` per table, plus generated `INSERT` statements in dependency order for `data.sql`.
- Output written to `/mnt/documents/izenzo-database-export.zip` and attached in chat.
- Read-only operation: nothing in the database is modified.
