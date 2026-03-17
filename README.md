# Umaxica QA

umaxica.com の QA テスト統合リポジトリ。

## テスト種別

| ディレクトリ | ツール | 用途 |
|---|---|---|
| `e2e/` | Playwright | E2E ブラウザテスト |
| `bruno/` | Bruno | API テスト |

## E2E テスト (Playwright)

```bash
cd e2e
pnpm install
npx playwright test
```

## Lint & Format

```bash
pnpm install
pnpm run check
```