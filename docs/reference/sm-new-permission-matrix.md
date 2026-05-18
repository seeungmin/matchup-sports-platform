# SM New v1 Permission Matrix

## 1. Status

```text
Status: closed for v1 implementation
Scope: v1 actors, read/write/status-change permissions
Implementation target: apps/v1_api + apps/v1_web
Table naming: v1_*
Prisma model naming: V1*
Out of scope: payment, refund, dispute, marketplace, lessons, venue owner/operator, tournament, DM, permanent team chat, file attachment
```

This document closes v1 permissions. Backend services should enforce these
rules in service-level permission checks, not only guards.

## 2. Actors

| Actor | Definition |
|---|---|
| guest | no authenticated v1 user |
| user | authenticated active `v1_users` row |
| match_host | active `v1_match_participants.role = host` for match |
| match_applicant | owner of `v1_match_applications` row |
| match_participant | active `v1_match_participants` row |
| team_owner | active `v1_team_memberships.role = owner` |
| team_manager | active `v1_team_memberships.role = manager` |
| team_member | active `v1_team_memberships.role = member` |
| team_join_applicant | owner of `v1_team_join_applications` row |
| team_match_host_manager | owner/manager of host team |
| team_match_applicant_manager | owner/manager of applicant team |
| chat_participant | active `v1_chat_room_participants` row |
| admin_owner | active `v1_admin_users.admin_role = owner` |
| admin_ops | active `v1_admin_users.admin_role = ops` |
| admin_support | active `v1_admin_users.admin_role = support` |
| system | scheduled/internal process |

Suspended, blocked, withdrawal pending, deleted, removed, left, or revoked rows
do not grant permissions unless explicitly listed.

## 3. Public And Auth

| Action | guest | user | admin | Notes |
|---|---:|---:|---:|---|
| Read public home | yes | yes | yes | user receives personalized fields |
| Read public match/team/team-match list | yes | yes | yes | private/manage fields excluded |
| Read notices | yes | yes | yes | no notice read persistence |
| Signup/login/terms | yes | yes | yes | authenticated users may refresh terms/session |
| Onboarding read/write | no | self | no | admin does not edit onboarding |
| Settings/profile write | no | self | no | admin status actions are separate |

## 4. Personal Match

| Capability | guest | user | match_host | match_applicant | match_participant | admin_owner/ops | admin_support |
|---|---:|---:|---:|---:|---:|---:|---:|
| List public matches | yes | yes | yes | yes | yes | yes | yes |
| Read match detail | yes | yes | yes | yes | yes | yes | yes |
| Read application eligibility | no | self | self | self | self | yes | read-only |
| Create match | no | yes | yes | yes | yes | no | no |
| Edit own match | no | no | yes | no | no | override only | no |
| Cancel own match | no | no | yes | no | no | override only | no |
| Apply to match | no | yes | no | no if active request | no | no | no |
| Withdraw own application | no | no | no | yes if requested | no | no | no |
| Read applicant list | no | no | yes | no | no | yes | read-only |
| Approve/reject application | no | no | yes | no | no | override only | no |
| Cancel participant approval | no | no | yes | no | no | override only | no |
| Mark participant no-show/cancelled | no | no | yes | no | no | override only | no |

Admin override mutations require reason and write both `v1_admin_action_logs`
and `v1_status_change_logs`.

## 5. Teams

| Capability | guest | user | team_owner | team_manager | team_member | applicant | admin_owner/ops | admin_support |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| List active teams | yes | yes | yes | yes | yes | yes | yes | yes |
| Read team detail | yes | yes | yes | yes | yes | yes | yes | yes |
| Read join eligibility | no | self | self | self | self | self | yes | read-only |
| Create team | no | yes | yes | yes | yes | yes | no | no |
| Edit team profile | no | no | yes | yes | no | no | override only | no |
| Archive team | no | no | yes | no | no | no | override only | no |
| Apply to join team | no | yes | no if member | no if member | no if member | no duplicate | no | no |
| Withdraw own join request | no | no | no | no | no | yes | no | no |
| Read join requests | no | no | yes | yes | no | no | yes | read-only |
| Approve/reject join request | no | no | yes | yes | no | no | override only | no |
| Read member list | no | no | yes | yes | yes | no | yes | read-only |
| Change member role | no | no | yes | limited | no | no | override only | no |
| Remove member | no | no | yes | member only | no | no | override only | no |

