# V1 SM New E2E Scenario Matrix

이 문서는 `Team Design > 1차 디자인 완료`의 17개 섹션을 기준으로 v1 E2E 시나리오를 정의한다.
각 시나리오는 화면 흐름, API 계약, DB 상태 전이를 함께 검증하는 단위다.

## Sources

- Design baseline: `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html`
- Design section list: `SM_FIRST_DESIGN_COMPLETE_SECTIONS`
- Screen actions: `docs/reference/sm-new-screen-action-inventory.md`
- API contract: `docs/reference/sm-new-api-v1-contract-checklist.md`
- DB design: `docs/reference/sm-new-db-v1-implementation-design.md`
- Runtime plan: `.github/tasks/82-sm-new-rebuild-plan.md`

## Runtime Preflight

- V1 stack: `make dev-v1`
- V1 web: `http://localhost:3013`
- V1 API: `http://localhost:8121/api/v1`
- V1 DB: `teameet_v1_dev` inside `v1_postgres`
- Existing app stack is reference-only for these scenarios.
- Initial implementation may use temporary v1 development auth headers such as `x-v1-user-id` or `x-v1-user-email`.

## Status Convention

- `[ ]` Not implemented or not run
- `[~]` Implemented surface exists, latest E2E evidence pending
- `[x]` Verified against v1 runtime
- `Deferred`: v1 must show honest disabled/read-only/no-real-transaction UI, not a successful fake flow

## Global E2E Rules

- Every list/detail route validates loading, empty, error, retry, and successful data states.
- Every mutation validates success, duplicate submit, stale status conflict, permission denied, and refetch after mutation.
- Every create/edit route validates required fields, unknown UI-only field stripping, invalid time/state, and reload persistence.
- Every state-changing API validates DB state plus `v1_status_change_logs` where required.
- Every admin mutation validates `v1_admin_action_logs` plus target `v1_status_change_logs`.
- Payment/refund/dispute, marketplace, lessons, venue owner/operator, tournament, DM, permanent team chat, and file attachment are not v1 core E2E success flows.

## 00. Core Shell

Design section: `core-shell-sm-final`

Primary contracts:
`GET /notifications`, `PATCH /notifications/:notificationId/read`, domain list/search APIs.

DB evidence:
`v1_notifications`

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-00-001 | Bottom nav moves between `home`, `matches`, `team-matches`, `teams`, `my` | Active tab, URL, and shell state remain consistent after navigation and reload |
| V1-00-002 | Top bell opens notification center from home and detail screens | Unread count is shown, list loads from API, back returns to source route |
| V1-00-003 | Back/search shell preserves list context | Query/filter context survives detail back navigation |
| V1-00-004 | Filter sheet draft/apply/reset | Draft changes do not call API until apply; reset restores default list |
| V1-00-005 | Retry from shell-level network failure | Same route/query/filter is retried and stale results are not applied |
| V1-00-006 | Sticky CTA double click protection | One mutation request wins; duplicate click shows locked/pending UI |

## 01. Auth And Onboarding

Design section: `auth-onboarding-sm-final`

Primary contracts:
`GET /auth/me`, `POST /auth/oauth/:provider/callback`, `POST /auth/email/login`, `POST /auth/signup`,
`GET /terms/current`, `POST /terms/consents`, `GET /onboarding`,
`PATCH /onboarding/preferences`, `POST /onboarding/complete`, `POST /onboarding/defer`.

DB evidence:
`v1_users`, `v1_auth_identities`, `v1_user_profiles`, `v1_user_onboarding_progress`,
`v1_user_terms_consents`, `v1_user_sport_preferences`, `v1_user_regions`,
`v1_notification_preferences`, `v1_status_change_logs`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-01-001 | Email signup requires current terms consent | Required terms gate signup; successful signup creates user/profile/identity/consents |
| V1-01-002 | Signup field validation | Duplicate email/nickname and password mismatch stay inline with input preserved |
| V1-01-003 | Email login success and account-state routing | Completed user enters `/home`; incomplete user resumes onboarding; blocked user cannot enter app |
| V1-01-004 | OAuth provider callback states | signed-in, needs-terms, missing-email, conflict, denied, and blocked states route correctly |
| V1-01-005 | Onboarding sport/level/region save | Sport minimum guard, level required per sport, region empty allowed |
| V1-01-006 | Onboarding resume after reload | Partial selections hydrate from API and current step is restored |
| V1-01-007 | Onboarding complete/defer | Complete requires sport+level; defer enters limited home and records deferred status |
| V1-01-008 | Unknown DTO fields are rejected | UI-only fields are stripped before submit or server returns `VALIDATION_FAILED` |

