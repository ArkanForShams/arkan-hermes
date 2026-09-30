---
name: two-worlds
description: "Dual agent+human project plans; invoke at every new project."
version: 1.0.0
created_by: agent
---

# Two Worlds — Build for Agents AND Humans, One Project

Standing directive from Shams (2026-09-30): every digital product we build from now on
serves TWO audiences simultaneously — AI agents and human beings — in one codebase.
When he invokes this ("two worlds plan", "build for agents and humans", or at any new
project kickoff), follow this procedure exactly.

## 1. Researched ground truth (as of Sep 2026) — cite, don't re-research from zero

- **Agent protocol stack is LAYERED** (composing, not competing):
  - MCP (Anthropic) = tool/context layer; the HTTP of agentic commerce; broad adoption.
  - A2A (Google → Linux Foundation) = agent-to-agent comms; discovery via `/.well-known/agent.json` (Agent Cards).
  - UCP (Google+Shopify retail coalition) = commerce semantics; merchant publishes `/.well-known/ucp` manifest; live in Google AI Mode/Gemini.
  - ACP (OpenAI+Stripe) = checkout for ChatGPT surfaces; ~5 REST endpoints (create/update/get/complete/cancel checkout); SharedPaymentTokens; ~4% fee; merchant stays merchant-of-record.
  - AP2 (Google+60 partners) = payment authorization via cryptographic mandates (Intent/Cart/Payment, W3C Verifiable Credentials).
  - Merchant implementation order: MCP → ACP → UCP → A2A card → AP2.
- **The ceiling rule:** "An agent cannot transact more reliably than your product data allows it to decide." Structured knowledge (Schema.org JSON-LD, stable IDs, explicit prices/availability) is the HIGHEST-leverage work — above any protocol plumbing.
- **llms.txt is a hint file, not access control:** Google ignores it; ~97% get zero AI hits; but coding agents (Claude Code, Cursor) genuinely fetch it. Ship it cheap + keep accurate; never oversell it.
- **Agents don't reliably run JS:** decision-critical info must live in server-rendered semantic HTML + JSON-LD, not behind interactions or client-side rendering.
- **Agent recognition is becoming cryptographic:** Web Bot Auth (IETF draft, Cloudflare+Google) — HTTP Message Signatures with tag web-bot-auth, Signature-Agent header, key directories. Today: verify via UA + IP + reverse-DNS + behavior; design middleware to slot signatures in when live.
- **"No page view in the agent flow"** — agents don't need marketing pages; they need structured, deterministic exchanges.

## 2. Kickoff procedure per project

1. **Framing** (unless Shams answers in the invocation): What is the product? Who are its likely agent users? Does money change hands?
2. **Produce the Two-Worlds Plan** (§3 template) BEFORE writing code. Present, wait for approval.
3. **Build order:** shared core → agent surface → human surface → recognition middleware. Never build either surface by hacking the other.

## 3. Plan template (deliver exactly these sections)

| Section | Must define |
|---|---|
| Shared Core | Domain model, data schema (stable IDs, canonical entities), business logic, APIs both surfaces consume |
| Agent Surface | JSON-LD per entity; .well-known manifests (agent.json, ucp if commerce, llms.txt always); MCP tool list; read-then-act API; deterministic state machines; agent-safe error text |
| Human Surface | Emotional/immersive goals; journey states; visual system; micro-interactions; progressive disclosure of price math |
| Recognition | Signals ranked (WBA signatures > verified UA+IP > behavioral); routing: unknown agent → read-only; verified partner agent → act with mandates; human → rich UI |
| Governance | What agents may NEVER do (spend, contact third parties, irreversible ops) without signed mandate/human approval — mirrors ARKAN autonomy levels |
| Phases | Phase 1 MVP dual-surface; Phase 2 protocols; Phase 3 payments/mandates; Phase 4 advanced personalization |

## 4. Non-negotiables

- One codebase, two experience layers — never fork two entire products.
- Agents get correctness and speed; humans get story and feeling. Never blend the two interfaces.
- Recognition never gates READS for benign agents; it gates WRITES and money.
- Pricing/claims the agent reads must come from the same source of truth the human sees (consistency = trust).
- Update §1 when protocols shift; re-verify with a quick search at each major invocation.