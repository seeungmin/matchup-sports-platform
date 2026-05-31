# 88. V1 Responsive Shell Hardening

Status: Draft / Active
Owner: Codex
Scope: `apps/v1_web`

## Goal

Make the v1 frontend responsive across mobile viewport widths without changing the existing visual design.

This task is a responsive stability pass, not a redesign. Colors, typography, card language, button styling, route IA, labels, and overall visual impression must remain unchanged.

## Decisions

- [x] Baseline screens:
  - `/home`
  - `/search`
  - `/matches`
  - `/team-matches`
  - `/teams`
  - `/my`
  - `/chat`
  - `/notifications`
  - `/notices`
- [x] Full viewport matrix:
  - `320`
  - `360`
  - `375`
  - `390`
  - `412`
  - `430`
  - `480`
- [x] Fast diagnostic viewport matrix:
  - `320`
  - `390`
  - `430`
- [x] Design preservation principle:
  - Preserve existing design and visual impression.
  - Only adjust responsive behavior, shell sizing, safe-area handling, wrapping, and layout tokens where needed.
- [x] Canonical shell direction:
  - Use v1 as the canonical shell direction.
  - Do not declare `tm-*` as the future canonical naming system.
  - Existing `AppChrome` may be evolved into the v1 canonical shell because most v1 screens already use it.
  - Existing `tm-*` classes are treated as a compatibility layer during migration, not as the long-term naming target.

## Non-Goals

- Do not redesign the UI.
- Do not change colors, typography scale, component radius, shadows, labels, or content hierarchy unless required to prevent breakage.
- Do not rewrite all `tm-*` classes in one broad rename.
- Do not change backend/API behavior.
- Do not alter v1 mock/data contracts unless a rendering bug proves the data shape is wrong.

## Current Findings

- [x] Shell width is inconsistent:
  - `AppChrome`/`tm-*` uses a `375px` frame.
  - `AppShell`/`v1-*` uses a `480px` frame.
- [x] `/search` bypasses both shells and defines an inline `375px` app frame.
- [x] Many pages use fixed `20px` side padding, which leaves only `280px` of content width at a `320px` viewport.
- [x] `/home` quick actions use a fixed four-column grid.
- [x] List summary/footer rows rely on one-line `space-between` layouts that can compress at narrow widths.
- [x] Fixed CTA, filter sheets, and toast surfaces need safe-area-aware bottom spacing.
- [x] `/chat` has special risks around fixed input bar, keyboard/safe-area, and swipe actions.
- [x] `/notifications` and `/notices` mostly risk fixed bottom overlap rather than broad layout failure.

## Implementation Plan

- [ ] 1. Add v1 shell/layout tokens while preserving current values.
  - Planned files:
    - `apps/v1_web/src/app/globals.css`
  - Expected behavior:
    - Existing visual result remains the same around `375px`.
    - Width, padding, topbar, bottom nav, CTA, and safe-area dimensions become token-driven.

- [ ] 2. Evolve `AppChrome` toward the v1 canonical shell.
  - Planned files:
    - `apps/v1_web/src/components/v1-ui/shell.tsx`
    - `apps/v1_web/src/app/globals.css`
  - Expected behavior:
    - Existing pages keep the same visual appearance.
    - Shell becomes responsive across `320-480px`.
    - Legacy `tm-*` class usage remains as compatibility where needed.

- [ ] 3. Bring `/search` under the same v1 shell sizing rules.
  - Planned files:
    - `apps/v1_web/src/components/search/search-experience.tsx`
    - `apps/v1_web/src/app/globals.css`
  - Expected behavior:
    - Search still looks like the current search page.
    - Search no longer owns a separate inline `375px` app frame.

- [ ] 4. Fix main-tab responsive pressure points.
  - Routes:
    - `/home`
    - `/matches`
    - `/team-matches`
    - `/teams`
    - `/my`
  - Expected behavior:
    - No horizontal overflow.
    - Home quick actions and list summary rows adapt at `320px`.
    - Cards, chips, and CTA rows preserve the current design language.

- [ ] 5. Fix utility responsive pressure points.
  - Routes:
    - `/search`
    - `/chat`
    - `/notifications`
    - `/notices`
  - Expected behavior:
    - Chat input bar is safe-area-aware.
    - Notification toast and fixed elements do not overlap bottom UI.
    - Search chips/cards do not compress poorly at `320px`.

- [ ] 6. Second pass for detail/create/edit/filter routes.
  - Routes:
    - `/matches/[id]`
    - `/team-matches/[id]`
    - `/teams/[id]`
    - `/matches/new/*`
    - `/team-matches/new/*`
    - `/teams/new`
    - `/matches/filter`
    - `/team-matches/filter`
    - `/teams/filter`

- [ ] 7. Validate.
  - Fast diagnostic:
    - `320`
    - `390`
    - `430`
  - Full matrix:
    - `320`
    - `360`
    - `375`
    - `390`
    - `412`
    - `430`
    - `480`

- [ ] 8. Restart affected server.
  - Restart `v1_web`.
  - Confirm `http://localhost:3013/v1` responds.

## Change Log

Record every change in this section before or immediately after editing.

### 2026-05-30

- Created task document for v1 responsive shell hardening.
- No frontend runtime code changed yet in this task.

## Backup / Rollback Map

Use this section to identify exactly what can be reverted if a step changes the design unexpectedly.

| Step | Files | Rollback Strategy |
| --- | --- | --- |
| Documentation setup | `.github/tasks/88-v1-responsive-shell-hardening.md` | Revert this task doc only if the work is abandoned. |
| Shell tokens | TBD | Revert CSS token block and class references from the same commit/diff chunk. |
| `AppChrome` shell update | TBD | Revert `shell.tsx` and matching CSS shell changes together. |
| Search shell alignment | TBD | Revert `search-experience.tsx` and matching search CSS changes together. |
| Page-specific fixes | TBD | Revert each route/component fix independently. |

## Validation Log

Record commands, route checks, and viewport observations here.

- Pending.

## Progress Snapshot

- Current step: planning/documentation setup before code edits.
- Next step: implement v1 shell/layout tokens with no visual redesign.

## Ambiguity Log

- Whether to fully rename legacy `tm-*` classes is intentionally unresolved.
  - Current decision: do not broad rename. Keep compatibility while introducing v1 shell direction.
