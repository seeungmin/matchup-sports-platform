# SM New API/DB Baseline Declaration

## Status

```text
Status: baseline declaration
Design baseline: Team Design > 1차 디자인 완료
Scope: API/DB planning only
Implementation status: not implemented
Schema status: not a migration spec
API status: not an endpoint contract
```

This document fixes the starting point for SM New API and DB planning. It does
not approve Prisma schema changes, endpoint contracts, DTOs, migrations, or
frontend integration work.

## Canonical Baseline

The only product/design baseline for SM New API and DB planning is:

```text
docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html
Team Design > 1차 디자인 완료
SMNewViewerGuide > 1차 디자인 완료
SM_FIRST_DESIGN_COMPLETE_SECTIONS
```

The current section set is:

```text
core-shell-sm-final
auth-onboarding-sm-final
home-discovery-sm-final
home-notice-sm-final
matches-core-sm-final
matches-core-sm-create-final
teams-team-matches-sm-revision-4
teams-team-matches-sm-create-final
team-browse-sm-revision-5
community-sm-final
my-profile-trust-sm-revision
payments-support-sm-revision
settings-states
public-marketing-sm-revision
desktop-web
admin-ops-sm-revision
common-flows-motion
```

Any API/DB design derived from a different section set must be marked
`reference-only` or `deprecated-priority`.

## Document Priority

Use the following order when documents disagree:

1. `Teameet Design.html` in `Team Design > 1차 디자인 완료` mode.
2. `docs/reference/sm-new-api-db-baseline.md`.
3. `docs/reference/team-design-first-design-db-plan.md`.
4. `docs/reference/handoff-sm-new-direction-review.md`.
5. `docs/reference/handoff-sm-new-direction/0502-design-freeze-brief.md`.
6. `docs/reference/handoff-sm-new-direction/prototype-system/MODULE_MAP.md`.

Current implementation docs under `docs/api/` and current code under
`apps/api/` are evidence for feasibility and drift only. They are not SM New
product requirements.

## Reference-Only Sources

The following sources may be read, but must not override the baseline above:

- Existing Prisma schema: `apps/api/prisma/schema.prisma`.
- Existing Nest controllers, DTOs, services, and tests under `apps/api/src/`.
- Existing frontend routes, hooks, and types under `apps/web/src/`.
- Existing API integration docs under `docs/api/`.
- Existing product/design rules in `DESIGN.md`, `.impeccable.md`, and
  `apps/web/src/app/globals.css`.

These sources answer "what exists today", not "what SM New must become".

## Deprecated For SM New API/DB Design

The following documents are preserved as evidence, but must not be used as the
starting point for new API or DB design:

- `docs/reference/handoff-sm-new-direction-plan.md`
- `docs/reference/handoff-sm-new-direction/SOURCE_PROTOTYPE_PARITY.md`
- `docs/reference/handoff-sm-new-direction/SECTION_UNIFICATION_MATRIX.md`
- `docs/reference/handoff-sm-new-direction/SYSTEM_CANDIDATE.md`
- `docs/reference/handoff-sm-new-direction/prototype-system/BOTTOM_NAV_CONTRACT_FIX27.md`
- `docs/reference/handoff-sm-new-direction/prototype-system/ROUTE_OWNERSHIP_MANIFEST_FIX27.md`
- `docs/reference/handoff-sm-new-direction/prototype-system/PRODUCTION_HANDOFF_FIX26.md`

If one of these conflicts with this baseline, this baseline wins for SM New
API/DB planning.

## Planning Boundaries

Before any schema or endpoint contract is written, the following decisions must
be fixed.

| Area | Required decision |
|---|---|
| Product scope | Which of the 17 baseline sections are in SM New API v1. |
| Navigation | Whether the 5-tab shell `홈 / 매치 / 팀매치 / 팀 / 마이` replaces production navigation. |
| Route map | Destination for `my team`, chat floating entry, notifications, search, and admin actions. |
| State machines | Match, match application, participant, team join, team match, team match application, payment, refund, dispute, notification, chat, and admin task transitions. |
| Actors and permissions | User, host, applicant, team owner, team manager, team member, admin, system, and provider capabilities. |
| Data freshness | Whether home recommendations, weather, monthly stats, unread counts, notices, and search state are stored, cached, or computed. |
| Transaction honesty | Exact representation of `test_only`, `mock`, `live`, `legacy_unavailable`, no-charge, failure, retry, refund, and dispute states. |
| Audit | Which mutations require reason, before/after state, actor, idempotency key, and partial failure records. |

## Naming Decisions To Keep Stable

The existing implementation has naming conflicts that must be resolved before
API/DB design proceeds.

| Concept | Existing implementation | SM New planning name |
|---|---|---|
| Service team | `SportTeam` model, `/teams` API | `team` domain, backed by `v1_teams` |
| Personal match internal teams | `Team` model under `Match` | `match_side` or `match_assigned_team` candidate, not the service `team` |
| Personal match participant | `MatchParticipant` | Split candidate: `match_application` and `match_participant` |
| Team match host | `TeamMatch.hostTeamId` | Host team with owner/manager permission gate |
| Payment target | `Payment.participantId` | General target candidate: `target_type` + `target_id` |

No new document should use `Team` without clarifying whether it means service
team or match-side team.

## API/DB Design Gate

Do not write final endpoint contracts or migrations until these artifacts exist:

1. Screen action inventory for the 17 baseline sections.
2. State transition tables with `from`, `to`, trigger, actor, permission, audit,
   and failure behavior.
3. Actor/permission matrix for personal match, team, team match, payment,
   refund, dispute, chat, notification, and admin.
4. V1 implementation ER that incorporates the state and permission decisions.
5. API surface map by user action, not by existing route names.
6. DTO and error/status contract draft, including idempotency and partial
   failure rules for transactional/admin mutations.

After those gates are complete, existing code and docs can be evaluated as
reuse candidates.

## Immediate Next Documents

Create the next planning documents in this order:

1. `sm-new-screen-action-inventory.md`
2. `sm-new-state-machines.md`
3. `sm-new-permission-matrix.md`
4. `sm-new-db-v1-implementation-design.md`
5. `sm-new-api-surface-map.md`

Keep them in `docs/reference/` until SM New is promoted from planning baseline
to implementation task.
