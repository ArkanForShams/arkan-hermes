# Agent 007 Constitution

## Core Principles

### I. Spec-First, Always
No feature is coded before its requirement exists in `specs/`. When reality and spec diverge, the spec is updated the same day. Every document carries an as-of date. The spec is the single source of truth; memory and chat are not.

### II. Simplicity Is the Product
The founding complaint is: "existing tools are too complex/heavy (Jira-style overkill)." Therefore: every screen must be explainable in one sentence, every core flow completable in ≤3 clicks, zero mandatory configuration. A feature that adds complexity without removing work is rejected by default.

### III. Read-Only External Effects (NON-NEGOTIABLE until Phase 3)
The application NEVER sends email, posts messages, or mutates anything outside its own database. Outlook access is read-only (Mail.Read scope minimum). The AI drafts; the human reviews and sends from their own account. This principle protects AlMajdouie's email reputation and user trust. Lifting it requires Shams's explicit approval and a separate spec.

### IV. Privacy by Design (Amanah)
Company data flows only to: (a) the app's own database, (b) an LLM API operating under a no-training / zero-retention contract, (c) Microsoft Graph read-only APIs. No email content is persisted beyond what the issue requires. Vendor/application mappings and issue data are treated as confidential. Audit trail on every state change.

### V. Bilingual Parity — Arabic & English Are Equal
Every user-visible string exists in both languages from day one. Arabic renders RTL correctly — not as an afterthought but as a first-class layout mode. Language toggle persists per user. Dates, numbers, and names render correctly in both locales.

### VI. Production-Ready, Not Prototype
Auth with hashed passwords and httpOnly session cookies, role-based access control enforced server-side, input validation on every mutation, explicit error and empty states, database backups documented, CI-runnable tests. "It works on my machine" is not done.

### VII. Shariah-Aligned Operations
No riba-bearing features, no deceptive mechanics, no dark patterns. The tool serves honest work coordination. Data is held as amanah (trust). Business-logic decisions with Shariah implications are flagged to Shams; rulings go to qualified scholars, never to the app.

### VIII. Swap-Wired Boundaries
LLM provider, mail provider, and auth provider sit behind interfaces. Cloud LLM today, Azure OpenAI (AlMajdouie tenant) later; credentials auth today, Microsoft SSO later — each swap is a config change plus one adapter file, not a rewrite.

## Additional Constraints

- **Stack baseline:** Next.js (App Router, TypeScript) + Tailwind CSS + Prisma. Deviations require a written justification in plan.md.
- **Structural lineage:** Data shapes and flows are informed by production-grade skeletons studied in Clone Wars entries (Taiga's project/status model, Wekan's board model, Linear-style issue UX patterns). Visual identity, branding, naming, and design must NOT replicate any of these or any commercial product. All UI is original.
- **Naming:** "Agent 007" is the internal working brand; the wordmark is kept swappable (single config + one component) so a rename costs minutes, not weeks. Flag: "007" association with the Bond franchise is acceptable for internal-only use; revisit before any external use.
- **Roles:** Admin (Shams) > Team (works issues) > Viewer (departments, dashboards read-only). Enforced server-side, not just UI-hidden.

## Development Workflow & Quality Gates

- Spec → Plan → Tasks → Implement, in that order, per feature increment.
- Every phase ends with a verification step with real output (test run, build, or render check) — no "should work" claims.
- Defects found during E2E checks are fixed before new features are added.
- Lighthouse and mobile-viewport checks are release gates.

## Governance

This constitution supersedes ad-hoc preferences. Amendments require: written change in this file, version bump, and Shams's approval. Anything touching Principle III (external side effects) or VII (Shariah alignment) requires explicit sign-off from Shams or qualified scholars respectively.

**Version**: 1.0.0 | **Ratified**: 2026-10-05 | **Last Amended**: 2026-10-05