Manager limits:

- Owner can promote/demote manager/member.
- Manager can manage regular members only.
- Manager cannot change owner, promote manager, demote manager, remove owner, or exceed 5 managers.
- Owner transfer is not a v1 user-facing action.

## 6. Team Match

| Capability | guest | user | host owner/manager | applicant owner/manager | team member | admin_owner/ops | admin_support |
|---|---:|---:|---:|---:|---:|---:|---:|
| List public team matches | yes | yes | yes | yes | yes | yes | yes |
| Read team match detail | yes | yes | yes | yes | yes | yes | yes |
| Read application eligibility | no | team owner/manager only | yes | yes | no | yes | read-only |
| Create team match | no | no | yes | yes for own team | no | no | no |
| Edit/cancel own team match | no | no | yes | no | no | override only | no |
| Apply as team | no | no | no if host team | yes | no | no | no |
| Withdraw team application | no | no | no | yes if requested | no | no | no |
| Read applicant teams | no | no | yes | no | no | yes | read-only |
| Approve/reject team application | no | no | yes | no | no | override only | no |

Only owner/manager can represent a team in team match creation and application.
Regular team members cannot apply on behalf of the team.

## 7. Chat

| Capability | match participant | team match owner/manager | team member | admin_owner/ops | admin_support |
|---|---:|---:|---:|---:|---:|
| Resolve/open linked match chat | yes | no | no | read-only | read-only |
| Resolve/open linked team-match chat | no | yes | no | read-only | read-only |
| Read joined room | yes | yes | no | read-only | read-only |
| Send text message | yes | yes | no | no | no |
| Pin/unpin own room | yes | yes | no | no | no |
| Leave own room | yes | yes | no | no | no |
| Hide message | no | no | no | yes | no |

There is no v1 DM, permanent team chat, or file attachment permission.

## 8. Notifications

| Capability | user | admin_owner/ops | admin_support | system |
|---|---:|---:|---:|---:|
| Read own notifications | yes | self only | self only | no |
| Mark own notification read | yes | self only | self only | no |
| Mark all own notifications read | yes | self only | self only | no |
| Create system notification | no | no | no | yes |
| Create domain notification as side effect | no | no | no | yes |
| Update notification preferences | self | self | self | no |

Admins do not read arbitrary user notification inboxes in v1.

## 9. Profile, Trust, Settings

| Capability | guest | user | admin_owner/ops | admin_support |
|---|---:|---:|---:|---:|
| Read public profile | yes | yes | yes | yes |
| Read own private profile/settings | no | self | self only | self only |
| Edit own profile/settings | no | self | self only | self only |
| Request own withdrawal | no | self | no | no |
| Change account status | no | no | yes | no |
| Read reputation summary | public fields | public + own fields | yes | read-only |

Trust/reputation values must include `verified | estimated | sample | none`.
Sample values cannot be rendered as verified trust.

## 10. Admin

| Capability | admin_owner | admin_ops | admin_support |
|---|---:|---:|---:|
| Read admin me | yes | yes | yes |
| Read overview | yes | yes | yes |
| Read action/status logs | yes | yes | yes |
| Change user status | yes | yes | no |
| Change match status | yes | yes | no |
| Change team status | yes | yes | no |
| Change team match status | yes | yes | no |
| Grant/revoke admin | yes | no | no |
| Suspend/restore admin | yes | no | no |

All admin mutations require:

- target type and target id
- reason
- before/after state
- actor id
- `v1_admin_action_logs`
- `v1_status_change_logs` when a stored status changes

## 11. Closed Out Of Scope For v1

No v1 actor can access or mutate:

- payment/refund/dispute/support case flows
- marketplace/lesson/venue owner/tournament features
- 1:1 DM
- permanent team chat
- file attachments in chat
- admin operation task queue
