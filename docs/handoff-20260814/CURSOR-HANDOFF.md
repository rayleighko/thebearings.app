# Cursor handoff — Bearings local continuation (2026-08-14 KST)

This document hands the current Codex desktop session to another Cursor
session. Verify the repository state before acting; do not assume this snapshot
is still current after fetching.

## Start here

```bash
cd /Users/rayleighko/Development/thebrearings
git status --short --branch
git remote -v
git fetch --prune origin
git log --oneline --decorate -8
```

Expected handoff branch: `codex/local-dev-engineering-review`, based on
`origin/main` at `37bffa0` (`feat(regime): result matrix + benchmark comparison
+ UX polish (#59)`). The canonical remote is:

```text
https://github.com/rayleighko/thebearings.app.git
```

GitHub CLI was authenticated successfully through the macOS keyring with
`repo` and `workflow` scopes. Re-check with `gh auth status`; never print the
token.

## Product and repository orientation

- Production Bearings surface: <https://www.thebearings.app/regime>
- GitHub repository: <https://github.com/rayleighko/thebearings.app>
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind, pnpm 10.
- `/regime` is a static English portfolio regime analyzer. PRs #58 and #59 are
  already merged into `main` and contain the client-side engine, benchmark
  overlays, result matrix, and PMF instrumentation.
- The repository still contains legacy Cohort product areas and naming. Do not
  perform a broad rename without an explicit task and migration plan.
- Option B remains a product invariant: information, tools, and education only;
  do not add personalized investment recommendations or buy/sell directions.

See [`../../README.md`](../../README.md) and
[`../engineering/local-development.md`](../engineering/local-development.md)
before running the app.

## Work completed in this branch

1. Corrected `origin` from the former `plancy-dev/cohort` URL to the canonical
   Bearings repository.
2. Added macOS/Linux/Windows bootstrap and remote-migration guidance in
   `docs/engineering/local-development.md`.
3. Updated the README title, Bearings production link, and local-development
   documentation link.
4. Replaced the direct OpenCodeReview consumer with a thin call to
   `rayleighko/engineering-review-action` v1.0.0, pinned to full SHA
   `66f5efffa411a355beebc5ba690c31154c580af5`.
5. Disabled that integration for normal PR events while the shared action is
   developed further. `.github/workflows/engineering-review.yml` now supports
   manual dispatch only, with `enable_review` defaulting to `false`.
6. Made AI review configuration optional. A manually enabled run skips cleanly
   if any required setting is absent.
7. Aligned `docs/engineering/local-development.md` with the live YAML: the
   consumer is `workflow_dispatch` only. It no longer claims
   `pull_request_target`. The future-restore warning remains: never execute
   untrusted PR head code in a job that can access review secrets.

The shared AI review action and its engineering policy are maintained at
<https://github.com/rayleighko/engineering-review-action>. Do not duplicate its
OpenCodeReview wiring or language policies in this repository.

## AI review configuration — deferred

No values were configured during this session. They are not required while the
workflow is disabled:

| Kind | Name |
| --- | --- |
| Secret | `AI_REVIEW_LLM_URL` |
| Secret | `AI_REVIEW_LLM_TOKEN` |
| Variable | `AI_REVIEW_LLM_MODEL` |
| Variable | `AI_REVIEW_USE_ANTHROPIC` |

When the shared action is ready, review its release notes, update the pinned
full SHA deliberately, configure the four settings, validate with a manual
dispatch, and only then restore a PR event trigger. Never execute untrusted PR
head code in a `pull_request_target` job that can access these secrets.

## Files in this change

These four paths are the intended project change:

```text
README.md
.github/workflows/engineering-review.yml
docs/engineering/local-development.md
docs/handoff-20260814/CURSOR-HANDOFF.md
```

There is also a pre-existing user-owned untracked directory:

```text
?? reddit-digests/
```

Do not add, edit, delete, stage, or commit `reddit-digests/` unless the user
explicitly asks. Stage project changes by explicit path, never with `git add .`.

## Verification already completed

Before the latest workflow-only adjustment, the following passed on current
`origin/main` plus the branch changes:

- `pnpm typecheck`
- `pnpm lint:all` — zero errors, three pre-existing unused-variable warnings
- `pnpm test:ci` — 604 passed, 4 skipped
- `pnpm build` — passed outside the restricted sandbox
- workflow YAML parse and `git diff --check`

The first sandboxed build failed because Turbopack could not bind a local port
(`Operation not permitted`); the same production build passed when run with
normal local permissions. This was an execution sandbox limitation, not a code
failure.

After reading this handoff, rerun at minimum:

```bash
ruby -e "require 'yaml'; YAML.parse_file('.github/workflows/engineering-review.yml')"
git diff --check
pnpm typecheck
```

Run the full CI suite if changing application code:

```bash
pnpm lint:all
pnpm test:ci
pnpm build
```

## Remote work snapshot

At the last inspection, open PRs were:

- #3 — large v2 change, 62 files, currently conflicting with `main`; rebase and
  split before considering merge.
- #10 — Option B compliance scan scope change; mergeable, but review whether it
  misses user-facing copy outside `src/app` and `src/components`.
- #11 — fixes wall-clock-dependent macro series tests; small and mergeable.

Treat this list as a snapshot. Refresh it before making decisions:

```bash
gh pr list --repo rayleighko/thebearings.app --state open
gh issue list --repo rayleighko/thebearings.app --state open --limit 100
```

## Recommended next-session sequence

1. Review the draft PR for this branch; merge only after the YAML remains
   `workflow_dispatch` only and the local-dev doc matches that trigger.
2. For the next product task, start from freshly fetched `origin/main` or rebase
   this branch after the PR lands.
3. Do not restore a PR event trigger or configure the four AI review settings
   until the shared action is ready and the pinned SHA has been reviewed.

## Suggested Cursor opening prompt

```text
Read docs/handoff-20260814/CURSOR-HANDOFF.md completely. Then inspect git
status, the current branch, origin/main, and the full uncommitted diff. Preserve
reddit-digests/ as user-owned untracked work. Confirm the engineering review
workflow remains manual-only and skips when AI review settings are absent.
Report verified state before proposing the next implementation task.
```
