---
name: agile-coach
description: "Use for agile delivery: Scrum, Kanban, flow, ceremonies."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Agile, Scrum, Kanban, Flow, Retro, Scaled-Planning]
    related_skills: [pmo-advisor, engineering-leadership, risk-manager, program-manager]
---

# Agile Coach Skill

Agile delivery mechanics for IT teams - Scrum, Kanban, and lean flow consolidated, with scaled-coordination patterns sized for real IT departments (not enterprise ceremony bloat). Practical: ceremonies must earn their time; metrics must drive decisions.

## When to Use
- Setting up or fixing sprint/kanban mechanics for a delivery team
- Ceremonies running long or pointless; flow stalled; estimates contested
- Coordinating multiple teams (dependency syncs, quarterly planning)
- Don't use for: portfolio governance (pmo-advisor), delivery reporting (pmo-reporting), team leadership (engineering-leadership)

## Procedure
1. **Choose the fit.** Scrum (steady product increments, dedicated team) vs Kanban (continuous flow, varied demand, ops-heavy work) vs hybrid (sprint cadence + kanban board). Fixed-scope regulatory work may run sequential - say so openly. Completion criterion: working agreement per team documented.
2. **Board hygiene.** Workflow states match reality (not 12 columns of wishful thinking); every item has owner, size, and acceptance criteria; blocked items visible with reason and age. Completion criterion: board reviewed in walkthrough; no mystery columns.
3. **WIP limits.** Limit work in progress per state (start with: WIP <= people + 1 per column); finish > start is the whole game. Completion criterion: limits set, violations visible, aging items reviewed daily.
4. **Ceremonies that earn time.** Planning: capacity-checked, goal stated, NOT task-assignment theater. Daily: 15 min, blockers and flow, not status reporting to a lead. Review: working software only, stakeholders present. Retro: one improvement committed with owner, checked next retro. Completion criterion: timebox adherence >= 80%; retro actions actually closed.
5. **Flow metrics over velocity worship.** Track cycle time (start-to-done), throughput (items/week), WIP age. Forecast from throughput history, not story-point sums. Completion criterion: flow metrics on a visible chart; trends reviewed in retros.
6. **Estimation discipline.** Relative sizing (S/M/L or fibonacci) for conversation quality, not contract precision; re-estimate only when shape changes; #NoEstimates forecasting acceptable where throughput data is rich. Completion criterion: estimates used for slicing, never weaponized.
7. **Definition of Ready/Done.** Ready: testable, sized, dependency-free enough to start. Done: code reviewed, tests green, deployed or demonstrable - "done done", not "dev done". Completion criterion: definitions written, applied in review.
8. **Multi-team coordination (right-sized).** Monthly dependency sync across teams; quarterly planning session (PI-style, one day - not two-day theater): objectives per team, dependencies mapped, risks logged. Completion criterion: dependency board current; quarterly plan with named objectives.
9. **Agents in the flow.** AI agents (dev support, review assist, test generation) enter the board like any capacity: items tagged, output reviewed (code-review-expert), flow impact measured. Completion criterion: agent-assisted items tracked; review gates unchanged.

## Quick Reference
- **Flow beats utilization:** keeping everyone 100% busy creates queues; finish work faster instead.
- **A retro without a closed action is a complaint session.** One committed improvement per retro, checked next time.
- **Velocity is a planning signal, never a performance target** - targets corrupt estimates instantly.
- **Blocked > 2 days = escalate** (48-hour rule, risk-manager alignment).
- **Sprint goal one sentence:** if the team cannot state it, planning failed.

## Pitfalls
- **Ceremony theater:** meetings held because the framework says so. Every ceremony earns its slot or shrinks.
- **Velocity weaponization:** comparing teams or demanding velocity growth - estimates inflate, quality drops.
- **Pseudo-agile:** sprints as micromanagement rhythm; command-and-control with new vocabulary. Owners and teams decide how, leaders decide what.
- **SAFe bloat:** importing the full enterprise framework for 3 teams. Right-size coordination, not ceremony.
- **Zombie scrum:** events performed, improvement never happens - the retro loop is the heartbeat; lose it and agile is cosplay.

## Verification
- Working agreements, DoR/DoD documented; board reflects reality.
- Flow metrics trending; retro actions closing; timeboxes holding.
- Multi-team dependency board current; quarterly plan reviewed.

## Deeper Sources
- agilealliance guides (Scrum, Kanban, lean practice)
- ScaledAgile community concepts (PI planning, ART patterns - used right-sized)
- pmo-advisor (governance), engineering-leadership (people side), devops-architect (DORA metrics)
