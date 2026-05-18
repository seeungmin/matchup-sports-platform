# SM New DB v1 Implementation Design

## 1. Status

```text
Status: closed for v1 implementation
Scope: v1 relational model, naming, enums, FK/index/audit policy
Implementation target: apps/v1_api/prisma/schema.prisma
Database: teameet_v1_dev
Table naming: v1_*
Prisma model naming: V1*
Out of scope: payment, refund, dispute, marketplace, lessons, venue owner/operator, tournament, DM, permanent team chat, file attachment
```

This document replaces the earlier DB placeholder name. All tables below are
for the current v1 implementation only.

## 2. Naming Decisions

| Layer | Rule | Example |
|---|---|---|
| DB table | `v1_` prefix, snake case plural | `v1_users`, `v1_team_matches` |
| Prisma model | `V1` prefix, PascalCase singular | `V1User`, `V1TeamMatch` |
| FK column | target singular + `_id` | `user_id`, `team_match_id` |
| Status enum | Prisma enum prefixed with `V1` | `V1MatchStatus` |
| Join/app table | action noun explicit | `v1_match_applications` |

Existing `apps/api/prisma/schema.prisma` is reference-only. V1 schema lives in
`apps/v1_api/prisma/schema.prisma`.

## 3. Core Table Catalogue

### Identity/Auth

| Table | Prisma model | Purpose |
|---|---|---|
| `v1_users` | `V1User` | account identity and account/onboarding summary status |
| `v1_auth_identities` | `V1AuthIdentity` | provider/email login identity |
| `v1_user_profiles` | `V1UserProfile` | public/private profile fields |
| `v1_user_onboarding_progress` | `V1UserOnboardingProgress` | resumable onboarding details |

### Terms/Master

| Table | Prisma model | Purpose |
|---|---|---|
| `v1_terms_documents` | `V1TermsDocument` | terms/privacy/marketing document versions |
| `v1_user_terms_consents` | `V1UserTermsConsent` | user consent rows |
| `v1_sports` | `V1Sport` | sport master |
| `v1_sport_levels` | `V1SportLevel` | sport-specific level master |
| `v1_regions` | `V1Region` | 2-depth activity region master |
| `v1_notices` | `V1Notice` | public/user/admin notice master |

### Preference/Home

| Table | Prisma model | Purpose |
|---|---|---|
| `v1_user_sport_preferences` | `V1UserSportPreference` | user sport/level preferences |
| `v1_user_regions` | `V1UserRegion` | user activity regions |
| `v1_user_reputation_summaries` | `V1UserReputationSummary` | user trust/reputation summary |

### Personal Match

| Table | Prisma model | Purpose |
|---|---|---|
| `v1_matches` | `V1Match` | personal match recruiting post |
| `v1_match_applications` | `V1MatchApplication` | personal match application/review history |
| `v1_match_participants` | `V1MatchParticipant` | confirmed personal match participants |

### Team

| Table | Prisma model | Purpose |
|---|---|---|
| `v1_teams` | `V1Team` | service team |
| `v1_team_profiles` | `V1TeamProfile` | team introduction/profile extension |
| `v1_team_memberships` | `V1TeamMembership` | team role and membership status |
| `v1_team_join_applications` | `V1TeamJoinApplication` | team join review history |
| `v1_team_trust_scores` | `V1TeamTrustScore` | team trust/reputation summary |

### Team Match

| Table | Prisma model | Purpose |
|---|---|---|
| `v1_team_matches` | `V1TeamMatch` | team match recruiting post |
| `v1_team_match_applications` | `V1TeamMatchApplication` | applicant team review history |

### Chat/Notification

| Table | Prisma model | Purpose |
|---|---|---|
| `v1_chat_rooms` | `V1ChatRoom` | match/team-match linked chat room |
| `v1_chat_room_participants` | `V1ChatRoomParticipant` | chat participant state |
| `v1_chat_messages` | `V1ChatMessage` | text chat message |
| `v1_notifications` | `V1Notification` | user-specific in-app notification |
| `v1_notification_preferences` | `V1NotificationPreference` | user in-app/marketing preferences |

### Admin/Audit

| Table | Prisma model | Purpose |
|---|---|---|
| `v1_admin_users` | `V1AdminUser` | admin role extension |
| `v1_admin_action_logs` | `V1AdminActionLog` | admin action reason/before/after |
| `v1_status_change_logs` | `V1StatusChangeLog` | common status transition log |

## 4. Enum Catalogue

Implementation must include these enums exactly unless a later task updates this
document.

