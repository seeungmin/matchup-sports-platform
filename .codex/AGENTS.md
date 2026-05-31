# Teameet Codex Rules

## Highest Priority Rule

Every task must begin by reviewing the project rules in `.codex/`.

Before starting analysis, implementation, refactoring, DB design, Prisma work, API design, frontend work, review, QA, or documentation work:

1. Read `AGENTS.md`.
2. Read `.codex/AGENTS.md`.
3. Read the relevant `.codex/*.md` rule files.
4. Read the relevant files inside `apps/v1_api` and/or `apps/v1_web`.
5. For UI or design work, read `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html`.

Do not assume architecture, API structure, database structure, Prisma schema, frontend patterns, or design conventions before the `.codex` review is complete.

## Valid Sources

Only these sources are valid for project analysis and implementation:

- Backend: `apps/v1_api`
- Frontend: `apps/v1_web`
- Design source of truth: `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html`
- Codex project rules: `.codex/*`

## Legacy Ban

Do not use legacy code, deprecated code, old API designs, old DB designs, old Prisma schemas, old migrations, old seeds, old mock data, or old screen designs as references.

If a similar feature exists outside `apps/v1_api` or `apps/v1_web`, ignore it unless the user explicitly asks for legacy cleanup or migration analysis.

## Conflict Order

If instructions conflict, follow this order:

1. `.codex/AGENTS.md`
2. `.codex/*.md`
3. `AGENTS.md`
4. v1 implementation evidence in `apps/v1_api` and `apps/v1_web`
5. Runtime configuration and package scripts

Legacy implementations never outrank v1 sources.
