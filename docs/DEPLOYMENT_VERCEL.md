# Deploying FinSight AI on Vercel

## 1) Import repository

Connect the GitHub repository in Vercel and choose the project root.

## 2) Build settings

- Build Command: `pnpm build`
- Output Directory: `dist/public`

## 3) Environment variables

Configure all required variables from `.env.example`, including:

- `DATABASE_URL`
- `VITE_APP_ID`
- `JWT_SECRET`
- `OAUTH_SERVER_URL`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `OWNER_OPEN_ID`

## 4) API routing

`vercel.json` rewrites `/api/*` to `api/index.ts`.

## 5) Validate deployment

- Open `/` and confirm UI loads (no source file text response).
- Call `/api/trpc/system.health` with a valid tRPC payload.
- Upload a sample document and run analysis.
