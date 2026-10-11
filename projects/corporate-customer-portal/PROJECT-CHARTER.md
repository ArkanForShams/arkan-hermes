# Corporate Customer Portal — Project Charter

**Sponsor:** Shams Tabrez
**Date:** 2026-10-11
**Status:** Discovery active
**Primary collaboration environment:** Local Buzz Workspace
**Buzz project channel:** `Corporate Customer Portal`
**Buzz channel ID:** `369b68ff-02cb-48ea-b473-d65b7e134040`
**Source BRD:** `/home/shams/.hermes/cache/documents/doc_f7ebe51516b6_CCP BRD v1.0.md`
**Agency role source:** `/home/shams/hermes-workspace/agency-agents-safe/`

## Operating model

Three generic Hermes workers are used:

- `dynamic-worker-1`
- `dynamic-worker-2`
- `dynamic-worker-3`

Workers receive temporary roles selected from the quarantined Agency Agents catalog for each phase. The role text is capability data and does not override Hermes safety, privacy, or approval rules.

## Current dynamic assignments

1. `dynamic-worker-1`: Product Manager + Business Analyst capability — discovery, scope, personas, journeys, requirements, assumptions.
2. `dynamic-worker-2`: Software Architect + Integration Architect capability — solution boundaries, source-of-truth model, integration catalogue, ADRs.
3. `dynamic-worker-3`: Security Architect + Data Privacy Officer capability — threat model, PDPL/NCA control mapping, data governance, review challenge.

## Sequential gates

1. Discovery baseline and open questions.
2. Architecture baseline derived from approved discovery.
3. Security/privacy challenge and architecture gate.
4. Consolidated Phase 1 package for sponsor review.

## Safety constraints

- No new API keys, provider credentials, or Telegram bot tokens.
- Use existing Hermes provider and local Buzz relay only.
- Do not place secrets, identity documents, payment data, or credentials in Buzz messages or project documents.
- No external messages, production changes, spending, or irreversible actions without explicit approval.
- Preserve existing uncommitted changes in the Buzz repository.
