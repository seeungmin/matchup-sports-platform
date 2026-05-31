# V1 Prisma Rules

Prisma work must use only `apps/v1_api/prisma`.

## Allowed

- `apps/v1_api/prisma/schema.prisma`
- `apps/v1_api/prisma/migrations`
- `apps/v1_api/prisma/seed.ts`
- Prisma queries in `apps/v1_api`

## Banned

- Legacy Prisma schemas
- Legacy migrations
- Legacy seed scripts
- Legacy mock data
- Guessed model structures

## Work Order

1. Read the relevant model in `apps/v1_api/prisma/schema.prisma`.
2. Check existing v1 service queries.
3. Check existing v1 seed/test data.
4. Decide whether schema or migration work is required.
5. Keep frontend/API contract sync in the same change when model shape affects responses.
