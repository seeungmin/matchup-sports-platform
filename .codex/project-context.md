# Teameet Project Context

## Scope

This repository is operated in v1-only mode.

Only the following implementation targets are valid:

- Backend: `apps/v1_api`
- Frontend: `apps/v1_web`

The following paths are legacy or non-canonical for implementation reference:

- `apps/api`
- `apps/web`
- any deprecated or old-version design/API/DB documents

Do not inspect or copy legacy behavior unless the user explicitly asks for legacy removal, migration, or archival work.

## Design Source Of Truth

All design decisions must use this file as the first source of truth:

- `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html`

When implementation and design differ, prefer the design document unless the current v1 code proves a runtime constraint that must be preserved.

## Startup Routine

For every non-trivial task:

1. Determine whether the scope is `backend`, `frontend`, `both`, `infra`, or `docs`.
2. Read `.codex/AGENTS.md` and the relevant `.codex/*.md` files.
3. Read the relevant files in `apps/v1_api` or `apps/v1_web`.
4. For frontend/design work, compare against the Teameet Design HTML.
5. Implement only within the v1 scope unless explicitly requested otherwise.

## Response Order

For code analysis, explain:

1. Current structure
2. Problem
3. Improvement direction
4. Applied code or recommended code

For feature implementation, explain:

1. Modified files
2. Reason for change
3. Implementation method
4. Applied code summary

For DB work, explain:

1. Related tables
2. Related Prisma schema
3. Impact
4. Migration status
