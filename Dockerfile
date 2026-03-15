FROM mcr.microsoft.com/devcontainers/base:ubuntu

ARG PNPM_VERSION="latest"
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        gnupg \
        unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (LTS) via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm via corepack
RUN corepack enable pnpm \
    && if [ "${PNPM_VERSION}" != "latest" ]; then \
        corepack prepare pnpm@${PNPM_VERSION} --activate; \
    fi

# Install k6 CLI from official repository
RUN curl -fsSL https://dl.k6.io/key.gpg | gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
        > /etc/apt/sources.list.d/k6.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends k6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces
