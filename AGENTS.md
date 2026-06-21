# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Codex, Copilot, Windsurf, etc.) working in this repository. Read this before making changes.

## What this project is

Headless AdminApp is a TypeScript framework for building model-driven admin panels and back-office apps — conceptually similar to Dynamics 365 / Power Apps model-driven apps, but open source and web-native. You define an entity **schema** (attributes, types, validation) once, and the framework generates list views, forms, dashboards, boards, and calendars from it. The runtime (`core`, `app`) is UI-framework-agnostic; `fluent` is the first official UI implementation (Fluent UI). Server adapters exist for MongoDB and SQL (via Sequelize).

Public docs (separate repo): https://headless-adminapp.github.io/
Live demo: https://headless-adminapp-examples.vercel.app/
Quickstart boilerplate (separate repo): https://github.com/headless-adminapp/boilerplate

## Monorepo layout

pnpm workspace, packages versioned and published together via Lerna.

| Package                                                        | Purpose                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@headless-adminapp/core`                                      | Framework-agnostic runtime: schema/attribute definitions, the "experience" config layer (form, view, dialog, command, route, auth, locale, insights), transport types (`IDataService`, `Filter`, `Condition`), and stores (`SchemaStore`, client experience store). |
| `@headless-adminapp/app`                                       | UI-agnostic app-level building blocks composed on top of `core`.                                                                                                                                                                                                    |
| `@headless-adminapp/fluent`                                    | Fluent UI implementation layer — the ready-to-use component set most consumers install.                                                                                                                                                                             |
| `@headless-adminapp/icons` / `@headless-adminapp/icons-fluent` | Icon abstraction and its Fluent UI adapter.                                                                                                                                                                                                                         |
| `@headless-adminapp/next`                                      | Next.js integration helpers (routing, response formatting).                                                                                                                                                                                                         |
| `@headless-adminapp/server-sdk`                                | Server-side helpers, used with a storage adapter below.                                                                                                                                                                                                             |
| `@headless-adminapp/server-sdk-mongo`                          | MongoDB/Mongoose storage adapter.                                                                                                                                                                                                                                   |
| `@headless-adminapp/server-sdk-sequelize`                      | Sequelize (SQL) storage adapter.                                                                                                                                                                                                                                    |

## Tech stack & requirements

- Node >= 22, **pnpm only** — `preinstall` runs `npx only-allow pnpm`; do not generate or commit a `package-lock.json` or `yarn.lock`.
- TypeScript 5.5, built per-package with `tsc` (not bundled with esbuild/tsup) — see each package's `build` script.
- Lint: ESLint flat config (`eslint.config.mjs`) at the repo root, applies to `packages/**/*.{ts,tsx}`.
- Tests: Vitest, run per-package through Lerna.
- Publishing: `lerna publish` with npm provenance enabled — package versions are bumped by Lerna, not hand-edited.

## Common commands

Run from the repo root unless noted.

```sh
pnpm install                                   # install workspace deps
pnpm build                                     # lerna run build (all packages)
pnpm lint                                      # eslint . --ext .ts,.tsx
pnpm lint.fix                                  # same, with --fix
pnpm ts-check                                  # lerna run ts-check (tsc --noEmit per package)
pnpm test                                      # lerna run test
pnpm validate:bundle                           # builds a throwaway Next.js app against testing/bundle to catch packaging/peer-dep breakage

