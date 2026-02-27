# FinSight AI Architecture

## Overview

FinSight AI is a full-stack TypeScript application for ingesting financial documents, extracting structured signals with AI, and delivering analyst-friendly outputs.

## Components

- **Frontend**: React + Vite app (`client/`)
- **API backend**: Express + tRPC (`server/`)
- **Persistence**: MySQL via Drizzle ORM (`drizzle/`, `server/db.ts`)
- **Storage layer**: S3-compatible object storage abstraction (`server/storage.ts`)
- **AI services**: LLM/OCR integrations (`server/ai.ts`, `server/_core/*.ts`)

## Request flow

1. Client invokes tRPC endpoint.
2. Middleware resolves auth context.
3. Router delegates to business logic and storage/AI services.
4. Results are written to DB and returned to client.

## Deployment model

- Local/dev: Node server entrypoint at `server/_core/index.ts`
- Vercel: static frontend + serverless API handler at `api/index.ts`
