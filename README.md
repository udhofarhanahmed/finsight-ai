# FinSight AI

![Build Status](https://github.com/udhofarhanahmed/finsight-ai/actions/workflows/node.js.yml/badge.svg)

**FinSight AI** is a production-oriented financial intelligence platform for companies and analysts to ingest documents and data, run AI-powered extraction/interpretation, and get actionable insights with export-ready outputs.

## Why this exists

Finance teams spend too much time manually reading reports, extracting numbers, and preparing summaries. FinSight AI was created to:

- Ingest company financial documents and datasets quickly
- Extract important metrics and narratives using AI
- Generate executive summaries and statistics automatically
- Support extensible provider strategy (OpenAI, Vertex, Bedrock, Azure, OCR stacks)
- Power professional decision-making with analytics-ready outputs

---

## Core capabilities

- **Document Intelligence**: Analyze PDFs and extend to image/data documents through provider-driven extraction.
- **Financial Metric Extraction**: Pull KPI values (revenue, profitability, leverage, liquidity, etc.) with confidence metadata.
- **Executive Summaries**: Generate concise business-ready interpretations.
- **Platform APIs**: Discover capabilities/provider options and generate statistical summaries via `platform.*` procedures.
- **Deployment-ready Architecture**: Local Node runtime and Vercel-compatible serverless API path.

---

## Tech stack

- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Express + tRPC + TypeScript
- Database: MySQL + Drizzle ORM
- AI Layer: Forge/OpenAI-compatible SDK integrations
- Object storage: S3-compatible uploads/download URLs

---

## Quickstart

```bash
pnpm install
cp .env.example .env.local
pnpm db:push
pnpm dev
```

App runs at `http://localhost:3000`.

---

## API surface (tRPC)

Base path: `/api/trpc`

- `auth.me`, `auth.logout`
- `documents.upload`, `documents.list`, `documents.getDetail`, `documents.analyze`, `documents.delete`
- `platform.capabilities`, `platform.providers`, `platform.generateStatistics`

For details, see [docs/API.md](docs/API.md).

---

## Vercel deployment

This repo supports a split deployment model:

- static frontend from `dist/public`
- serverless API handler at `api/index.ts`
- rewrite of `/api/*` via `vercel.json`

See [docs/DEPLOYMENT_VERCEL.md](docs/DEPLOYMENT_VERCEL.md).

---

## Repository standards

- Contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Architecture notes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Product roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)

---

## License

MIT
