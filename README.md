# clawgate-loop-sandbox

**A regression fixture for the clawgate agent-dispatch pipeline. Not a real project.**

Its only job is to be a safe, controlled target for dispatched agents so the *pipeline*
can be tested without also gambling on whether some real task is still valid. Two pilot
candidates were burned that way (one was an unbounded ~501-error backlog, the other had
already been fixed and was pinned by a regression test) — this repo decouples
"does the loop work?" from "is this task real?".

## Design constraints (deliberate)

- **Zero dependencies.** `node --test` is built into Node 18+, so the suite runs with no
  `npm install`, no registry access, and no lockfile. One less variable between a dispatch
  and the failure mode being measured.
- **Node, not Go.** The agent image (`clawdbot:2026.5.7`) is Debian 12 + Node 22 —
  `go`, `gh`, `chromium` and `pnpm` are all absent. Node keeps the toolchain out of the
  experiment.
- **Trivially verifiable.** `npm test` exits 0 or it doesn't. That is the whole acceptance
  signal, which is what makes this usable as a server-side gate substrate later.

## Run the suite

```bash
npm test          # node --test test/*.test.js
```

`node --test test/` (a bare directory) behaves inconsistently across Node versions — the
explicit glob works on both Node 22 and 26. Keep it that way.

## What agents are asked to do here

Add small, pure functions to `src/` with matching tests in `test/`. Every function should be
dependency-free and every test should run under `node --test`. There is no build step and
no lint step on purpose — a failing `npm test` is unambiguous.

## Conventions

- ES modules (`"type": "module"`), `.js` extensions in imports.
- One module per topic in `src/`, one `*.test.js` per module in `test/`.
- Tests use `node:test` + `node:assert/strict`.
