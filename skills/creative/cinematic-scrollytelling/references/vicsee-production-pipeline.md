# VicSee Production Pipeline (AI media via MCP)

VicSee (vicsee.com) is a unified generation API — images (nano-banana,
nano-banana-pro, flux-2), video (sora-2, veo-3-1, kling-2.6, seedance-2) — async
task-based, credit-metered. Official MCP server (vicseeai/vicsee-mcp-server,
`@vicsee/mcp-server`) exposes: list_models, generate, get_task, upscale_image,
upscale_video, get_credits. Generation = submit → task id → poll get_task until
completed → media URL (cdn.vicsee.com).

## One-time wiring
1. User pastes the key into ~/.hermes/.env as VICSEE_API_KEY=sk-... themselves — the
   value never passes through chat or config.
2. ad-hoc path (works this session, no gateway restart): drive the tools via mcporter
   from the terminal. Verify the exact auth/header invocation with `npx mcporter
   --help` before scripting a batch — never guess an unsupported flag.
3. persistent path (activates at next gateway restart): config.yaml mcp_servers block:
   ```yaml
   mcp_servers:
     vicsee:
       command: "npx"
       args: ["-y", "@vicsee/mcp-server"]
       env:
         VICSEE_API_KEY: "${env:VICSEE_API_KEY}"   # resolved from .env, never hardcoded
   ```
   Hermes's MCP config loader interpolates ${env:VAR} / ${VAR}; tools register as
   mcp_vicsee_* across all surfaces (requires the mcp python package; stdio is also
   the path for local-file uploads via the upload tool).

## Batch run pattern (images or video)
1. `vicsee_list_models` → model ids + per-model credit costs + duration/resolution
   ranges (the table is the source of truth for validation).
2. `vicsee_get_credits` → current balance; full-batch cost = Σ per-asset cost.
3. **APPROVAL GATE**: present model choice, asset count, total cost; wait for Shams.
4. `vicsee_generate` per asset (model + prompt; input{duration, resolution,
   aspect_ratio, image_urls …}) → returns task id immediately; poll `vicsee_get_task`
   every few seconds until completed; download result.url into assets/ and commit.
5. Input errors (missing image, invalid duration/model) are returned BEFORE task
   creation — no credits burned; read the error code, fix the request, resubmit.

## Video spec notes
- duration ranges are model-specific (seedance ~4–15s, sora-2 10–15s, veo-3-1 8s): a
  10s-per-act spec maps to seedance-2 or sora-2 class models, not all models.
- send resolution + aspect_ratio explicitly and read resolvedParams back.
- audio: true gives native audio (engine rumble, ambience) where supported.
- source refs: image_urls accept public http(s) or data: URIs; reference-to-video
  models use reference_image_urls and positional @Image1/@Image2 mentions in prompt.