# Umaxica QA

umaxica.com の QA テスト統合リポジトリ。本番公開サイトに対して外形監視的な E2E テストを実行する。

## テスト種別

| ディレクトリ | ツール | 用途 | 状態 |
|---|---|---|---|
| `e2e/` | Playwright | E2E ブラウザテスト | 稼働中 |
| `bruno/` | Bruno | API テスト | 未実装（プレースホルダー） |

## 必要環境

- Node.js 20 以上（CI は 22）
- pnpm 10.27.0（`corepack enable` で有効化できる）

## E2E テスト (Playwright)

`e2e/` は独立した pnpm プロジェクト（ルートのワークスペースメンバーではない）。

```bash
cd e2e
pnpm install --frozen-lockfile
pnpm run install-browsers   # 初回のみ: playwright install --with-deps chromium
pnpm test                   # = pnpm exec playwright test
```

UI モードは `pnpm run test:ui`。レポートは `e2e/playwright-report/`（gitignore 済み）。

### Docker で実行

ブラウザ依存をホストに入れたくない場合:

```bash
cd e2e
docker compose run --rm playwright
```

## Lint & Format

ルートは [Vite+](https://vite.plus)（`vp` CLI、oxlint/oxfmt 内蔵）を使う。`pnpm install` では入らないため、
システムに一度インストールする:

```bash
curl -fsSL https://vite.plus | bash   # vp CLI（システムワイド）
pnpm run check                        # vp check (fmt + lint)
```

`vp` が未インストールでも E2E テストの実行には影響しない。

## CI

`.github/workflows/e2e.yml` が PR / main・develop への push / 毎日 00:00 UTC に Playwright を実行する。
本番サイトを直接叩くため CI では retries=2、navigation timeout 20s を設定している。
失敗時は Actions の `playwright-report` アーティファクトを参照。
