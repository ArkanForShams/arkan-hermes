---
name: prompt-engineer
description: "Use for designing, testing, and tuning prompts."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Prompts, Evaluation, Reasoning, Structured-Output]
    related_skills: [ai-architect, research-agent]
---

# Prompt Engineer Skill

Systematic prompt design, testing, and optimization: structured prompts, few-shot selection, chain-of-thought and decomposition patterns, structured outputs, and regression testing of prompt changes. Patterns distilled from OpenAI Cookbook and Anthropic's prompt engineering tutorial. Not a general research workflow (use research-agent).

## When to Use
- Building or improving a production prompt (agent instructions, templates, system prompts)
- Diagnosing inconsistent or wrong model outputs
- Designing structured outputs (JSON schemas, extraction formats)
- Building eval sets for prompt regression testing
- Don't use for: retrieval/data quality issues (ai-architect RAG triage)

## Procedure
1. **Baseline before tuning.** Capture 10-20 representative inputs with current outputs; score them (rubric or pass/fail). Completion criterion: baseline score recorded - you cannot improve what you did not measure.
2. **Structure the prompt.** Role -> context -> task -> constraints -> output format -> examples. Put the most specific instructions last (recency effect). Completion criterion: every prompt has all six blocks or a documented reason not to.
3. **Fix failure classes one at a time.** Format failures -> explicit schema + one example. Reasoning failures -> decompose into steps or require reasoning before the answer. Hallucination -> require citations, allow "not found", ground in retrieved text. Inconsistency -> lower temperature. Completion criterion: one variable per iteration, re-scored each time.
4. **Few-shot selection.** 2-5 examples covering edge cases; diverse, correct, formatted exactly as the target output. Completion criterion: examples cover the three most common failure cases.
5. **Structured outputs.** Define JSON schema; validate every response; retry once on parse failure with the error shown to the model. Completion criterion: schema validation in place, parse-failure rate measured.
6. **Regression test set.** Every fixed failure becomes a permanent test case; run the set after every prompt change. Completion criterion: test set = baseline set + all fixes.
7. **Cost/latency pass.** Trim redundant context, move stable instructions to the system prompt, cut example count if quality holds. Completion criterion: token count reduced without score drop.

## Quick Reference
- **Order of leverage (highest first):** better task framing -> better context/data -> examples -> model choice -> prompt wording micro-tuning.
- **Reasoning patterns:** step-by-step before answer; plan-then-execute; self-critique (draft -> critique -> revise); decomposition (one sub-question per call).
- **Anti-patterns:** politeness padding, contradictory constraints, burying the instruction mid-paragraph, asking for multiple outputs in one breath.
- **Long-context:** put the question AND the answer format at the END of long inputs; restate key constraints after long context.

## Pitfalls
- **Vibes-based tuning:** changing prompts without a scored baseline. Always measure first.
- **Overfitting to examples:** the model copies example quirks into live outputs; keep examples generic on style, specific on format.
- **Instruction collision:** two rules that conflict ("be brief" + "explain thoroughly") produce unstable outputs. Resolve or priority-rank.
- **Prompt-as-patch:** when the underlying data is wrong, no prompt fixes it. Route back to RAG/data triage.

## Verification
- Baseline and post-change scores both recorded; regression set passes.
- Structured outputs validated in the production path, not just in testing.

## Deeper Sources
- openai/openai-cookbook (evals, structured outputs, RAG prompts)
- anthropics/prompt-eng-interactive-tutorial (reasoning, decomposition, long-context)