## 02. Home Discovery

Design section: `home-discovery-sm-final`

Primary contracts:
`GET /home`, `GET /home/recommendations`, `GET /search`, `GET /notices`, `GET /notices/:noticeId`.

DB evidence:
`v1_matches`, `v1_match_participants`, `v1_sports`, `v1_regions`, `v1_notices`,
`v1_notifications`, preference and reputation tables.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-02-001 | Home loads for guest and authenticated user | Guest sees public shape; user sees personalized summary and unread count |
| V1-02-002 | Featured match card opens detail | Detail route uses selected `matchId` and back returns to home context |
| V1-02-003 | Quick action routing | Matches/team matches/teams route; unresolved my-team shortcut is disabled with copy |
| V1-02-004 | Recommendations refresh | Empty, derived, estimated/sample trust labels are honest and not overclaimed |
| V1-02-005 | Unified search latest-query-wins | Slow old response does not overwrite newer query results |
| V1-02-006 | Search group result routing | Match/team-match/team result rows route to correct detail pages |

## 03. Notice

Design section: `home-notice-sm-final`

Primary contracts:
`GET /notices`, `GET /notices/:noticeId`.

DB evidence:
`v1_notices`

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-03-001 | Notice list cursor pagination | Published notices render; draft/archived notices do not |
| V1-03-002 | Notice detail access | Public notice opens for guest; users-only notice requires auth |
| V1-03-003 | Notice has no read-state side effect | Opening detail does not create notification/read rows |

## 04. Personal Match Browse And Join

Design section: `matches-core-sm-final`

Primary contracts:
`GET /matches`, `GET /matches/:matchId`, `GET /matches/:matchId/application-eligibility`,
`GET /me/matches`, `POST /matches/:matchId/applications`,
`POST /match-applications/:applicationId/withdraw`,
`GET /matches/:matchId/applications`, `POST /match-applications/:applicationId/approve`,
`POST /match-applications/:applicationId/reject`,
`POST /match-participants/:participantId/cancel-approval`,
`POST /match-participants/:participantId/mark-cancelled`.

DB evidence:
`v1_matches`, `v1_match_applications`, `v1_match_participants`, `v1_status_change_logs`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-04-001 | Match list filter/search/sort | URL or draft filter state preserves selected query after reload |
| V1-04-002 | Match detail CTA states | Own match, already requested, approved, full, closed, cancelled, and guest states lock CTA correctly |
| V1-04-003 | Apply to match | Application row becomes `requested`; CTA changes to pending without payment copy |
| V1-04-004 | Withdraw application | Application becomes `withdrawn`; duplicate withdraw converges or returns processed conflict |
| V1-04-005 | Host approves applicant | Application approved, participant active, capacity updates, status log exists |
| V1-04-006 | Host rejects applicant | Application rejected, no participant row created, applicant sees rejected state |
| V1-04-007 | Host cancels approval | Participant removed, application history preserved |
| V1-04-008 | Participant cancellation handling | Host marks participant cancelled; participant no longer counted as active |

## 05. Personal Match Create And Edit

Design section: `matches-core-sm-create-final`

Primary contracts:
`POST /matches`, `GET /matches/:matchId/edit`, `PATCH /matches/:matchId`, `POST /matches/:matchId/cancel`.

DB evidence:
`v1_matches`, `v1_match_participants`, `v1_status_change_logs`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-05-001 | Create match stepper happy path | Sport/info/place/time/confirm create recruiting match and host participant |
| V1-05-002 | Create validation | Missing sport/title/time/capacity and invalid end-before-start block submit |
| V1-05-003 | Image field behavior | One representative image URL is saved or upload-disabled UI stays honest |
| V1-05-004 | Edit prefill and save | Host sees current fields; save updates DB and detail after reload |
| V1-05-005 | Edit permission denied | Non-host cannot open edit or receives permission recovery UI |
| V1-05-006 | Cancel match | Host cancel changes status, logs transition, locks future applications |

