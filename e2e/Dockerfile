FROM mcr.microsoft.com/playwright:v1.58.2-noble

WORKDIR /e2e

# pnpm をインストール
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# 依存関係を先にコピーしてキャッシュを活用
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# テストコードをコピー
COPY . .

CMD ["pnpm", "exec", "playwright", "test"]
