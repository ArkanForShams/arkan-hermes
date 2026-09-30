---
name: voice-stt-setup
version: 1.0.0
category: productivity
description: "Use when setting up or fixing voice input (STT) for Hermes."
---

# Voice STT on This Hermes Install

Shams speaks to ARKAN via Telegram voice messages and wants local-only transcription
(privacy requirement: his voice never leaves this machine). Config alone is not enough —
verify the engine and the real code path.

## Setup / repair procedure

1. Check config: `~/.hermes/config.yaml` has an `stt:` block (enabled, language, model).
   There is NO `stt.provider` key — provider is auto-detected, and setting one is rejected
   as unknown. Local whisper is the first-priority provider once installed.
2. Check the engine, not just the config:
   `~/.hermes/hermes-agent/venv/bin/python3 -c "import faster_whisper; print(faster_whisper.__version__)"`
   If missing, install WITHOUT pip (the venv has no pip module):
   `uv pip install --python ~/.hermes/hermes-agent/venv/bin/python3 faster-whisper`
3. Test audio: do NOT rely on the `edge-tts` CLI — it can exit 0 while writing nothing.
   Generate test audio with Hermes's own text_to_speech tool instead.
4. Test the REAL code path (what voice messages actually hit):
   `cd ~/.hermes/hermes-agent && ./venv/bin/python3 -c "from tools.transcription_tools import transcribe_audio; print(transcribe_audio('<file>'))"`
   Expect `{"success": true, "provider": "local", ...}`. A GPU-attempt followed by CPU
   fallback is normal on this WSL box (no CUDA).
5. Commit the updated config.yaml to the archive repo so a restored machine inherits it.

## Pitfalls

- A sudden PC shutdown can corrupt the HuggingFace model cache — transcription then fails
  even though the engine imports fine. Fix: `rm -rf
  ~/.cache/huggingface/hub/models--Systran--faster-whisper-*` and let it re-download on
  next use.
- Verify transcription with real audio, never by config inspection alone — 'enabled' in
  config.yaml with a missing engine produces silent failure at message time.
- Model size trade-off: `base` is fast but fumbles proper nouns (transcribed 'ARKAN' as
  'Arcon'); `small` (~460MB) is the current model for better name accuracy — still local,
  still private, acceptable latency for short voice notes on CPU.
