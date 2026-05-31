# V1 Frontend Rules

Frontend work must use only `apps/v1_web`.

## Work Order

1. Check the existing route/page structure in `apps/v1_web`.
2. Check existing components, hooks, types, and state patterns.
3. Read the Teameet Design HTML for the relevant screen or pattern.
4. Reuse existing v1 components before creating new components.
5. Implement with the smallest v1-scoped change.

## Design Contract

- The first design source of truth is `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html`.
- Do not use old design files or legacy screens as references.
- Do not create arbitrary UI that is not supported by the design HTML or existing v1 patterns.
- Keep components reusable and avoid duplicate one-off UI.

## Validation

- Run `pnpm --filter v1_web test` for changed frontend behavior when tests exist.
- Run `pnpm --filter v1_web build` or a type check when contract or route structure changes.
- For visual behavior, compare against the Teameet Design HTML.