## 06. Team Match Browse And Apply

Design section: `teams-team-matches-sm-revision-4`

Primary contracts:
`GET /team-matches`, `GET /team-matches/:teamMatchId`,
`GET /team-matches/:teamMatchId/application-eligibility`, `GET /me/team-matches`,
`POST /team-matches/:teamMatchId/applications`,
`POST /team-match-applications/:applicationId/withdraw`,
`GET /team-matches/:teamMatchId/applications`,
`POST /team-match-applications/:applicationId/approve`,
`POST /team-match-applications/:applicationId/reject`.

DB evidence:
`v1_team_matches`, `v1_team_match_applications`, `v1_teams`, `v1_team_memberships`,
`v1_status_change_logs`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-06-001 | Team match list filter/search/sort | Team match list preserves context and excludes cancelled/archived entries as contracted |
| V1-06-002 | Team match detail eligibility | User sees eligible applicant teams only when owner/manager |
| V1-06-003 | Apply with managed team | Application becomes `requested`; host team cannot apply to itself |
| V1-06-004 | Withdraw team match application | Applicant team owner/manager can withdraw; member cannot |
| V1-06-005 | Approve applicant team | Application approved, team match becomes `matched`, only one approved team remains |
| V1-06-006 | Reject applicant team | Application rejected, team match remains recruiting if no approved team |

## 07. Team Match Create And Edit

Design section: `teams-team-matches-sm-create-final`

Primary contracts:
`POST /team-matches`, `GET /team-matches/:teamMatchId/edit`,
`PATCH /team-matches/:teamMatchId`, `POST /team-matches/:teamMatchId/cancel`.

DB evidence:
`v1_team_matches`, `v1_teams`, `v1_team_memberships`, `v1_status_change_logs`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-07-001 | Create team match as owner/manager | Selected host team creates recruiting team match |
| V1-07-002 | Create permission guard | Regular member or non-member cannot choose team or submit |
| V1-07-003 | Cost/free invitation fields | No payment API is called; cost note is text-only |
| V1-07-004 | Edit team match | Owner/manager sees prefilled form and persisted update |
| V1-07-005 | Cancel team match | Status changes to cancelled and pending applications lock |

## 08. Team Browse And Join

Design section: `team-browse-sm-revision-5`

Primary contracts:
`GET /teams`, `GET /teams/:teamId`, `GET /teams/:teamId/join-eligibility`,
`GET /me/teams`, `POST /teams`, `PATCH /teams/:teamId`,
`GET /teams/:teamId/members`, `PATCH /team-memberships/:membershipId/role`,
`POST /team-memberships/:membershipId/remove`,
`POST /teams/:teamId/join-applications`,
`POST /team-join-applications/:applicationId/withdraw`,
`GET /teams/:teamId/join-applications`,
`POST /team-join-applications/:applicationId/approve`,
`POST /team-join-applications/:applicationId/reject`.

DB evidence:
`v1_teams`, `v1_team_profiles`, `v1_team_memberships`, `v1_team_join_applications`,
`v1_team_trust_scores`, `v1_status_change_logs`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-08-001 | Team browse filter/search | List filters by sport/region/trust and keeps context after reload |
| V1-08-002 | Team detail join eligibility | Approval-required team allows request; closed team shows disabled copy |
| V1-08-003 | Submit team join request | Application row becomes `requested`; open instant join is never shown |
| V1-08-004 | Withdraw team join request | Applicant can withdraw and detail CTA resets correctly |
| V1-08-005 | Owner/manager approve join | Application approved, membership active, member count updates |
| V1-08-006 | Owner/manager reject join | Application rejected and user remains non-member |
| V1-08-007 | Team member management | Owner changes role, manager limit is enforced, member removal persists |

## 09. Community, Chat, Notifications

Design section: `community-sm-final`

Primary contracts:
`GET /chat/rooms`, `POST /chat/rooms/resolve`, `GET /chat/rooms/:roomId`,
`GET /chat/rooms/:roomId/messages`, `POST /chat/rooms/:roomId/messages`,
`PATCH /chat/rooms/:roomId/me`, `POST /chat/rooms/:roomId/leave`,
`GET /notifications`, `PATCH /notifications/:notificationId/read`,
`POST /notifications/read-all`, `GET /notification-preferences`, `PATCH /notification-preferences`.

