# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Umaxica QA — a QA/test integration project for umaxica.com. Contains E2E browser tests (Playwright) and API tests (Bruno).

## Architecture

- **`e2e/`** — Playwright E2E browser tests (`example.spec.ts`), separate pnpm project with its own `package.json`
- **`bruno/`** — Bruno API tests (placeholder)

## Commands

### E2E tests (Playwright)

```bash
cd e2e
pnpm install --frozen-lockfile
pnpm run install-browsers   # 初回のみ
pnpm test                   # = pnpm exec playwright test
```

### Lint & format (oxlint / oxfmt)

```bash
pnpm install --frozen-lockfile
pnpm run check        # format:check + lint
pnpm run format       # oxfmt .
pnpm run lint         # oxlint .
pnpm run lint:fix     # oxlint --fix .
```

## Key Details

- TypeScript config uses ESNext target, bundler module resolution, strict mode, `noEmit: true`
- The `e2e/` directory is a standalone pnpm project (not a workspace member)
- Root `package.json` uses oxlint/oxfmt as devDependencies — no system-wide CLI needed; `pnpm install` is enough
- Lint/format config lives in `.oxlintrc.json` / `.oxfmtrc.json`
- E2E tests target production sites behind Cloudflare Access; without `CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET` the whole Playwright suite skips by design
