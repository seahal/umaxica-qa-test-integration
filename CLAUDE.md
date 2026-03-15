# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Umaxica QA — a QA/test integration project for umaxica.com. Contains load tests (k6), browser tests (Playwright), and a minimal Hono-based Cloudflare Workers app. Development uses Dev Containers with pnpm and k6 pre-installed.

## Architecture

- **`src/index.ts`** — Hono web app targeting Cloudflare Workers
- **`load_test/`** — k6 load test scripts (`script.js`, `two.js`, `three.js`) that hit `https://umaxica.com/`. Has its own `compose.yml` using `grafana/k6:master-with-browser` image
- **`browser/`** — Playwright browser tests (`example.spec.ts`), separate pnpm project with its own `package.json`
- **`Dockerfile` + `compose.yml`** — Dev container setup (Node LTS, pnpm, k6)
- **`.github/workflows/terraform.yml`** — Terraform CI/CD (init/plan on PR, apply on push to main)

## Commands

### Load tests (k6)
```bash
# Run from load_test/ directory or use the k6 docker image
k6 run load_test/script.js
k6 run load_test/two.js
k6 run load_test/three.js
```

### Browser tests (Playwright)
```bash
cd browser
pnpm install
npx playwright test
```

### Run TypeScript files
```bash
pnpm run index.ts
```

## Key Details

- TypeScript config uses ESNext target, bundler module resolution, strict mode, `noEmit: true`
- The `browser/` directory is a standalone pnpm project (not a workspace member)
- k6 test scripts use `https://jslib.k6.io/k6-testing/0.5.0/index.js` for assertions
- Load test default: 1 VU, 30s duration
