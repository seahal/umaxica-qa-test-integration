# Umaxica QA
（ ＾ν＾） Hello, World!

## 開発環境

このプロジェクトはDev Containerを使用します。VS Codeで開くと、自動的にコンテナ内で開発できます。

### 含まれるツール

- pnpm (最新版)
- k6 (負荷テストツール)

### 使い方

1. VS Codeでこのリポジトリを開く
2. "Reopen in Container"を選択
3. コンテナが起動したら、以下のコマンドでk6テストを実行:

```bash
k6 run test/sample.test.js
```

または、pnpmを使ってTypeScriptファイルを実行:

```bash
pnpm run index.ts
```
