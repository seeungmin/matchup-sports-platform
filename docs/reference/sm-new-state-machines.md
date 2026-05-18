# SM New v1 State Machines

## 1. Status

```text
Status: closed for v1 implementation
Scope: v1 stored states, transitions, actors, audit, failure behavior
Implementation target: apps/v1_api + teameet_v1_dev
Table naming: v1_*
Prisma model naming: V1*
Out of scope: payment, refund, dispute, marketplace, lessons, venue owner/operator, tournament, DM, permanent team chat, file attachment
```

This document closes v1 state behavior. Implementation should not introduce
additional stored status values without updating this file first.

## 2. Global Rules

- `deadline_soon`, `full`, `available`, `joined`, `can_apply`, and display badges are derived states, not stored enum values.
- Every user/admin/system status change listed below writes `v1_status_change_logs`.
- Admin-triggered status changes also write `v1_admin_action_logs`.
- Duplicate mutation retries return the existing result when idempotency can be matched; otherwise they return `DUPLICATE_REQUEST`.
- Mutations against terminal states return `STATE_CONFLICT`.
- Soft-deleted or archived targets return `NOT_FOUND_OR_ARCHIVED`.

## 3. Account And Onboarding

### `v1_users.account_status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | active | signup/oauth first login | system | valid signup/session | status log | validation/auth conflict |
| active | suspended | suspend user | admin owner/ops | admin role | admin + status logs | already blocked/deleted |
| suspended | active | restore user | admin owner/ops | admin role | admin + status logs | deleted |
| active/suspended | blocked | block user | admin owner/ops | admin role | admin + status logs | deleted |
| blocked | active | unblock user | admin owner/ops | admin role | admin + status logs | deleted |
| active | withdrawal_pending | withdrawal request | user | self | status log | blocked/deleted |
| withdrawal_pending | active | cancel withdrawal | user/admin owner | self or admin | status log | deleted |
| withdrawal_pending/blocked | deleted | anonymize/delete | system/admin owner | retention elapsed/admin owner | status log | already deleted |

### `v1_users.onboarding_status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| not_started | terms_done | terms consent accepted | user/system | self | status log | required terms missing |
| terms_done | signup_done | signup transaction completed | system | valid signup | status log | transaction failure |
| signup_done | sport_done | sport preference saved | user | self | status log | no sport selected |
| sport_done | level_done | level preference saved | user | self | status log | invalid level for sport |
| level_done | region_done | region step completed | user | self | status log | invalid region |
| region_done/level_done | completed | onboarding complete | user | self | status log | required sport/level missing |
| signup_done/sport_done/level_done/region_done | deferred | defer onboarding | user | self | status log | none |
| deferred | completed | complete later | user | self | status log | required sport/level missing |

## 4. Terms And Master Data

### `v1_terms_documents.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| draft | published | publish terms | admin owner/ops | admin role | admin + status logs | active version conflict |
| published | archived | archive terms | admin owner/ops | admin role | admin + status logs | already archived |
| draft | archived | discard draft | admin owner/ops | admin role | admin + status logs | none |

Sports, sport levels, and regions use `is_active` instead of lifecycle enums.

## 5. Personal Match

### `v1_matches.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | recruiting | create match | user | authenticated | status log | validation failure |
| recruiting | cancelled | cancel match | match host/admin owner/ops | host or admin | status log, admin log if admin | already cancelled/completed |
| recruiting | closed | close recruitment | match host/system/admin | host, system deadline, admin | status log | cancelled/completed |
| closed | recruiting | reopen recruitment | match host/admin owner/ops | host or admin | status log | cancelled/completed |
| recruiting/closed | completed | mark completed | match host/system/admin | host or system/admin | status log | cancelled |
| recruiting/closed | archived | archive by admin | admin owner/ops | admin role | admin + status logs | none |

### `v1_match_applications.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | requested | apply to match | user | not host, not already participant, match recruiting | status log | duplicate/full/closed |
| requested | approved | approve application | match host | match host | status log | full/stale/not requested |
| requested | rejected | reject application | match host | match host | status log | stale/not requested |
| requested | withdrawn | withdraw application | applicant | self | status log | already processed |
| requested/approved | cancelled_by_host | host cancellation | match host/admin | host/admin | status log | match terminal |
| requested | expired | deadline/system expiry | system | system | status log | already processed |

### `v1_match_participants.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | active | host created or application approved | system/match host | create match or approve | status log | capacity conflict |
| active | removed | cancel approval/remove | match host/admin | host/admin | status log | host cannot be removed this way |
| active | cancelled | participant cancellation | participant/match host/admin | self before cutoff or host/admin | status log | completed match |
| active | no_show | mark no-show | match host/admin | host/admin | status log | match not completed |
| active | completed | match completion | system/match host | system/host | status log | match not completed |

