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
pnpm install
npx playwright test
```

### Lint & format (via Vite+ / vp)

```bash
pnpm run check        # vp check (fmt + lint)
pnpm run format       # vp fmt --write
pnpm run lint         # vp lint
pnpm run lint:fix     # vp lint --fix
```

## Key Details

- TypeScript config uses ESNext target, bundler module resolution, strict mode, `noEmit: true`
- The `e2e/` directory is a standalone pnpm project (not a workspace member)
- Root `package.json` uses Vite+ (`vp`) for linting and formatting (oxlint/oxfmt built-in)
- Vite+ requires the `vp` CLI installed system-wide (`curl -fsSL https://vite.plus | bash`)
