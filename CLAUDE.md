See @AGENTS.md for project overview, monorepo layout, commands, domain concepts, and conventions — that file is the canonical source and is kept tool-agnostic on purpose.

## Claude-specific notes

- This is a public open-source library, not an app — changes to `packages/core` and `packages/app` are public API changes. Treat them with the same care as a semver-sensitive release, even pre-1.0 churn.
- When asked to fix something, prefer the smallest correct change that keeps `pnpm lint`, `pnpm ts-check`, and the relevant package's `pnpm test` passing.
- If a task touches both this repo and the docs site (`headless-adminapp/headless-adminapp.github.io`) or the boilerplate repo, say so explicitly rather than silently leaving docs out of sync.
