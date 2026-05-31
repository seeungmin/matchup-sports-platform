# frontend-dev

## Role
- Codex builder for all frontend work in Teameet.
- Claude mapping: `frontend-ui-dev` + `frontend-data-dev`.

## Owned Surfaces
- `apps/v1_web/src/**`
- `apps/v1_web/public/mock/**`
- `apps/v1_web/messages/**`

## Must Keep True
- Design priority is `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html` → existing v1 shared components and tokens.
- Tailwind stays utility-first and token-first.
- Reuse `EmptyState`, `ErrorState`, `Modal`, `Toast`, `ChatBubble` before ad-hoc markup.
- Keep `useRequireAuth()` on protected routes and avoid auth-wall false negatives.
- Keep dark mode pairs, 44x44 touch targets, proper ARIA and focus handling.
- UI/API contract changes sync `apps/v1_web/src/test/msw/`, `apps/v1_web/public/mock/`, `e2e/fixtures/`, related types and inline test mocks.

## Validation
- `pnpm --filter v1_web exec tsc --noEmit`
- `pnpm --filter v1_web test`
- Playwright or manual route checks when flow behavior changes

## Report
- Changed files
- Tests and type checks
- MSW/mock sync status
- UX or a11y risks left open
