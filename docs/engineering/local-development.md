# Local development

This repository is platform-neutral. The production app uses Next.js 16,
React 19, pnpm, and Vercel; Windows-specific paths found in old issue titles
are historical metadata, not runtime requirements.

## Prerequisites

- Git 2.41 or newer
- Node.js 22 LTS (the package minimum is 20.9)
- Corepack and pnpm 10.32.1
- Docker Desktop only when exercising the local Postgres stack

## macOS bootstrap

```bash
git clone https://github.com/rayleighko/thebearings.app.git
cd thebearings.app
corepack enable
corepack prepare pnpm@10.32.1 --activate
pnpm install --frozen-lockfile
cp .env.local.example .env.local
pnpm dev
```

Open <http://localhost:3000/regime>. The regime analyzer itself is
client-side and can be developed without Supabase or brokerage credentials.
Other routes and integrations require the corresponding values documented in
`.env.local.example`.

Before opening a PR, run:

```bash
pnpm typecheck
pnpm lint:all
pnpm test:ci
pnpm build
```

Use `docker compose up -d postgres` only when a task needs the local database.
See [docker-local.md](docker-local.md) for details.

## Git remote migration

Older clones may still point at the former `plancy-dev/cohort` repository.
Verify and repair the remote before fetching:

```bash
git remote -v
git remote set-url origin https://github.com/rayleighko/thebearings.app.git
git fetch --prune origin
```

Do not reset a branch with local work. Start new work from the current remote
main instead:

```bash
git switch -c codex/my-change origin/main
```

## AI engineering review

`.github/workflows/engineering-review.yml` is intentionally a thin consumer of
[`rayleighko/engineering-review-action`](https://github.com/rayleighko/engineering-review-action).
The shared repository owns the AI review policy, language profiles,
OpenCodeReview integration, security handling, and release process. Product
repositories should not duplicate that implementation.

This repository selects only the `typescript` profile. Automatic PR review is
currently disabled while the shared action is developed further. The workflow
can only be invoked manually, and its `enable_review` input defaults to
`false`.

Configure these under **Settings → Secrets and variables → Actions**:

| Kind | Name | Example / purpose |
| --- | --- | --- |
| Secret | `AI_REVIEW_LLM_URL` | `https://api.openai.com/v1/chat/completions` or an Anthropic endpoint |
| Secret | `AI_REVIEW_LLM_TOKEN` | Dedicated review-provider API key |
| Variable | `AI_REVIEW_LLM_MODEL` | Provider-compatible model name |
| Variable | `AI_REVIEW_USE_ANTHROPIC` | `true` for Anthropic, otherwise `false` |

These settings are optional while the integration is disabled. Even if a
maintainer manually sets `enable_review: true`, the workflow exits successfully
without calling the action when any setting is absent.

The current consumer is `workflow_dispatch` only. Do not restore a
`pull_request` or `pull_request_target` trigger until the shared action is
ready, the pinned SHA has been reviewed, and the four settings above are
configured. If a PR trigger is restored later, never check out or execute
untrusted PR head code in a job that can access these secrets. The shared
action reviews the diff without executing PR code. Reviews are advisory and
do not replace deterministic CI or human approval.

The consumer is pinned to the full commit SHA for
`engineering-review-action` v1.0.0. Upgrade it after reviewing the shared
action's release notes; OpenCodeReview version changes are owned upstream.