```text
V1AccountStatus = active | suspended | blocked | withdrawal_pending | deleted
V1OnboardingStatus = not_started | terms_done | signup_done | sport_done | level_done | region_done | completed | deferred
V1AuthProvider = kakao | naver | email
V1AuthIdentityStatus = active | unlinked | blocked
V1TermsDocumentStatus = draft | published | archived
V1TermsKind = terms | privacy | marketing
V1NoticeAudience = public | users | admins
V1NoticeStatus = draft | published | archived
V1TrustState = verified | estimated | sample | none
V1MatchStatus = recruiting | closed | cancelled | completed | archived
V1MatchApplicationStatus = requested | approved | rejected | withdrawn | cancelled_by_host | expired
V1MatchParticipantRole = host | participant
V1MatchParticipantStatus = active | removed | cancelled | no_show | completed
V1TeamStatus = active | suspended | archived
V1TeamJoinPolicy = approval_required | closed
V1TeamMembershipRole = owner | manager | member
V1TeamMembershipStatus = active | removed | left
V1TeamJoinApplicationStatus = requested | approved | rejected | withdrawn | expired
V1TeamMatchStatus = recruiting | matched | cancelled | completed | archived
V1TeamMatchApplicationStatus = requested | approved | rejected | withdrawn | expired
V1ChatRoomStatus = active | archived
V1ChatParticipantStatus = active | left
V1ChatMessageStatus = sent | hidden | deleted
V1NotificationTargetType = match | team | team_match | chat | notice | system
V1AdminRole = owner | ops | support
V1AdminStatus = active | suspended | revoked
V1StatusActorType = user | admin | system
```

## 5. Required Columns By Table Family

All mutable tables include:

```text
id uuid pk
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
deleted_at timestamptz nullable where soft delete is enabled
```

### Identity/Auth

- `v1_users`: `email`, `phone`, `account_status`, `onboarding_status`, `last_login_at`, `deleted_at`.
- `v1_auth_identities`: `user_id`, `provider`, `provider_user_key`, `email`, `password_hash`, `status`, `last_login_at`, `unlinked_at`.
- `v1_user_profiles`: `user_id`, `nickname`, `profile_image_url`, `bio`, `visibility`, anonymized display fields.
- `v1_user_onboarding_progress`: `user_id`, current step fields, completed/deferred timestamps, draft JSON for resumable values.

### Master/Preference

- `v1_terms_documents`: `kind`, `version`, `title`, `content`, `status`, `published_at`, `archived_at`, `is_required`.
- `v1_user_terms_consents`: `user_id`, `terms_document_id`, `accepted_at`, `revoked_at`.
- `v1_sports`: `code`, `name`, `is_active`, `sort_order`.
- `v1_sport_levels`: `sport_id`, `code`, `name`, `description`, `sort_order`, `is_active`.
- `v1_regions`: `parent_id`, `name`, `level`, `code`, `is_active`, `sort_order`.
- `v1_notices`: `audience`, `title`, `body`, `status`, `published_at`, `archived_at`.
- `v1_user_sport_preferences`: `user_id`, `sport_id`, `sport_level_id`, `is_primary`.
- `v1_user_regions`: `user_id`, `region_id`, `is_primary`.
- `v1_user_reputation_summaries`: `user_id`, `trust_state`, `manner_score`, `review_count`, `source_label`, `calculated_at`.

### Personal Match

- `v1_matches`: `host_user_id`, `sport_id`, `region_id`, `title`, `description`, `image_url`, `place_name`, `place_address`, `start_at`, `end_at`, `max_participants`, `level_note`, `gender_rule`, `cost_note`, `status`, `cancelled_at`, `completed_at`.
- `v1_match_applications`: `match_id`, `applicant_user_id`, `status`, `message`, `reviewed_by_user_id`, `reviewed_at`, `withdrawn_at`.
- `v1_match_participants`: `match_id`, `user_id`, `application_id`, `role`, `status`, `approved_at`, `cancelled_at`, `completed_at`.

### Team

- `v1_teams`: `owner_user_id`, `sport_id`, `region_id`, `name`, `status`, `join_policy`, `member_count`, `manager_count`.
- `v1_team_profiles`: `team_id`, `logo_url`, `cover_image_url`, `description`, `activity_note`, `skill_note`.
- `v1_team_memberships`: `team_id`, `user_id`, `role`, `status`, `joined_at`, `left_at`, `removed_by_user_id`.
- `v1_team_join_applications`: `team_id`, `applicant_user_id`, `status`, `message`, `reviewed_by_user_id`, `reviewed_at`, `withdrawn_at`.
- `v1_team_trust_scores`: `team_id`, `trust_state`, `manner_score`, `match_count`, `source_label`, `calculated_at`.

### Team Match

- `v1_team_matches`: `host_team_id`, `created_by_user_id`, `sport_id`, `region_id`, `title`, `description`, `image_url`, `place_name`, `place_address`, `start_at`, `end_at`, `format_note`, `gender_rule`, `cost_note`, `status`, `approved_applicant_team_id`, `cancelled_at`, `completed_at`.
- `v1_team_match_applications`: `team_match_id`, `applicant_team_id`, `applied_by_user_id`, `status`, `message`, `reviewed_by_user_id`, `reviewed_at`, `withdrawn_at`.

