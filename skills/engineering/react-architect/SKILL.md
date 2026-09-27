---
name: react-architect
description: "Use for React app architecture and performance."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [React, State, Performance, Hooks, Frontend]
    related_skills: [dotnet-architect, api-design-expert, performance-tuning-advisor]
---

# React Architect Skill

React application architecture and performance procedures: component and state design, data fetching patterns, rendering performance, and frontend structure for React 18+ apps. Source basis: facebook/react docs and patterns.

## When to Use
- Structuring a new React app or reviewing frontend architecture
- State management decisions (server state vs client state)
- Performance: render bottlenecks, memoization, bundle health
- Don't use for: visual design (frontend-design skill), backend APIs (api-design-expert)

## Procedure
1. **App structure.** Feature-first folders (features/orders/{components,hooks,api}); shared UI in a small design-system layer; no utils dumping ground. Completion criterion: structure documented; no cross-feature imports of internals.
2. **State decision table.** Server data -> TanStack Query/SWR (cache, retry, invalidation); URL -> router state; global client state -> Context or Zustand ONLY for genuinely shared UI state; local -> useState. No Redux by default without ADR. Completion criterion: state inventory mapped to owners.
3. **Data fetching discipline.** Query keys canonical; loading/error/empty states designed per screen; no waterfall fetches (parallel where independent); mutations invalidate precisely. Completion criterion: every screen handles error+empty, not just happy path.
4. **Render performance.** Profile before optimizing (React Profiler); memoize expensive computes (useMemo), stabilize callbacks (useCallback) only where measured; list virtualization beyond ~100 rows; code-split routes. Completion criterion: interaction < 100ms p95 on mid-range hardware; measured, not assumed.
5. **Bundle hygiene.** Analyze bundles; lazy-load heavy routes/libraries; tree-shake icon/utility imports; monitor bundle budget in CI. Completion criterion: initial JS under agreed budget (e.g., < 200KB gz) enforced.
6. **Component quality.** Components single-purpose; hooks extracted for reusable logic; no deeply nested prop drilling (compose or context); accessibility built-in (semantic elements, focus management). Completion criterion: review checklist passes on touched components.
7. **Testing strategy.** User-centric tests (Testing Library - test behavior not implementation); contract tests against API mocks; critical flows E2E. Completion criterion: coverage targets met per feature.

## Quick Reference
- **Server state is not client state:** most "state management pain" is missing a query library.
- **The 3 render killers:** new object/array/function props every render, effects with missing deps causing refetch loops, unvirtualized lists.
- **Keys:** stable IDs, never array index where list reorders.
- **Suspense + ErrorBoundary** per route as the default resilience layout.

## Pitfalls
- **Memoization spam:** wrapping everything without profiling adds complexity, not speed. Measure first.
- **Context for everything:** a mega-context re-renders the tree; split by concern or move to a store.
- **Effect abuse:** syncing state with useEffect chains - derive during render instead where possible.
- **Loading-state debt:** spinners everywhere, no skeleton/error design - perceived performance dies.

## Verification
- Profiler evidence for performance fixes; bundle budget green in CI.
- State inventory documented; every screen handles error/empty states.
- Feature structure rules hold (no internal cross-imports).

## Deeper Sources
- facebook/react + reactjs/react.dev (hooks, performance guidance)
- frontend-design skill (visual quality), api-design-expert (contract alignment)
