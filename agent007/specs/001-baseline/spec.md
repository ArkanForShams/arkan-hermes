# Agent 007 — Specification (PRD)

**As-of:** 2026-10-05 | **Status:** Baseline (from Shams interview, 5 rounds) | **Owner:** Shams Tabrez

## 1. Product Definition

**Agent 007** is an internal, AI-native issue-tracking and vendor-coordination war room for AlMajdouie. It converts an overloaded Outlook inbox into tracked issues, drafts detailed vendor escalation emails for human approval, enforces daily follow-up discipline until vendors reply, and turns meeting notes into summarized, actionable outputs.

**One-sentence pitch:** *Every email issue is captured, every vendor is chased daily, every meeting produces outputs — nothing falls through.*

### What it is NOT
- NOT a Jira replacement (no sprints, story points, epics, workflows builder)
- NOT a general chat or document tool
- NOT an email client — it never sends email (Phase 1/2)

## 2. Users & Roles

| Role | Who | Capabilities |
|---|---|---|
| Admin | Shams | Everything: users, vendor mapping, all issues, settings, dashboards |
| Team | IT Applications team (~5–15) | Work issues: analyze, request drafts, log follow-ups, close issues, meetings |
| Viewer | Other departments | Read-only dashboards and issue status; no mutations |

**Onboarding:** Admin creates accounts (username + temporary password). No public signup. Microsoft SSO is a Phase-later swap (Constitution VIII).

**Scale:** Several small projects/requests in parallel; weeks-to-months horizon; multi-department visibility.

## 3. Core Functional Requirements

### FR-1: Projects
- Admin/Team create projects: name (EN/AR), description, status (Active/Archived), color tag
- Project list = home screen; each project shows counts (New / In progress / With vendor / Resolved)

### FR-2: Issues (the heart)
- Manually created (quick-add: title, project, priority) OR auto-captured from Outlook (FR-4)
- Fields: ID (human-readable e.g. A7-0142), title EN/AR, description, application (FK), vendor (FK), department (reporter), priority (Low/Medium/High/Critical), status, assignee (Team member), due date, email thread link, timestamps
- **Lifecycle (fixed, per Shams):** `New → Analyzing → With vendor → Follow-up → Resolved → Closed`
- Views per project: **Kanban board** (drag between stages) AND **list** (sortable rows) — user toggles; preference remembered
- Assignment to team members; activity log on every issue (who/what/when)

### FR-3: Vendor email drafting (AI, suggest-mode)
- Preconditions: issue has application + vendor (from mapping FR-6)
- AI generates: (a) structured issue narrative — what the issue is, how it occurred, impact, technical detail per application context; (b) vendor email draft (subject + body, bilingual-capable, professional escalation tone)
- Draft appears in review panel; Shams/team edits inline; **"Open in Outlook"** action composes the email in Outlook (mailto/deeplink) — human clicks Send. App NEVER sends.
- Every draft generation/edition is logged to the issue's activity trail.

### FR-4: Outlook inbox ingestion (read-only)
- Microsoft Graph, delegated read-only scope (`Mail.Read`), OAuth device-flow or code-flow by Shams once; token stored encrypted
- Poll schedule: configurable, default every 15 min
- Ingestion rules: folders/filters configurable in settings (default: Inbox, unread + today)
- AI classification on ingest: is this an issue? (vs. FYI/newsletter); suggested application; suggested vendor; suggested priority; suggested department — all as *suggestions*, Shams confirms on triage screen
- Deduplication by message ID; no email deletion/marking-read from the app (strictly read-only)

