# 87 Gender Enum Contract

Status: In Progress
Date: 2026-05-26

## Scope

- Backend Prisma schema, DTO validation, services for user profile, matches, team matches, and team composition inputs.
- Frontend generated enum types, API types, match/team-match create/edit/list/detail forms.
- Seed, mock catalog, MSW/test fixtures that carry user or match gender.

## Contract

- `Gender`: user profile gender only.
  - Values: `male`, `female`
- `MatchGender`: recruitment condition for individual matches and team matches.
  - Values: `any`, `male`, `female`
- Team composition remains JSON for team balancing shape, but any gender field inside team composition payloads must use `MatchGender` values.

## Acceptance Criteria

- [x] Prisma schema uses `Gender` without `other`.
- [x] Prisma schema uses `MatchGender` for `Match.gender`.
- [x] Prisma schema adds `TeamMatch.gender` as `MatchGender @default(any)`.
- [x] API DTOs validate gender inputs with enum contracts.
- [x] Frontend types expose `MatchGender` and use it for match/team-match payloads and records.
- [x] Match and team-match create/edit/detail/list surfaces preserve `any/male/female`.
- [x] Mock users no longer use `other`.
- [x] Mock matches and team matches use `MatchGender` values.

## Progress Snapshot

- 2026-05-26: Found current drift: profile `Gender` includes `other`, individual `Match.gender` is raw string, and `TeamMatch` has no gender field.
- 2026-05-26: Added `MatchGender`, migrated match/team-match contracts, regenerated Prisma/frontend enums, and validated API/web types plus focused tests.

## Ambiguity Log

- User clarified product policy: profile gender should be only `male` / `female`.
