# API Guide (tRPC)

## Base path

`/api/trpc`

## Routers

### `auth`

- `auth.me`
- `auth.logout`

### `documents`

- `documents.upload`
- `documents.list`
- `documents.getDetail`
- `documents.analyze`
- `documents.delete`

### `platform`

- `platform.capabilities`
- `platform.providers`
- `platform.generateStatistics`

## Notes

- Protected procedures require authenticated user context.
- Large uploads should use async/batch ingestion architecture for production scale.