### FR-5: Follow-up discipline engine
- When issue enters `With vendor`: follow-up clock starts (day counter visible on card/row)
- Daily engine (server-side scheduled job): marks issues awaiting vendor reply >24h → shows in "Today's follow-ups" queue with ready-to-send follow-up text draft (AI-generated, referencing last exchange, polite escalation)
- Vendor reply detected (matched thread via ingestion) → issue auto-moves `With vendor → Follow-up` stage with reply summary; answer-completeness check: AI compares reply content against the questions asked, flags unanswered items
- Reminder log per issue: every follow-up prepared/sent is recorded with date + text
- Meeting linkage: issues can attach to meetings; stand-up view shows issues in `Analyzing`/`With vendor` grouped by vendor

### FR-6: Vendor ↔ Application mapping (settings)
- Table: Application (e.g. "SAP MM"), Vendor name, vendor contact email(s), support-level notes, escalation contact
- Admin-managed; CSV import (mapping exists, Shams provides) + manual add/edit
- Used by FR-3 drafting and FR-4 classification

### FR-7: Meetings & stand-ups
- Create meeting (date, type: Stand-up/Vendor/Ad-hoc, linked issues)
- Content input Phase 1: paste notes/transcript → AI summary: decisions, action items (each convertible to issue with assignee), open questions, next steps — bilingual output
- Phase 2 (later): Outlook Calendar + Teams integration (user deferred)

### FR-8: Dashboards
- **Team dashboard:** open issues by stage, overdue, follow-ups due today, vendor response times
- **Leadership dashboard (for Viewers):** portfolio view across projects: issue volumes, resolution trends, top vendors by open issues, department breakdown — read-only, refresh-safe numbers
- **Stand-up view:** today's board in one glance for the daily meeting

### FR-9: Auth & security
- Sessions: httpOnly cookie, 7-day expiry; passwords hashed (bcrypt/argon2)
- Server-side role checks on every API route
- Audit log: login, issue transitions, draft approval, settings changes

## 4. Experience & Design Direction (from interview)

- **Feel:** Corporate & polished — structured, formal, Microsoft/enterprise-grade clarity. Information-dense but never cramped. Trustworthy "bank-grade" composure.
- **Identity:** Designer-proposed distinctive palette (see ui-design.md); must NOT resemble Linear, Jira, Asana, Trello, Taiga, Wekan or any Clone Wars entry's branding. Original wordmark, original layout geometry.
- **Language:** Arabic ⇄ English toggle, persistent per user, full RTL mirroring (sidebar flips, text aligns, calendar/dates localize). Bilingual labels shipped for every screen.
- **Core views:** Board + List toggle per project (preference persisted per project per user).
- **Mobile:** one responsive build — dashboards and lists fully usable on phone; drag-drop boards get tap-move fallback (select card → select stage).

## 5. Non-Functional Requirements

- Page interactions < 300ms feel; server actions debounced; board drag optimistic
- 15–20 concurrent internal users
- Data residency: app + DB on Shams-controlled infra (self-host/local first); LLM via no-retention API
- Backups: SQLite file snapshot daily + export button (Phase 1); documented restore
- Accessibility: keyboard navigation on board/list, focus states, AA contrast
- All AI outputs labeled as AI-drafted until human approves

## 6. Out of Scope (v1)

- Sending email from the app (Phase 3 decision, needs Shams approval)
- Outlook Drafts-folder writes (Phase 2 candidate)
- Teams/Calendar auto-pull; live meeting transcription
- Microsoft SSO (later swap)
- Mobile native apps; external tenants; billing/payments (internal only)

## 7. Success Criteria

1. Shams runs daily triage of inbox → issues in < 10 minutes
2. No vendor issue ever waits > 24h without a prepared follow-up
3. Stand-up prep: previously ~15 min manual, now a single view + AI summaries
4. Team adopts it for every vendor issue (not email-side-channels)
5. Lighthouse ≥ 90 across categories; Arabic layout indistinguishable in quality from English

## 8. Traceability

Interview rounds 1–5 (2026-10-05, this session) → sections 1–4. Clone Wars skeleton study → plan.md. Constitution → `.specify/memory/constitution.md`. All later .md documents (plan, data-model, ui-design, tasks) derive from this spec and cite it.