DB evidence:
`v1_chat_rooms`, `v1_chat_room_participants`, `v1_chat_messages`,
`v1_notifications`, `v1_notification_preferences`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-09-001 | Chat list shows linked rooms only | Match/team-match rooms appear; DM/team permanent room entry is absent or disabled |
| V1-09-002 | Resolve linked chat room | Eligible participant resolves or creates one room; unauthorized user is denied |
| V1-09-003 | Send text message | Message persists, latest room preview updates, duplicate idempotency handled |
| V1-09-004 | Pin/unpin and leave room | Participant state persists after reload; leaving hides room or marks left |
| V1-09-005 | Notification list and deep link | Row read state updates and explicit navigation reaches target route |
| V1-09-006 | Mark all read | All unread rows get `read_at`; duplicate call remains successful |
| V1-09-007 | Notification preferences | Toggle save persists and reload hydrates server state |

## 10. My, Profile, Trust

Design section: `my-profile-trust-sm-revision`

Primary contracts:
`GET /me/profile`, `PATCH /me/profile`, `GET /users/:userId/public-profile`,
`GET /me/matches`, `GET /me/team-matches`, `GET /me/teams`,
domain manage APIs from match/team/team-match sections.

DB evidence:
`v1_users`, `v1_user_profiles`, `v1_user_reputation_summaries`,
`v1_matches`, `v1_match_applications`, `v1_match_participants`,
`v1_teams`, `v1_team_memberships`, `v1_team_matches`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-10-001 | My page summary | Profile, reputation, activity links, and trust state render from API |
| V1-10-002 | Edit profile | Nickname/bio/avatar visibility validation and persistence after reload |
| V1-10-003 | Public profile trust labels | verified/estimated/sample/none are visually distinct and not misleading |
| V1-10-004 | My matches joined/created | Toggle uses correct API role and opens correct manage/detail route |
| V1-10-005 | Created match manage from My | Applicant approval/rejection works from My route and reflects in detail |
| V1-10-006 | My team matches manage | Applicant team profile opens; approve/reject updates team match status |
| V1-10-007 | My teams by role | Owner/manager/member roles render and member manage entry is role-gated |
| V1-10-008 | Deferred permanent team chat | Team chat entry is disabled/read-only unless linked chat is available |

## 11. Payment And Support Deferred Surfaces

Design section: `payments-support-sm-revision`

Primary contracts:
No v1 payment/refund/dispute API.

DB evidence:
No v1 payment/refund/dispute tables.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-11-001 | Match/team-match CTA does not imply real payment | CTA copy maps to application request, not checkout |
| V1-11-002 | Payment history/detail route if visible | Surface is disabled/read-only/test-only and makes no payment API call |
| V1-11-003 | Refund/support action if visible | Action is blocked with deferred copy and no fake success state |

## 12. Settings

Design section: `settings-states`

Primary contracts:
`GET /me/settings`, `PATCH /me/settings`, `GET /terms/current`,
`GET /notification-preferences`, `PATCH /notification-preferences`,
`POST /auth/logout`, `POST /me/withdrawal-request`.

DB evidence:
`v1_users`, `v1_auth_identities`, `v1_user_profiles`, `v1_terms_documents`,
`v1_user_terms_consents`, `v1_notification_preferences`, `v1_status_change_logs`.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-12-001 | Settings hydrate | Account, profile visibility, notification prefs, legal links render from API |
| V1-12-002 | Save settings | Visibility and preference changes persist after reload |
| V1-12-003 | Legal document view | Terms/privacy current versions are readable from shared terms API |
| V1-12-004 | Logout | Session clears and protected routes show auth wall/login |
| V1-12-005 | Withdrawal request | Account becomes `withdrawal_pending`, status log exists, app shows recovery/hard-stop copy |
| V1-12-006 | Unsupported email/password changes | If UI exists, it is disabled or clearly deferred |

## 13. Public Marketing

Design section: `public-marketing-sm-revision`

Primary contracts:
Optional public reads from `GET /home`, `GET /matches`, `GET /team-matches`, `GET /teams`.

