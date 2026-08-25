# Copilot Instructions for Umaxica QA

## Build, test, and lint commands

The repository has two separate tool contexts:

- Root commands are for formatting and linting only:
  - `pnpm run check` — runs `format:check` + `lint`
  - `pnpm run format` — runs `oxfmt .`
  - `pnpm run format:check` — runs `oxfmt --check .`
  - `pnpm run lint` — runs `oxlint .`
  - `pnpm run lint:fix` — runs `oxlint --fix .`
- Formatting/linting needs no system-wide CLI: oxlint/oxfmt are root devDependencies installed by `pnpm install`.

- Browser tests live in the standalone `e2e/` project:
  - `cd e2e && pnpm install`
  - `cd e2e && npx playwright test`
  - Run a single file: `cd e2e && npx playwright test example.spec.ts`
  - Run a single test by name: `cd e2e && npx playwright test -g "has title"`

## High-level architecture

This repository is a QA/test integration repo for `umaxica.com`; it is not an application source tree.

- The root project is a minimal TypeScript shell used for repository-wide formatting and linting. `package.json` and `tsconfig.json` exist mainly to support that tooling.
- `e2e/` is a separate pnpm project with its own `package.json`, lockfile, and Playwright config. Treat it as an independent test package rather than a workspace member.
- Playwright is configured with `testDir: "."` and `testMatch: "**/*.spec.ts"`, so specs are expected directly inside `e2e/` unless that config changes.
- The current E2E suite exercises live external sites and domains such as `umaxica.net`, `umaxica.com`, `umaxica.org`, `umaxica.app`, and `www.umaxica.dev`. Tests validate page titles, visible text, redirects, and HTTP status responses.
- `bruno/` is intended for API tests, but it is currently just a placeholder and does not yet define runnable collections or scripts.

## Key conventions

- Keep root-tooling assumptions and E2E-tooling assumptions separate. Installing dependencies or running tests at the repo root does not configure the standalone `e2e/` project.
- The repository uses TypeScript with ESNext, `moduleResolution: "bundler"`, `strict: true`, and `noEmit: true` at the root. Follow the existing ESM-style imports and double-quoted strings in TypeScript files.
- Existing Playwright specs use plain `@playwright/test` tests in a single spec file and generate repeated coverage across multiple domains with `for ... of` loops. Reuse that pattern for cross-domain checks instead of duplicating nearly identical tests manually.
- Current E2E tests hit production-like public URLs directly rather than booting a local app. Avoid assuming a local dev server exists unless new project files explicitly add one.
