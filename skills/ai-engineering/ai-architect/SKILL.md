---
name: ai-architect
description: "Use for agent and RAG system design decisions."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [AI-Architecture, Agents, RAG, Multi-Agent, Evaluation]
    related_skills: [ai-governance, caio-advisor, cto-advisor, hermes-agent]
---

# AI Architect Skill

Design patterns and decision procedures for production AI systems: single agent vs multi-agent, RAG architecture, model selection, evaluation, and reliability engineering. Framework-agnostic - patterns drawn from Semantic Kernel, AutoGen, CrewAI, and LangGraph. Does not set strategy (caio-advisor) or policy gates (ai-governance).

## When to Use
- Designing a new agent system or deciding single-agent vs multi-agent
- RAG architecture: chunking, retrieval strategy, reranking, grounding checks
- Model selection, cost/performance trade-offs, fallback chains
- Designing evaluations and reliability gates before production
- Don't use for: business case or portfolio decisions (caio-advisor), compliance policy (ai-governance)

## Procedure
1. **Requirements contract.** Write: task, success measure, failure tolerance, latency budget, data sensitivity, human-in-loop points. Completion criterion: contract reviewed by the task owner.
2. **Architecture decision - single vs multi-agent.** Default to ONE agent with tools. Add a second agent only when: genuine role separation exists (generator vs critic), context must be isolated, or parallelism pays. Completion criterion: ADR with reasoning and a revisit trigger.
3. **Orchestration pattern selection.** Router (one entry, dispatch), pipeline (sequential stages), debate/generator-critic (quality-critical), hierarchical planner-executor (complex goals). Map to a framework only AFTER the pattern is chosen. Completion criterion: pattern named with why-alternatives-failed.
4. **RAG design (if retrieval needed).** Ingestion -> chunking strategy (semantic over fixed; 300-800 tokens) -> hybrid retrieval (vector + keyword) -> rerank -> grounded generation with citation check. Completion criterion: retrieval recall tested on a golden question set (20+ real questions).
5. **Model tiering.** Route easy tasks to small models, hard ones to large; define fallback chain (primary -> cheaper -> graceful degradation). Completion criterion: cost-per-task estimate documented.
6. **Evaluation harness.** Golden test set, automated scoring where possible, LLM-as-judge with rubric where not, regression tests for every fixed failure. Completion criterion: evals run in CI or on every material change.
7. **Reliability gates.** Structured outputs with schema validation, retries with backoff, timeouts, circuit breakers, human approval for irreversible actions. Completion criterion: every external side effect passes a gate.
8. **Observability.** Log prompts, completions, tool calls, latencies, costs; trace multi-step runs. Completion criterion: one incident can be reconstructed from logs.

## Quick Reference
- **Multi-agent smell test:** if two "agents" just pass text without distinct roles or memory, it is one agent with extra steps.
- **RAG failure triage:** bad recall -> chunking/retrieval; bad grounding -> generation/prompting; bad freshness -> ingestion pipeline.
- **Cost levers (largest first):** cache repeated queries; shrink context; route to smaller models; batch where latency allows.
- **Framework choice:** Semantic Kernel (.NET/enterprise), LangGraph (stateful graphs, checkpointing), AutoGen (research/multi-agent conversation), CrewAI (role-based teams), plain Hermes orchestration (personal automation). Choose by language and operational maturity, not popularity.
- **Agent design for the Hermes department:** one agent per department function (Architecture, Analysis, Development, Backend, Support, IT Ops), each with defined tools, autonomy level, and report format.

## Pitfalls
- **Demo-to-production gap:** a pattern that works on 3 documents fails on 3,000. Load-test with real volumes.
- **Prompt-only fixes for data problems:** retrieval quality beats prompt cleverness. Fix chunking first.
- **Unbounded agent loops:** every autonomous loop needs a step budget, a stop condition, and a human gate on irreversible actions.
- **Evals as afterthought:** without a golden set, every prompt change is a gamble. Build evals BEFORE tuning.

## Verification
- Architecture doc exists: requirements contract, pattern ADR, model tiers, eval plan, gates.
- Golden evaluation set passes at the agreed threshold; regressions tracked.
- Every production side effect routes through an approval or validation gate.

## Deeper Sources
- microsoft/semantic-kernel (plugins, planner, memory patterns)
- microsoft/autogen (generator-critic, executor patterns)
- crewAIInc/crewAI (role-based crews)
- langchain-ai/langgraph (stateful workflows, checkpointing)
- openai/openai-cookbook + anthropics/prompt-eng-interactive-tutorial (prompt patterns)
