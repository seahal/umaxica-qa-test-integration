# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Umaxica QA — a QA/test integration project for umaxica.com. Contains E2E browser tests (Playwright) and API tests (Bruno).

## Architecture

- **`e2e/`** — Playwright E2E browser tests (`public.spec.ts`, `authenticated.spec.ts`), separate pnpm project with its own `package.json`
- **`bruno/`** — Bruno API tests (placeholder)

## Commands

### E2E tests (Playwright)

```bash
cd e2e
pnpm install --frozen-lockfile
pnpm run install-browsers   # 初回のみ
pnpm run test:public        # 認証不要（CI と同じ）
CF_ACCESS_CLIENT_ID=... CF_ACCESS_CLIENT_SECRET=... pnpm run test:auth
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
- E2E tests are split in two: `e2e/public.spec.ts` (no auth, runs in CI, asserts reachability + that Cloudflare Access protection is in place) and `e2e/authenticated.spec.ts` (needs a service token, skips entirely without `CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET`)
- Access service tokens are deliberately NOT stored in GitHub Secrets — never add them to a workflow
