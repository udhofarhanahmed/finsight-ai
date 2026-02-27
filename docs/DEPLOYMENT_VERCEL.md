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

## 5) Runtime & package-manager guardrails (important)

To avoid false-green builds and runtime surprises:

- Pin Node runtime compatibility in `package.json` engines (`22.x`).
- Allow required native install scripts for `esbuild` via pnpm config (`onlyBuiltDependencies`).
- In Vercel project settings, set **Node.js Version = 22.x** (not 24.x for this repo).

## 6) Why dashboard may look green while deployment is still broken

A green build often means only “compile step succeeded.” Deployment can still fail later because of:

- Missing environment variables.
- Runtime incompatibility (Node major mismatch).
- Install-time script restrictions (e.g., `Ignored build scripts: esbuild`).
- Pending/queued deployments masking an older failing job.

## 7) Validate deployment end-to-end

- Open `/` and confirm UI loads (no source file text response).
- Call `/api/trpc/system.health` with a valid tRPC payload.
- Upload a sample document and run analysis.
- Check function logs for runtime errors after first request.