DB evidence:
Public domain read tables only.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-13-001 | Landing start flow | Start CTA routes to login/signup without requiring old app routes |
| V1-13-002 | Public entry cards | Public match/team/team-match previews use public APIs or explicit sample labels |
| V1-13-003 | Public stats honesty | Sample/derived stats are labelled and not shown as verified operational truth |

## 14. Desktop Web

Design section: `desktop-web`

Primary contracts:
Same v1 mobile/domain APIs; no separate desktop API by default.

DB evidence:
Same as active domain.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-14-001 | Desktop shell responsive layout | Nav/search/filter affordances work without mobile-only overlap |
| V1-14-002 | Desktop match search | Wider filter layout calls same `GET /matches` contract |
| V1-14-003 | Desktop keyboard flow | Enter submits search, Escape closes sheets/dialogs, focus remains visible |
| V1-14-004 | Desktop detail/manage parity | Desktop detail exposes the same CTA states and permission locks as mobile |

## 15. Admin Operations

Design section: `admin-ops-sm-revision`

Primary contracts:
`GET /admin/me`, `GET /admin/overview`, `POST /admin/users/:userId/status`,
`POST /admin/matches/:matchId/status`, `POST /admin/teams/:teamId/status`,
`POST /admin/team-matches/:teamMatchId/status`,
`GET /admin/action-logs`, `GET /admin/status-change-logs`.

DB evidence:
`v1_admin_users`, `v1_admin_action_logs`, `v1_status_change_logs`, target domain tables.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-15-001 | Admin auth gate | Non-admin user is denied; active admin enters dashboard |
| V1-15-002 | Overview queues | Counts link to filtered operational targets and handle empty state |
| V1-15-003 | User status change | Reason required; user status changes; admin and status logs are created |
| V1-15-004 | Match/team/team-match status change | Target status changes and affected user-facing CTAs lock after refetch |
| V1-15-005 | Audit log filters | Action/status logs filter by target, actor, status, and cursor paginate |

## 16. Common Flows And Motion

Design section: `common-flows-motion`

Primary contracts:
All v1 list/detail/mutation APIs.

DB evidence:
All mutable v1 tables plus audit/status logs where applicable.

| ID | Scenario | Expected E2E assertion |
|---|---|---|
| V1-16-001 | List state atlas | Loading, empty, error, retry, success, and pagination states exist for every list |
| V1-16-002 | Detail state atlas | Loading, not found/archived, permission denied, stale CTA, and success states exist |
| V1-16-003 | Create/edit parity | Edit uses same validation/control language as create and prefilled values are real |
| V1-16-004 | Mutation idempotency | Required mutations handle repeated `Idempotency-Key` and conflicting payloads |
| V1-16-005 | Stale state conflict | Two actors changing same target produce latest-state recovery, not fake success |
| V1-16-006 | Navigation after optimistic mutation | Navigation is not lost when mutation invalidates/reorders/unmounts list rows |

## Suggested Automation Files

Initial E2E specs should be split by product journey, not by API module.

```text
e2e/v1/auth-onboarding.spec.ts
e2e/v1/home-notice-search.spec.ts
e2e/v1/matches.spec.ts
e2e/v1/team-matches.spec.ts
e2e/v1/teams.spec.ts
e2e/v1/chat-notifications.spec.ts
e2e/v1/my-settings.spec.ts
e2e/v1/admin.spec.ts
e2e/v1/deferred-and-responsive.spec.ts
```

## Recommended Execution Order

1. `V1-01-*` auth/onboarding because all protected flows depend on personas.
2. `V1-02-*`, `V1-03-*` home/search/notice because these are mostly read paths.
3. `V1-04-*`, `V1-05-*` personal match lifecycle.
4. `V1-08-*` team browse/create/member management because team match depends on managed teams.
5. `V1-06-*`, `V1-07-*` team match lifecycle.
6. `V1-09-*` chat/notifications after match/team-match linked targets exist.
7. `V1-10-*`, `V1-12-*` my/profile/settings.
8. `V1-15-*` admin/audit.
9. `V1-11-*`, `V1-13-*`, `V1-14-*`, `V1-16-*` deferred honesty, public, desktop, and common state sweep.
