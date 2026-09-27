---
name: ai-coding-advisor
description: "Use for AI-assisted coding standards and reviews."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [AI-Coding, Copilot, Delegation, Code-Review, Standards]
    related_skills: [ai-architect, prompt-engineer, ai-governance, devops-architect]
---

# AI Coding Advisor Skill

AI-assisted development procedures: code generation with review discipline, agentic coding delegation, code review with AI assist, and keeping engineers skilled while AI accelerates. The department's "how we code with AI" standard.

## When to Use
- Setting up AI-assisted coding workflows (Copilot-style assist, agent delegation)
- Reviewing AI-generated code with the right skepticism
- Defining what AI may and may not do in the delivery pipeline
- Don't use for: agent system design (ai-architect), prompt design detail (prompt-engineer)

## Procedure
1. **Define the AI boundary.** Assist modes: autocomplete/inline, whole-function generation, agent delegation (multi-file tasks), review assist. Map to autonomy: AI suggests -> human commits; AI drafts PR -> human reviews; AI runs tests/fixes -> human merges. Completion criterion: boundary doc agreed with team.
2. **Context quality.** AI output quality = f(context quality): clear task definition, conventions file (style, patterns, forbidden patterns), relevant files in scope, tests as specification. Completion criterion: repo conventions file exists and referenced in every delegated task.
3. **Generation workflow.** Spec or test first -> generate -> human review against checklist -> never commit unreviewed AI code. Small steps: function-level, not PR-level dumps. Completion criterion: no direct-to-main AI commits; review checklist in PR template.
4. **Review AI code harder than human code.** Check: security (injection, authZ), error handling (happy path only?), edge cases, dependency hallucination (nonexistent packages), license contamination, test coverage of the new path. Completion criterion: AI-code PRs pass the extended checklist.
5. **Agent delegation protocol.** Bounded tasks with: explicit scope, file list, test criteria, step/timeout budgets, stop conditions. Never: unbounded "improve the codebase", production data access without gates. Completion criterion: delegation template with budgets in use.
6. **Skill preservation.** Engineers write core domain logic themselves regularly; AI accelerates boilerplate, tests, migration, docs. Rotation ensures judgment stays sharp - the tool amplifies skill, never replaces it. Completion criterion: core-domain work by humans verified in rotation plan.
7. **Metrics.** Cycle time, PR throughput, defect rate per AI-assisted vs not; developer feedback. Completion criterion: metrics reviewed monthly; policy adjusted on evidence.

## Quick Reference
- **Trust gradient:** autocomplete < generated function < agent task < autonomous change. Review depth scales with autonomy.
- **Tests are the contract:** generate tests first where possible - they define "done" for AI output.
- **The hallucinated-package risk is real:** verify every new dependency exists and is maintained.
- **Context engineering beats prompt tricks:** right files + clear conventions > clever wording.

## Pitfalls
- **Review erosion:** "AI wrote it, looks right, merge" - the failure mode that ships vulnerabilities.
- **Skill atrophy:** juniors who only prompt never learn debugging. Deliberate manual practice retained.
- **Secret leakage via prompts:** code with credentials pasted into external AI tools. Boundary policy (ai-governance) enforced.
- **Agent sprawl:** unbounded agent tasks burning compute and creating unreviewable diffs. Budgets always.

## Verification
- Boundary doc live; PR template includes AI-code checklist.
- Delegation template with budgets in use; zero unreviewed AI-code merges.
- Metrics reviewed monthly with documented adjustments.

## Deeper Sources
- ai-architect (agent system design), prompt-engineer (prompt craft), ai-governance (tool boundaries)
- anthropics/prompt-eng-interactive-tutorial, openai/openai-cookbook (patterns)
