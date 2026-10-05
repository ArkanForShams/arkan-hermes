# Agent 007 — UI/UX Design System

**As-of:** 2026-10-05 | **Derives from:** spec.md §4 | **Feel target:** Corporate & polished — structured, formal, enterprise-grade clarity. Distinctive: shares DNA with NO studied product (Linear, Jira, Asana, Trello, Taiga, Wekan).

## 1. Palette — "Desert Formal"

An original system: warm Saudi-desert neutrals + deep petrol discipline + copper signal. No product studied uses petrol+copper on warm paper.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#14212B` | Primary text, near-black with petrol undertone |
| `--ink-soft` | `#465866` | Secondary text |
| `--paper` | `#F4F1EC` | App background — warm desert paper, NOT white-Linear/Jira-blue |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--line` | `#E3DDD3` | Hairline borders — warm, not cool grey |
| `--petrol` | `#0E4C5C` | Primary brand & actions — deep petrol teal |
| `--petrol-deep` | `#093642` | Sidebar, headers, hover states |
| `--copper` | `#C4762C` | Signal accent: follow-up alerts, AI markers, active nav |
| `--gold` | `#D9A441` | In-progress highlights |
| `--sage` | `#3E7C59` | Success / Resolved |
| `--slate` | `#718096` | Closed / archived states |
| `--crimson` | `#B3261E` | Critical, destructive |

### Stage colors (lifecycle)
`NEW` slate-blue `#5B7C99` · `ANALYZING` gold `#D9A441` · `WITH_VENDOR` petrol `#0E4C5C` · `FOLLOW_UP` copper `#C4762C` · `RESOLVED` sage `#3E7C59` · `CLOSED` slate `#718096`

### Rules
- Copper is *earned attention*: only follow-up/AI/unread signals. Never decorative.
- Critical uses crimson sparingly; danger buttons confirm.
- Dark sidebar + light canvas = instant "which app am I in" distinction from all-white competitors.
- AA contrast verified for all text pairs (ink/paper 13.4:1, petrol/white 7.8:1, copper/white on dark 4.6:1 large-text only).

## 2. Typography — IBM Plex pairing (true bilingual parity)

- **Latin:** IBM Plex Sans (400/500/600) — engineered, formal, corporate.
- **Arabic:** IBM Plex Sans Arabic — same family DNA, equal weight, no fake parity.
- **Mono (issue codes, IDs):** IBM Plex Mono.
- Scale: 12/13/14(base)/16/20/28. Arabic rendered +1px effective line-height. Both fonts self-hosted (offline-capable, privacy).

## 3. Layout Geometry

- 8px spacing grid; max content width 1440px; page padding 24px.
- **Left sidebar (240px, `petrol-deep`, dark)**: wordmark, nav (Projects, Inbox Triage, Follow-ups Today, Meetings, Dashboards, Settings[admin]), user chip + language toggle bottom. Flips to right side in RTL.
- **Top bar**: breadcrumb (Project › view), search (⌘K/Global), quick-add issue button, profile.
- **Board**: columns = stages, card = white surface, priority pill, code (mono), avatar, due chip, copper dot if follow-up due. Tap-move fallback for mobile (select card → stage menu).
- **List**: dense rows 44px, sortable, sticky header, zebra-less hairlines.
- **Triage inbox**: split view — left queue, right preview + AI suggestion chips (application, vendor, priority) with Accept/edit per chip.
- **Issue panel**: right drawer (520px) over board — never a full-page jump; keeps context.
- Radius: cards 10px, buttons 8px, chips 999px. Shadows minimal (1 level, subtle).
- AI content: always shown in a panel with copper left-border + "AI-drafted — review before use" bilingual label.

## 4. Bilingual & RTL Standards

- Toggle in sidebar footer; persists per user (`User.locale`); `<html dir>` flips globally.
- Sidebar flips side, text-align flips, icons that imply direction (arrows/chevrons) mirror; media/code blocks stay LTR.
- Mixed-script lines: mono codes stay LTR via `dir="auto"` on user-content cells.
- Dates: `Intl.DateTimeFormat(locale)`. Numbers standard digits both locales for codes.
- One dictionary: `lib/i18n/dictionaries/{en,ar}.ts` — 100% screen coverage enforced by a completeness test (Constitution V).

## 5. Key Flows (click budgets per Constitution II)

- **Quick-add issue:** + button → drawer (title, project, priority) → Enter = 2 actions.
- **Move issue:** drag (or tap→stage). 1–2 actions.
- **Inbox → issue:** triage row → Accept suggestions → Convert = 3 actions.
- **Vendor email:** issue panel → "Draft vendor email" → review/edit → "Open in Outlook" = 3 actions. Outlook prefills recipient (mapping), subject (`[A7-0142] issue title`), body. Human sends.
- **Stand-up:** Meetings → today's Stand-up view = 1 action; pasted notes → summary in-line.

## 6. Empty/Error/Loading states (no exception policy)

Every list view ships a designed empty state (what this is + primary action). Errors surface as inline banners with actionable bilingual text, never raw codes. Loading uses skeleton rows — board columns show ≥3 ghost cards to avoid layout jump.

## 7. Responsive breakpoints

- ≥1280 full; 768–1279 sidebar collapses to icon rail; <768 sidebar becomes bottom sheet nav, board columns horizontal-scroll with snap, list rows wrap to 2-line cards, dashboards stack. Touch targets ≥44px everywhere.