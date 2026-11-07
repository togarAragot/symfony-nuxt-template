FROM oven/bun:1 AS base
WORKDIR /app
COPY ./apps/frontend/package.json ./apps/frontend/bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS dev
COPY ./apps/frontend .
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "bun install && bun --bun run dev --host 0.0.0.0"]

FROM base AS build
COPY ./apps/frontend .
RUN bun --bun run build