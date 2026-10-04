---
name: vps-hermes-remote-ops
description: "Use when reaching or standing up a remote Hermes host (VPS)."
version: 1.0.0
created_by: agent
---

# VPS Hermes Remote Ops (ARKAN)

Reaching and setting up a remote Hermes host (Hostinger or any VPS) over SSH, when the only initial access is a cloud-provider browser console. Secures Shams's iron rule: **the root/admin password never travels — not into chat, not into any tool.** Credentials move only through Shams's own hands into the target machine.

## Procedure

### Phase 1 — Key bootstrap (password-free handshake)
1. Generate a dedicated key locally if none for this purpose: `ssh-keygen -t ed25519 -a 100 -f ~/.ssh/id_<purpose> -N "" -C "arkan@shams-<host>"`. Note its fingerprint: `ssh-keygen -lf ~/.ssh/id_<purpose>.pub` — needed to test stored-vs-offered later.
2. Give Shams ONE short console block to paste in the provider's browser terminal — never multiple commands, never anything requiring his typing beyond paste. Keep the block under ~2 visible lines to survive browser-console wrapping: it appends the key to `/root/.ssh/authorized_keys` and `chmod`s both the dir (700) and file (600). Have it end with an echo marker (`KEY_INSTALLED_OK`) so "done" is verifiable.
3. If the console mangles long pastes (wrapped lines = corrupt key, silently stored), pivot to URL delivery: commit the public key to Shams's own repo (public keys in repos are safe) and give a one-line `curl -fsSL <raw-url> >> /root/.ssh/authorized_keys`. Raw-URL phantom-404 on fresh pushes: retry with the `refs/heads` URL shape before concluding failure (see browse-safe). Have the curl line end with a local fingerprint check of the stored file so the console shows what was actually saved.
4. Only after Shams confirms the marker AND a printed fingerprint match, test: `ssh -o BatchMode=yes root@<ip> 'echo OK'` — BatchMode guarantees password auth is never attempted; if it fails, NO password prompt must ever be answered.

### Phase 2 — Diagnosing key rejection (worked examples are fingerprints, not secrets)
- `ssh -v` and read exactly two lines: the OFFERED key's fingerprint (what our side presented) vs the server's continuation. Offered + refused = the stored key is wrong/corrupt OR sshd perms/StrictModes block the file — fix on the VPS side, do not regenerate blindly.
- Have Shams run in the console `curl -s ifconfig.me` + `ssh-keygen -lf /root/.ssh/authorized_keys` — the printed IP proves WHICH machine those commands actually ran on (multi-VPS panels make console-vs-target mismatch the top suspect), and the fingerprints prove what is stored. Compare against Phase 1's fingerprint; paste-back of those two lines is safe (fingerprints, not keys).
- Confirm the target IP against the provider panel's own VPS overview — a URL/port pasted as an IP (e.g. an HTTP dashboard address treated as the SSH host) burns a whole diagnosis cycle.
- sshd config side: `sshd -T | grep -E 'pubkeyauthentication|permitrootlogin|strictmodes'` in the same console visit; fix perms first (strictmodes rejects keys in world-writable dirs), config second.

### Phase 3 — Inspect before install (a "fresh" VPS may already run Hermes)
- Probe HTTP first if a URL was given: `curl -sI <url>` then the body — a Hermes dashboard title (`Sign in — Hermes Agent`, uvicorn) means Hermes is ALREADY installed: inventory it (`ls ~/.hermes`, `hermes --version`) instead of reinstalling; seed souls/config on top.
- Identify the OS via the SSH banner (`/dev/tcp` probe or `ssh -v`) — install commands differ (Ubuntu apt path for git, build tools).

### Phase 4 — Harden only after the key path is proven
Order matters: user → sudo → key-verified login as that user → THEN `PermitRootLogin no`/password-off and ufw (22 + 80 + 443). Reordering can lock the only key-holder out mid-setup.

## Pitfalls

- BatchMode everywhere until keys work; a hung password prompt IS an accidental password shipment.
- Verify "done" claims against machine behavior — if a marker was confirmed but the server still refuses, trust the debug trace over the chat and run the two-line console diagnostic; console output paste-back is the evidence channel that costs nothing.
- Browser consoles wrap long lines silently: shortest-possible paste blocks, echo markers, and console-side fingerprint proof turn every silent failure into a visible one.
- Bot tokens (st_arkan etc.) land ONLY on the target machine's own terminal (hidden read-prompt pattern), never here — same rule as profiles on this machine.
- Public-key materials (ed25519 pub text, SHA256 fingerprints) are safe in chat and in the archive repo; private keys are never printed, pushed, or quoted under any wording.