pnpm --filter @headless-adminapp/core build    # scope any script to one package
pnpm --filter @headless-adminapp/core ts-check
```

Before opening a PR, an agent should run `pnpm lint`, `pnpm ts-check`, and `pnpm test` for any package it touched (and `pnpm validate:bundle` if it changed public exports, peer deps, or build output).

## Core domain concepts

Understand these before editing `core` or `app` — they're the vocabulary the rest of the codebase (and consumer apps) is built on:

- **Schema** (`core/src/schema`) — describes an entity: `logicalName`, `idAttribute`, `primaryAttribute`, ownership (`scoped` vs `global`), and an `attributes` map. Built with `defineSchema()`.
- **Attributes** (`core/src/attributes`) — typed field definitions: `string`, `boolean`, `choice`, `date`, `dateRange`, `lookup`, `money`, `number`, `id`, `attachment(s)`, `mixed`. Each carries label, validation, and UI hints.
- **Experience layer** (`core/src/experience`) — declarative config for how a schema is presented: `form` (sections, tabs, quick-create/quick-view), `view` (list columns, quick filters), `dialog`, `command` (buttons/menu items/actions), `route`, `auth`, `locale`, `insights` (dashboards/widgets), `app` (navigation/layout).
- **Transport** (`core/src/transport`) — `IDataService`, `Filter`/`Condition`, `SortOrder` define how the UI queries data, independent of the storage backend.
- **Store** (`core/src/store`) — `SchemaStore` and the client experience store register schemas/config at app bootstrap; `server-sdk*` packages implement the server-side equivalent against Mongo or SQL.

Minimal schema example (mirrors the pattern used throughout the boilerplate and examples repos):

```ts
import { InferredSchemaType } from '@headless-adminapp/core/schema';
import { defineSchema } from '@headless-adminapp/core/schema/utils';

export const eventSchema = defineSchema({
  logicalName: 'events',
  label: 'Event',
  pluralLabel: 'Events',
  idAttribute: '_id',
  primaryAttribute: 'title',
  attributes: {
    _id: {
      type: 'id',
      label: 'ID',
      readonly: true,
      objectId: true,
      required: true,
    },
    title: { type: 'string', format: 'text', label: 'Title', required: true },
    status: {
      type: 'choice',
      label: 'Status',
      string: true,
      default: 'open',
      options: [{ label: 'Open', value: 'open' }],
    },
  },
});

export type Event = InferredSchemaType<typeof eventSchema.attributes>;
```

## Code conventions (enforced by ESLint, not optional style preferences)

- Use `import type` / `export type` for type-only imports/exports (`consistent-type-imports`/`exports` are errors).
- Import order is auto-sorted (`simple-import-sort`) — don't hand-order imports.
- No unused imports or vars; prefix with `_` only when intentionally unused.
- `no-floating-promises` is an error — always `await` or explicitly `.catch()`/`void` a promise.
- Avoid `any` (warns, but treat as a defect) — prefer the existing inferred/generic types in `attributes/inferred.ts` and `schema/inferred.ts`.
- Trailing commas required on multiline (`comma-dangle: always-multiline`).

## Boundaries — do not

- Don't hand-edit `version` fields in package `package.json` files — Lerna manages version bumps and publishing across the workspace.
- Don't add a new workspace package without updating `pnpm-workspace.yaml` and giving it the same `build`/`ts-check`/`test`/`clean` script shape as existing packages (see `scripts/buildPackageJson.ts` for how `dist/package.json` is generated at publish time).
- Don't introduce a second package manager or lockfile.
- Don't change a public export's shape without checking the docs repo and `testing/bundle` — `validate:bundle` exists specifically because peer-dependency or export breakage here breaks real consumer apps (currently validated against Next.js 16.2.6 / React 19 — see `testing/bundle` and the compatibility note in the docs installation page).
- Don't assume `yarn`/`npm` examples elsewhere (docs site, older READMEs) reflect this repo's tooling — this repo is pnpm-only; flag and fix such mismatches rather than copying them forward.

## Related repos an agent may need to cross-reference

- Docs site (Docusaurus): `headless-adminapp/headless-adminapp.github.io` — update alongside any public API change in `core`/`app`/`fluent`.
- Boilerplate starter: `headless-adminapp/boilerplate` — the reference "real app" wiring of schema + server SDK + Next.js; useful for verifying a change actually works end-to-end.
- Examples: `kishanmundha/headless-adminapp-examples` — deployed demo source.
