# Scrollytelling Prompt Pack (skeleton — copy per project)

Copy per project; every generated asset must trace to one of these four files.

## 1) image-keyframes.md
- SPEC LOCK block: one verbatim paragraph (subject, paint, setting, lens, cinematic
  grade, exclusions) pasted unchanged at the top of EVERY prompt in this file.
- Acts A1..An, each with 4–5 anchor prompts (camera angle, lighting, composition) tied
  to specific frame numbers on the grid (e.g. frames 1/6/11/16/20 of 20).
- 2–3 recovery frames with prompts (states to return to when complex motion fails).
- Batch runner command block + QA-gate reminder (vision pass per output).

## 2) video-prompts.md
- Per act shot card: duration, aspect/resolution, zero-cut rules ("single continuous
  unbroken shot, zero camera cuts, no transitions, no on-screen text, no logos"),
  camera path, TIMED beat sheet with named parts landing per beat, and the END STATE
  at t=duration written explicitly (next act's t=0 must match it).

## 3) antigravity-master-prompt.md (web build prompt)
- Tech stack: GSAP ScrollTrigger + Lenis smooth scroll (exact versions + CDNs).
- Canvas logic: one pinned full-viewport canvas; scroll progress (0→1) → frame index
  mapping (/assets/seq-N/seqX-###.jpg), cross-fade window between acts, dirty-flag
  drawing, DPR cap, debounced resize.
- Dual-belt video layer: currentTime scrubbed by act progress, never autoplay, muted
  + playsinline, lazy preload 1 chapter ahead, silent 404 fallback.
- Memory management: preload sequence 1 fully, lazy-load the rest 2-at-a-time.
- Art direction block: palette tokens, display type, panel/chip styling, accent ratio.
- Acceptance criteria: 60fps scrub, zero layout shift, mobile pin+scrub, no console
  errors, graceful asset fallbacks.

## 4) README.md
- Run order (manifest → batch → QA → video cards → build → QA), credit-cost gate
  reminder, and the standing rule: every act visibly advances the build; end-states
  chain; stand-ins are labeled.