### Chat/Notification

- `v1_chat_rooms`: `match_id`, `team_match_id`, `status`, `last_message_at`.
- `v1_chat_room_participants`: `chat_room_id`, `user_id`, `status`, `pinned_at`, `last_read_message_id`, `left_at`.
- `v1_chat_messages`: `chat_room_id`, `sender_user_id`, `body`, `status`, `sent_at`, `hidden_at`, `deleted_at`.
- `v1_notifications`: `recipient_user_id`, `target_type`, `target_id`, `title`, `body`, `deep_link`, `read_at`, `created_at`.
- `v1_notification_preferences`: `user_id`, `important_enabled`, `activity_enabled`, `marketing_enabled`, `updated_at`.

### Admin/Audit

- `v1_admin_users`: `user_id`, `admin_role`, `status`, `granted_by_admin_user_id`, `granted_at`, `revoked_at`.
- `v1_admin_action_logs`: `admin_user_id`, `action`, `target_type`, `target_id`, `reason`, `before_json`, `after_json`, `created_at`.
- `v1_status_change_logs`: `target_type`, `target_id`, `from_status`, `to_status`, `actor_type`, `actor_user_id`, `admin_user_id`, `reason`, `created_at`.

## 6. FK And Cardinality Rules

- `v1_user_profiles.user_id` is unique and required.
- `v1_user_onboarding_progress.user_id` is unique and required.
- `v1_auth_identities.user_id` references `v1_users`.
- `v1_auth_identities(provider, provider_user_key)` is unique.
- `v1_user_terms_consents(user_id, terms_document_id)` is unique.
- `v1_sport_levels.sport_id` references `v1_sports`.
- `v1_regions.parent_id` self-references `v1_regions`.
- `v1_matches.host_user_id` references `v1_users`.
- `v1_match_applications(match_id, applicant_user_id)` is unique for active request prevention.
- `v1_match_participants(match_id, user_id)` is unique for active participant prevention.
- `v1_teams.owner_user_id` references `v1_users`.
- `v1_team_profiles.team_id` is unique.
- `v1_team_memberships(team_id, user_id)` is unique.
- `v1_team_join_applications(team_id, applicant_user_id)` is unique for active request prevention.
- `v1_team_matches.host_team_id` references `v1_teams`.
- `v1_team_match_applications(team_match_id, applicant_team_id)` is unique.
- `v1_chat_rooms` must have exactly one of `match_id` or `team_match_id`.
- `v1_chat_room_participants(chat_room_id, user_id)` is unique.
- `v1_notification_preferences.user_id` is unique.
- `v1_admin_users.user_id` is unique.

Where PostgreSQL partial unique indexes are needed, add them in SQL migrations
after Prisma model generation.

## 7. Index Rules

Required indexes:

- status fields on mutable domain tables
- `created_at` for list sorting
- `start_at` on `v1_matches` and `v1_team_matches`
- `sport_id`, `region_id` on match/team/team-match browse tables
- `(recipient_user_id, read_at, created_at)` on `v1_notifications`
- `(target_type, target_id, created_at)` on audit/status logs
- `(team_id, role, status)` on memberships
- `(chat_room_id, sent_at)` on messages

## 8. Soft Delete And Archive

- `v1_users` uses `deleted_at` plus profile anonymization.
- `v1_matches`, `v1_teams`, `v1_team_matches`, `v1_notices`, and terms use status/archive semantics.
- Application, participant, membership, chat, notification, and audit rows are preserved for history.
- Audit tables are append-only.

## 9. Seed Plan

V1 seed must create enough data for scaffold and first functional slices:

1. sports: soccer, futsal, basketball, baseball, badminton, tennis, running.
2. sport levels: 5 levels per sport.
3. regions: minimal Seoul/Gyeonggi 2-depth set for local dev.
4. terms: current required terms/privacy and optional marketing.
5. notices: one public published notice.
6. users: host, applicant, team owner, team manager, team member, admin owner.
7. teams: two active teams.
8. matches/team matches: one recruiting and one matched/completed sample each.
9. notification preferences for each seed user.

Seed data lives in `apps/v1_api/prisma/seed.ts` and must not touch existing
`apps/api` seeds.

## 10. Migration Plan

- Use the v1 DB only: `teameet_v1_dev`.
- Use `apps/v1_api/prisma/schema.prisma`.
- Initial scaffold can use `prisma db push`; functional implementation should
  switch to committed Prisma migrations before team development continues.
- Do not run v1 migrations against the existing DB.
- Existing production data migration is not part of v1 feature completion.

## 11. Closed Out Of Scope For v1

Do not add tables for:

- payments, payment attempts, refunds
- disputes/support cases
- marketplace
- lessons
- venue owner/operator booking
- tournaments
- direct messages
- permanent team chat
- chat file attachments
- admin operation task queue
