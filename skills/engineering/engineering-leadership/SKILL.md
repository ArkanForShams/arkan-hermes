---
name: engineering-leadership
description: "Use for leading the dev team: 1:1s, growth, standards."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Team-Lead, 1on1, Delegation, Mentoring, Team-Health]
    related_skills: [code-review-expert, ai-coding-advisor, devops-architect, executive-coach]
---

# Engineering Leadership Skill

Leading a developer team: 1:1 rhythm, delegation for growth, standards enforcement, mentoring, team health, and difficult conversations. For Shams leading his IT application developers - distinct from executive-coach (his own executive presence) and program-manager (delivery mechanics).

## When to Use
- Running 1:1s, assigning work, growing developers
- Enforcing engineering standards without becoming the police
- Team health: on-call load, bus factor, skill gaps, attrition risk
- Difficult conversations with team members
- Don't use for: executive presence (executive-coach), project delivery (program-manager), PR standards (code-review-expert)

## Procedure
1. **Team health baseline.** Delivery metrics (DORA from devops-architect), on-call load distribution, bus factor per critical system (must be >= 2), skill map (who can do what - depth and desire), attrition signals. Completion criterion: baseline sheet; gaps named.
2. **1:1 rhythm.** Weekly or biweekly per person, never cancelled for "urgent" work - cancellation is the trust killer; their agenda first; one growth topic each session; commitments tracked and closed (follow-through rule). Completion criterion: notes kept; cadence held >= 90%.
3. **Delegation with intent.** Assign for growth, not just load: autonomy ladder per person per task type (do-with-me -> do-alone -> teach-others); success criteria stated up front; never silently take work back - renegotiate instead. Completion criterion: each member has a growth task in flight.
4. **Standards without policing.** Standards documented (code-review-expert checklist, dotnet/aspnetcore conventions); enforced by automation first (linters, templates, CI gates - devops-architect), conversation second; exceptions require a stated reason, not seniority. Completion criterion: enforcement is mostly automated; manual policing rare.
5. **Mentoring plan.** Per junior: rotation through core domain coding by hand (ai-coding-advisor skill-preservation rule), pairing sessions scheduled, progressive PR ownership (from nits to features), visible progression path. Completion criterion: per-person plan current; progression visible.
6. **Difficult conversations.** Within days of the issue, not months: specific behavior + concrete impact + agreed change + follow-up date; private, factual, no character verdicts; document the agreement. Completion criterion: conversations held timely; follow-up closed.
7. **Recognition and credit.** Public credit by name for team wins (stakeholder-advisor pattern, applied internally); report upward with the team named, not absorbed silently; correct privately. Completion criterion: upward reports name contributors.
8. **Work allocation justice.** Interesting work rotates; firefighting rotates; nobody is permanently the on-call martyr or the legacy-code exile. Completion criterion: allocation review monthly; imbalances corrected.

## Quick Reference
- **Bus factor >= 2** on anything critical - knowledge silos are resignations waiting to happen.
- **Praise publicly, correct privately** - and follow through on every promise made in a 1:1.
- **Hero culture is a leadership failure:** rewarding the firefighter while ignoring the preventer trains the wrong behavior.
- **The best tasks are not for the lead:** senior people take the hard unglamorous work sometimes; growth tasks go to the team.

## Pitfalls
- **Cancelling 1:1s:** each cancellation says "you are less important than my calendar" - trust compounds negatively.
- **Standards by memory:** undocumented expectations enforced by mood - unfair and unenforceable. Automate.
- **Avoiding hard conversations** until exit interviews: the pattern that loses good people silently.
- **Doing instead of delegating:** the lead who codes the hardest problems alone trains nobody and burns out alone.
- **Feedback only at review season:** annual feedback is archaeology; continuous, specific, small.

## Verification
- 1:1 cadence held; commitments from notes closed or renegotiated.
- Skill map and bus factor current; every critical system has >= 2 owners.
- Team health metrics reviewed monthly with one committed improvement.
- No silent take-backs of delegated work; growth tasks in flight for every member.

## Deeper Sources
- code-review-expert (standards), ai-coding-advisor (skill preservation), devops-architect (metrics)
- executive-coach (Shams's own presence upward - complementary, different direction)
