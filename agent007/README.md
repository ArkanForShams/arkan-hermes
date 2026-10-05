# Agent 007

**Internal AI-native issue war room for AlMajdouie** — Outlook issues flow in read-only, AI drafts detailed vendor emails for human approval, daily follow-up discipline until vendors reply, meeting notes become summarized outputs.

> *Every email issue is captured, every vendor is chased daily, every meeting produces outputs — nothing falls through.*

**As-of:** 2026-10-05 | **Status:** build in progress (specs/001-baseline/) | **Owner:** Shams Tabrez

## Document set (Spec Kit)

| Document | Path |
|---|---|
| Constitution (principles) | `.specify/memory/constitution.md` |
| PRD / specification | `specs/001-baseline/spec.md` |
| Implementation plan | `specs/001-baseline/plan.md` |
| Data model | `specs/001-baseline/data-model.md` |
| UI/UX design system | `specs/001-baseline/ui-design.md` |
| Task breakdown | `specs/001-baseline/tasks.md` |

Application code: `app/` (Next.js 15, TypeScript, Tailwind v4, Prisma + SQLite).

## Quick start (dev)

```bash
cd app
npm install
npx prisma migrate dev        # creates SQLite db from schema
npm run seed                  # users + projects + vendor mapping sample
npm run dev                   # http://localhost:3000
```

Default seeded accounts (dev only — change before any real deployment):
- `shams` / role ADMIN
- `team1` / role TEAM
- `viewer1` / role VIEWER

## Environment

Copy `.env.example` → `app/.env`:
- `DATABASE_URL` — SQLite file (default `file:./dev.db`)
- `SESSION_SECRET` — random 32-byte string (`openssl rand -base64 32`)
- `AI_*` — optional: OpenAI-compatible endpoint + key; without it the deterministic fallback drafting is used
- `GRAPH_*` — optional: Azure app registration for read-only Outlook ingestion (`Mail.Read` only); without it the DemoMailConnector provides a simulated inbox

## Principles (summary — full text in constitution)

1. Spec-first, always · 2. Simplicity is the product · 3. **Read-only external effects** (app never sends email; AI drafts, human sends) · 4. Privacy by design · 5. Arabic–English parity · 6. Production-ready, not prototype · 7. Shariah-aligned operations · 8. Swap-wired boundaries (LLM/auth/mail providers are interfaces)

## Runbook

- **Backup:** `npm run backup` → snapshots SQLite to `backups/agent007-YYYYMMDD-HHMM.db` (run via cron daily)
- **Restore:** stop app → replace db file → start app (SQLite single-file)
- **Logs:** audit events in DB (`AuditEvent`), scheduler output in server console
- **Rename brand:** `app/src/lib/brand.ts` is the single source of the wordmark
- **Stack swaps** (Constitution VIII): see plan.md §2 — each provider boundary is one adapter file