# Buzz setup-script adjudication — 2026-10-07

## Scope reviewed

Reviewed without executing:

- `Justfile`
- `bin/activate-hermit`
- `scripts/dev-setup.sh`
- `.env.example`
- local Docker defaults

The source remains in the security quarantine area; no normal checkout or Buzz setup has been executed.

## Findings

1. `Justfile` invokes the pinned Hermit shims, Cargo, pnpm, Docker Compose, migrations, and desktop dependency installation. No hidden network destination or credential upload was found in the reviewed task definitions.
2. `bin/activate-hermit` is a shell activation wrapper. It invokes the repository's `bin/hermit` shim and evaluates the environment emitted by Hermit. This is a supply-chain boundary and must be reviewed/verified before sourcing it.
3. `scripts/dev-setup.sh` starts Docker, loads `.env`, runs migrations, seeds a local community, installs desktop/web dependencies, and installs Git hooks. It does not itself send data to a named remote endpoint, but it executes multiple repository-provided programs.
4. `.env.example` contains development credentials (`buzz_dev`, `buzz_dev_secret`, `buzz_dev_key`) and sets `BUZZ_BIND_ADDR=0.0.0.0:3000`. For this laptop setup, the bind address must be changed to `127.0.0.1:3000` before any service starts.
5. The setup script sources `.env`; therefore `.env` must be generated and reviewed locally, never copied from an untrusted external source and never populated with production secrets.
6. The development stack advertises local Keycloak/Adminer surfaces and uses development-only credentials. These must remain bound to localhost and must not be exposed through WSL port forwarding or a LAN interface.

## Conditional installation posture

The setup workflow appears consistent with a local development stack, but the repository-wide/runtime scanner findings are not fully cleared. The highest-value remaining review targets are:

- verify the repository's `bin/hermit` and other downloaded-tool shims before sourcing them;
- remove or exclude test-only files from the install review;
- enforce localhost binding in the generated `.env`;
- use a fresh, isolated Docker project and volume namespace;
- do not provide Hermes, GitHub, model-provider, or personal credentials to Buzz during first boot.

## Verdict

**Not cleared for automatic installation yet.** The safe installation boundary is understood, but execution still requires either a final focused review of the tool shims/dependency manifests or explicit risk acceptance. No Buzz process has been started.
