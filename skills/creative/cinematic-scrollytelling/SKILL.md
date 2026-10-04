---
name: cinematic-scrollytelling
description: "Build cinematic scroll-driven launch sites from AI media."
version: 0.1.0
author: ARKAN (for Shams Tabrez), Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [scrollytelling, GSAP, Lenis, image-sequences, AI-video, VicSee, launch-sites]
    related_skills: [webpage-visual-qa, creative-director, local-site-sharing]
---

# Cinematic Scrollytelling Builds (AI-media launch sites)

Scroll-driven brand/launch experiences built from AI-generated keyframe sequences and
video clips (e.g. a vehicle assembling from parts as the visitor scrolls). Production
chain: concept → asset manifest → batch generation → web build → per-act QA.

## Always-on rules (Shams's standing build preferences)
- **Assembly progress is the point**: every act/section must visibly advance the build —
  multiple parts landing per act, and no two adjacent stages resembling each other.
  Repeated states read to him as broken progress.
- **End-states chain**: the last state of act N must equal the first state of act N+1;
  write each act's END STATE explicitly into its shot card so generators have a target.
- **Disclose stand-ins**: procedural canvas stand-ins must be visibly labeled on the
  page and reported as stand-ins in chat — a silent placeholder gets read as a finished
  generated asset and creates false production reporting.
- **Cost gate before batch**: check credits and quote the full batch cost before any
  paid generation; nothing generates until Shams approves.
- QA each act with webpage-visual-qa; deliver links per local-site-sharing.

## Procedure
1. **Lock the SPEC in one clarify pass** (silhouette/direction, paint, environment,
   video engine). Every asset prompt opens with a SPEC LOCK block: a frozen verbatim
   paragraph (subject, paint, setting, lens, grade, exclusions) pasted unchanged into
   all prompts — regeneration drift comes from re-describing, never from pasting.
2. **Write the keyframe manifest**: 4–5 anchor prompts per act placed on the frame grid
   (e.g. frames 1/6/11/16/20 of 20); in-betweens are image-EDIT chains from the
   previous frame with small incremental deltas toward the next anchor. Include 2–3
   recovery frames — states the pipeline can return to when a complex motion fails.
3. **Write video shot cards as beat sheets**: per act — duration, zero-cut/unbroken
   rules, camera path, TIMED beats with named parts landing per beat, explicit end
   state at t=duration.
4. **Generate via VicSee** (references/vicsee-production-pipeline.md): images first
   (nano-banana-pro / flux-2), then video (veo-3-1 / seedance-2 / sora-2); poll task
   ids, download to assets/, commit.
5. **Build on the dual-belt pattern**: the scroll-scrubbed image sequence is the
   PRIMARY layer and must stand alone beautifully; video is an ambient cross-fade top
   layer scrubbed via currentTime mapped to act progress (never autoplay, muted,
   playsinline, lazy-preload 1 chapter ahead, silent fallback when a clip is absent).
   Use templates/scrollytelling-prompt-pack.md for the build-prompt skeleton.
6. **QA per act scroll state**, fix, cache-bust (?v=N), re-verify (webpage-visual-qa).

## Pitfalls
- **Derive act index + intra-act progress in ONE place and clamp the last act** —
  `Math.min(3.999, t*4)` style clamping: floor() at exactly 1.0 indexes an act that
  does not exist and blanks the final frame.
- **Label ungenerated asset slots in-page** — never ship silent empty <video> or
  broken-asset states; a labeled stand-in preserves trust while assets await keys.
- Image batches need a usable image-API credential before firing; the credential
  check is step zero of any batch runner (fail with instructions, not silence).