Host participant row is created with `role = host` and cannot be withdrawn
through application APIs.

## 6. Team

### `v1_teams.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | active | create team | user | authenticated | status log | validation failure |
| active | suspended | admin suspend | admin owner/ops | admin role | admin + status logs | archived/deleted |
| suspended | active | admin restore | admin owner/ops | admin role | admin + status logs | archived/deleted |
| active/suspended | archived | archive team | team owner/admin owner | owner/admin | status log, admin log if admin | active team match conflict |

### `v1_team_memberships.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | active | owner create or join approved | system/team owner/manager | create team or approve | status log | duplicate membership |
| active | removed | remove member | team owner/manager | owner, or manager for member only | status log | cannot remove owner |
| active | left | leave team | member | self non-owner | status log | owner cannot leave |
| removed/left | active | re-approve join | team owner/manager | owner/manager | status log | manager limit conflict |

Role transitions are handled by role update mutations and logged through
`v1_status_change_logs` even when `status` stays `active`.

### `v1_team_join_applications.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | requested | apply to team | user | not existing active member, team active, approval_required | status log | duplicate/closed |
| requested | approved | approve join | team owner/manager | owner/manager | status log | stale/member exists |
| requested | rejected | reject join | team owner/manager | owner/manager | status log | stale |
| requested | withdrawn | withdraw join | applicant | self | status log | already processed |
| requested | expired | expiry | system | system | status log | already processed |

Teams do not support instant open join in v1.

## 7. Team Match

### `v1_team_matches.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | recruiting | create team match | team owner/manager | host team owner/manager | status log | no permission |
| recruiting | matched | approve applicant team | host team owner/manager | host team owner/manager | status log | approved team already exists |
| recruiting/matched | cancelled | cancel team match | host team owner/manager/admin | host owner/manager or admin | status log, admin log if admin | completed |
| matched | completed | mark completed | host team owner/manager/system/admin | host owner/manager/system/admin | status log | cancelled |
| recruiting/matched | archived | archive by admin | admin owner/ops | admin role | admin + status logs | none |

### `v1_team_match_applications.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | requested | apply as team | applicant team owner/manager | owner/manager of applicant team | status log | duplicate/self team/no permission |
| requested | approved | approve applicant team | host team owner/manager | host owner/manager | status log | already matched/stale |
| requested | rejected | reject applicant team | host team owner/manager | host owner/manager | status log | stale |
| requested | withdrawn | withdraw application | applicant team owner/manager | applicant owner/manager | status log | already processed |
| requested | expired | expiry | system | system | status log | already processed |

Only one approved application is allowed per team match.

## 8. Chat And Notification

### `v1_chat_rooms.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | active | resolve linked room | eligible participant/owner/manager | match/team-match access | status log | not eligible |
| active | archived | archive linked target | system/admin | target archived/admin | status log | none |

### `v1_chat_room_participants.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | active | room create/sync | system | eligible participant | none | not eligible |
| active | left | leave room | participant | self | status log | already left |
| left | active | rejoin via eligibility sync | system | still eligible | status log | no longer eligible |

### `v1_chat_messages.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | sent | send text | room participant | active participant | none | left/archived room |
| sent | hidden | hide message | admin owner/ops | admin role | admin + status logs | already hidden |
| sent | deleted | delete own message | sender/admin | sender or admin | status log | already hidden/deleted |

### `v1_notifications.status`

Stored status is not required. Read state is `read_at`.

| Field | Change | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| `read_at` | null -> timestamp | mark read/read all | recipient | self | none | not recipient |

## 9. Admin And Audit

### `v1_admin_users.status`

| From | To | Trigger | Actor | Permission | Audit | Failure |
|---|---|---|---|---|---|---|
| none | active | grant admin | admin owner | owner | admin + status logs | user inactive |
| active | suspended | suspend admin | admin owner | owner | admin + status logs | cannot suspend last owner |
| suspended | active | restore admin | admin owner | owner | admin + status logs | none |
| active/suspended | revoked | revoke admin | admin owner | owner | admin + status logs | cannot revoke last owner |

## 10. Closed Out Of Scope For v1

The following do not have v1 state machines and must not create v1 stored
states or APIs:

- payment, payment attempt, refund
- dispute/support case
- marketplace
- lessons
- venue owner/operator booking
- tournament
- 1:1 DM
- permanent team chat
- file chat message
- admin operation task queue
