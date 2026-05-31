# V1 API Rules

API design and implementation must use only `apps/v1_api`.

## Work Order

1. Check whether the endpoint already exists in `apps/v1_api`.
2. Check the related Prisma schema in `apps/v1_api/prisma/schema.prisma`.
3. Check existing DTO, service, controller, guard, and error patterns.
4. Design the API using existing v1 naming and response patterns.
5. Implement and validate with the narrowest relevant tests.

## Contracts

- API prefix stays `/api/v1`.
- Response shape follows the existing v1 API envelope.
- Input validation uses DTOs and `class-validator`.
- Permission checks must use the existing v1 guard/service pattern.
- Do not copy API structure from legacy apps.

## Sync Requirements

When controller, DTO, service, or response contracts change, sync the relevant v1 frontend types/hooks/mocks and tests in the same change.
