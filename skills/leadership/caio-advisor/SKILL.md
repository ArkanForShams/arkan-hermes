---
name: caio-advisor
description: "Use for AI strategy, governance, and CAIO-level decisions."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [CAIO, AI-Strategy, Operating-Model, Board-Readiness]
    related_skills: [ai-governance, cto-advisor, executive-coach]
---

# CAIO Advisor Skill

Advisory skill for shaping enterprise AI strategy, the AI operating model, and the CAIO role itself. Produces board-ready artifacts: strategy on a page, maturity baseline, portfolio triage, and executive briefings. It does not design agent internals (use ai-architect) and does not issue compliance rulings (use ai-governance + qualified counsel).

## When to Use
- Drafting or refreshing an enterprise AI strategy or AI operating model
- Preparing board / C-suite AI briefings or investment cases
- Prioritizing an AI initiative portfolio; running a maturity assessment
- Coaching toward CAIO readiness (with executive-coach for presence skills)
- Don't use for: agent/RAG design details (ai-architect), policy gates (ai-governance)

## Procedure
1. **Frame the outcome.** State the business problem in cost, revenue, risk, efficiency, or strategy terms. Completion criterion: one sentence a non-technical executive would endorse.
2. **Baseline maturity** (1 Aware / 2 Piloting / 3 Scaling / 4 Managed / 5 Transforming) across: leadership alignment, data readiness, talent, governance, delivered value. Completion criterion: scored table with evidence per score.
3. **Triage the portfolio:** Quick wins (<90 days, visible value), Structural (6-18 mo, capability building), Watchlist (park with trigger conditions). Completion criterion: every initiative has a lane and an owner.
4. **Design the operating model.** Hub-and-spoke vs centralized vs federated; map teams to functions (for Shams: Business Architecture, Analysis, Development, Backend, Support, IT Ops staffed by agents; he delegates, designs agents, reviews reports). Completion criterion: role/agent map with decision rights.
5. **Build the value case.** Estimate cost-to-run vs value delivered (time saved, error reduction, revenue lift); state assumptions explicitly. Completion criterion: assumptions list attached to every number.
6. **Sequence a roadmap:** 90-day proof sprint, 12-month capability plan, 3-year transformation arc. Completion criterion: dates, owners, and kill criteria per phase.
7. **Set governance handoff.** Route risk tiers, approval gates, and evaluation standards to ai-governance. Completion criterion: gates named before any production deployment.
8. **Prepare the executive brief.** Structure: situation → options (with trade-offs) → recommendation → ask. Three numbers maximum. Completion criterion: rehearsed once aloud.

## Quick Reference
- **Maturity evidence rule:** a level is claimed only with an artifact (doc, dashboard, incident log) proving it.
- **Business translation table:** model accuracy → decision quality; token cost → cost per task; latency → customer wait time; eval harness → risk reduction; agent uptime → workforce reliability.
- **Board brief skeleton:** 1 slide context, 1 slide options, 1 slide recommendation + ask, appendix for proof.
- **Operating model heuristics:** centralized hub for standards/platform, embedded spokes for delivery, federated governance for regulated domains.

## Pitfalls
- **Pilot purgatory:** demos that never reach production because no owner, no eval, no integration path. Kill or graduate every pilot in 90 days.
- **Tool-first thinking:** strategy built around a vendor's roadmap instead of business outcomes.
- **Governance as an afterthought:** retrofitting controls after deployment costs multiples of building them in.
- **ROI theater:** projected savings without baseline measurement. Measure the before-state first.

## Verification
- Strategy doc exists with value case, portfolio lanes, roadmap, and named governance gates.
- Every active AI initiative has an owner, a metric, and a review date.
- Executive brief delivered and questions anticipated in prep (log them for the debrief).

## Deeper Sources
- Azure-Samples/AI-Foundry-Samples (enterprise patterns, RAG, evaluation)
- microsoft/architecture-center (AI reference architectures)
- microsoft/autogen, crewAIInc/crewAI, langchain-ai/langgraph (multi-agent operating patterns)