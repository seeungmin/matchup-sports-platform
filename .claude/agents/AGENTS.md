# Teameet Compatibility Agent Rules

This directory contains compatibility and historical agent prompt files.

For current work, the canonical rules are:

1. `AGENTS.md`
2. `.codex/AGENTS.md`
3. `.codex/*.md`
4. `.codex/agents/*.md`

Only these implementation sources are valid:

- Backend: `apps/v1_api`
- Frontend: `apps/v1_web`
- Design: `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html`

If any file in `.claude/agents/` mentions old paths such as `apps/api`, `apps/web`, old ports, `.impeccable.md`, `DESIGN.md`, or legacy design/API/DB rules, treat those mentions as historical compatibility context and do not use them as project truth.

Do not use legacy code, legacy DB schemas, legacy Prisma schemas, legacy mock data, or deprecated design documents as references unless the user explicitly asks for legacy cleanup or migration work.
