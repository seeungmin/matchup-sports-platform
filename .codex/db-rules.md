# V1 Database Rules

DB design and analysis must use only v1 sources.

## Allowed Sources

- `apps/v1_api/prisma/schema.prisma`
- `apps/v1_api/prisma/migrations`
- v1 API services and repositories in `apps/v1_api`
- v1 seed data under `apps/v1_api/prisma`

## Banned Sources

- Legacy DB schemas
- Legacy tables or columns
- Legacy ERDs
- Legacy migrations
- Legacy seed data

## Required DB Work Summary

For DB-related work, report:

1. Related tables
2. Related Prisma schema models
3. Change impact
4. Whether a migration is required
