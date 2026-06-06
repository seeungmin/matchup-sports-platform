# 90. Match Detail UX Polish

Date: 2026-06-04
Owner: codex
Status: complete

## Scope

- Backend: `apps/v1_api/src/matches`, `apps/v1_api/prisma`
- Frontend: `apps/v1_web/src/components/matches`, `apps/v1_web/src/hooks`, `apps/v1_web/src/types`
- Scenario docs: `docs/scenarios/03-match-flows.md`

## Requirements

- [x] Match detail share and notification buttons must be clickable.
- [x] Match deadline time must persist and be returned from API responses.
- [x] Match participant count includes the host who created the match.
- [x] Match detail should not show a separate application-method info row.
- [x] Approved state is shown in the bottom application-status area.
- [x] Match detail should not show the description text block.
- [x] Participant section shows the match creator only.
- [x] Host can navigate to the existing match management surface.
- [x] Bottom chat entry is available only after match participation is approved.

## Validation

- [x] `pnpm --filter v1_api exec tsc --noEmit`
- [x] `pnpm --filter v1_web exec tsc --noEmit`
- [x] Focused browser smoke for `/matches/:id` when local runtime is available.

## Progress Snapshot

- 2026-06-04: Task opened from user feedback on match detail page.
- 2026-06-04: Implemented v1 match detail polish. Share/notification now have actions, deadline eligibility is enforced, detail participants show only the host, description/application-method rows are removed, approved state is shown in the bottom status area, and chat is only rendered for approved participants.
- 2026-06-05: Responsive route smoke covered `/matches/match-1` at 320/390/430 widths with 0 issues. Report: `output/playwright/v1-responsive-smoke/responsive-rerun-match-320/report.md`.
