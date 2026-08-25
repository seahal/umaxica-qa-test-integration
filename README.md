# Umaxica QA

umaxica.com の QA テスト統合リポジトリ。本番公開サイトに対して外形監視的な E2E テストを実行する。

## テスト種別

| ディレクトリ | ツール     | 用途               | 状態                       |
| ------------ | ---------- | ------------------ | -------------------------- |
| `e2e/`       | Playwright | E2E ブラウザテスト | 稼働中                     |
| `bruno/`     | Bruno      | API テスト         | 未実装（プレースホルダー） |

## 必要環境

- Node.js 20 以上（CI は 22）
- pnpm 10.27.0（`corepack enable` で有効化できる）

## E2E テスト (Playwright)

`e2e/` は独立した pnpm プロジェクト（ルートのワークスペースメンバーではない）。

テストは 2 層に分かれている。

| ファイル                | 認証               | 実行者           | 内容                                                         |
| ----------------------- | ------------------ | ---------------- | ------------------------------------------------------------ |
| `public.spec.ts`        | 不要               | CI（常時）       | 各ホストに到達でき、Cloudflare Access の保護が効いていること |
| `authenticated.spec.ts` | service token 必須 | ローカル（手動） | Access の内側の実コンテンツ・ルーティング・ヘルスチェック    |

対象サイトは全て Cloudflare Access の背後にある。service token を持たないと
全リクエストがログイン画面（HTTP 200）に差し替わり、`status < 400` 程度の検査は
偽陽性で通ってしまう。そのため `authenticated.spec.ts` は token 未設定時に
スイート全体をスキップする（黙って緑にしない）。

```bash
cd e2e
pnpm install --frozen-lockfile
pnpm run install-browsers   # 初回のみ

pnpm run test:public        # 認証不要（CI と同じ）

# Access の内側まで検査する場合（token はローカルにのみ置く）
CF_ACCESS_CLIENT_ID=... CF_ACCESS_CLIENT_SECRET=... pnpm run test:auth
```

UI モードは `pnpm run test:ui`。レポートは `e2e/playwright-report/`（gitignore 済み）。

### service token を CI に置かない理由

Access service token は Access を恒久的に素通りできる資格情報のため、GitHub Secrets には
登録しない方針。結果として CI は外形（到達性 + Access 保護の有無）までを保証し、
内側のコンテンツ検証は手元での手動実行に委ねる。

`public.spec.ts` は「Access のログイン画面が返ること」を assert しているので、
保護が意図せず外れた場合には CI が落ちる。逆にホストを意図的に公開する際は
`PROTECTED_HOSTS` から外し、実コンテンツの検査に置き換えること。

### Docker で実行

ブラウザ依存をホストに入れたくない場合:

```bash
cd e2e
docker compose run --rm playwright
```

## Lint & Format

oxlint / oxfmt をルートの devDependencies として持つ。システムワイドな CLI は不要で、
`pnpm install` だけで再現できる。

```bash
pnpm install --frozen-lockfile
pnpm run check          # format:check + lint
pnpm run format         # oxfmt . （書き換え）
pnpm run lint:fix       # oxlint --fix .
```

設定は `.oxfmtrc.json` / `.oxlintrc.json`。

## CI

`.github/workflows/ci.yml` が PR / main・develop への push / 手動実行 (`workflow_dispatch`) で走る。定期実行はしない（本番サイトの死活監視は別ツールに委ねる）。

- `lint` — `pnpm run check`（oxfmt + oxlint）
- `e2e` — `pnpm run test:public` のみ（service token を CI に置かないため）

本番サイトを直接叩くため CI では retries=2、navigation timeout 20s を設定している。
失敗時は Actions の `playwright-report` アーティファクトを参照。
