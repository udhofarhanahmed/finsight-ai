# Contributing to FinSight AI

Thanks for contributing to **FinSight AI**.

## Development setup

```bash
pnpm install
cp .env.example .env.local
pnpm db:push
pnpm dev
```

## Branching and commits

- Create feature branches from `main`.
- Use clear commit messages, e.g. `feat(router): add platform providers endpoint`.
- Keep PRs focused and small when possible.

## Quality gates

Run before opening a PR:

```bash
pnpm test
pnpm build
```

If TypeScript checks are enabled for your changes, also run:

```bash
pnpm check
```

## PR expectations

- Describe motivation and implementation approach.
- Include screenshots/GIFs for visible UI changes.
- Note deployment/environment variable impacts.

## Security

Do not commit secrets, tokens, private keys, or production data.
