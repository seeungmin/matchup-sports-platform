# SM New DB Table Definition

```text
Status: draft table definition
Source: docs/reference/team-design-first-design-db-plan.md
Design baseline: Team Design > 1차 디자인 완료
Schema status: candidate only
```

이 문서는 현재 DB 설계 초안의 테이블 정의서다. 타입은 문서의 후보 컬럼을 기준으로
추정한 설계 타입이며, 실제 Prisma/PostgreSQL 타입 확정 전이다.

## 공통 컬럼 정책 후보

| 컬럼 | 타입 | nullable | 기본값 | 설명 | 확정 필요 |
|---|---|---:|---|---|---|
| `id` | uuid | No | generated | PK. 일부 1:1 테이블은 parent id를 PK/FK로 사용 | No |
| `created_at` | timestamptz | No | now() | 생성 시각 | No |
| `updated_at` | timestamptz | No | now()/trigger | 수정 시각 | No |
| `deleted_at` | timestamptz | Yes | null | soft delete 필요 테이블에만 적용 | Yes |
| `created_by` | uuid | Yes | null | 생성 actor. 사용자/관리자/system 분리 필요 | Yes |
| `updated_by` | uuid | Yes | null | 수정 actor | Yes |

## 테이블 정의 요약

| 테이블명 | 목적 | PK | 주요 FK | 상태값 컬럼 | Soft delete | Audit 컬럼 | 권한 컬럼 | Draft | 확인 필요 |
|---|---|---|---|---|---|---|---|---|---|
| `users` | 서비스 사용자 | `id` | - | `account_status`, `onboarding_status` | Yes | `created_at`, `updated_at`, `deleted_at` | `account_status` | No | blocked/suspended/deleted 정책 |
| `auth_identities` | 소셜/이메일 인증 연결 | `id` | `user_id` | `status` | No | `linked_at` | provider identity | No | provider별 unique 정책 |
| `user_profiles` | 공개/마이 프로필 | `user_id` | `user_id` | `visibility_status` | No | `updated_at` | visibility | No | `users`와 컬럼 중복 |
| `user_onboarding_progress` | 온보딩 resume | `user_id` | `user_id` | `current_step` | No | `deferred_at`, `completed_at` | - | Yes | deferred 허용 step |
| `user_permission_states` | 위치/알림 권한 snapshot | `id` | `user_id` | `status` | No | `last_checked_at` | permission type | No | DB 저장 필요성 |
| `terms_documents` | 약관 문서 버전 | `id` | - | `status` | No | `published_at` | required flag | No | 재동의 요구 모델 |
| `user_terms_consents` | 약관 동의 이력 | `id` | `user_id`, `terms_document_id` | consent active/revoked 후보 | No | `consented_at`, `revoked_at` | user consent | No | IP/user agent 저장 여부 |
| `sports` | 종목 master | `id` | - | `is_active` | No | - | - | No | enum vs master |
| `sport_levels` | 종목별 실력 코드 | `id` | `sport_id` | - | No | - | - | No | sport별 level 체계 |
| `regions` | 활동 지역 master | `id` | `parent_id` | `is_active` | No | - | - | No | 행정구역 depth |
| `venues` | 시설 선택 후보 | `id` | `region_id` | `is_active` | 후보 | `created_at`, `updated_at` | owner 후보 없음 | No | 시설 self-service 범위 |
| `user_sport_preferences` | 관심 종목/실력 | `id` | `user_id`, `sport_id` | - | No | `updated_at` | user-owned | No | level FK 여부 |
| `user_regions` | 활동 지역 | `id` | `user_id`, `region_id` | - | No | `updated_at` | user-owned | No | source 값 정의 |
| `search_histories` | 최근 검색 | `id` | `user_id` nullable | - | No | `searched_at` | user-owned | No | 저장 범위/보관 기간 |
| `saved_filters` | 저장/복원 필터 | `id` | `user_id` | - | No | `created_at`, `updated_at` | user-owned | Yes | v1 포함 여부 |
| `user_settings` | 계정/개인정보 설정 | `user_id` | `user_id` | - | No | `updated_at` | user-owned | No | privacy field 범위 |
| `account_deletion_requests` | 탈퇴 요청/대기 | `id` | `user_id` | `status` | No | request/cancel timestamps | user/admin/system | No | 유예 기간 |
| `user_activity_summaries` | 홈 월간 활동 요약 | `id` | `user_id` | - | No | `period_month`, `updated_at` | user-owned | No | 집계 source |
| `user_reputation_summaries` | 매너/평판 요약 | `user_id` | `user_id` | trust signal 후보 | No | `updated_at` | visibility | No | 산정 근거 테이블 |
| `match_recommendations` | 홈 추천 캐시 | `id` | `user_id`, `match_id` | stale 후보 | No | `snapshot_at` | - | No | 저장 vs 계산 |
| `notices` | 공지 | `id` | - | `status` | 후보 | publish window | admin-owned | No | 비로그인 노출 |
| `notice_reads` | 공지 읽음 | `id` | `notice_id`, `user_id` | read | No | `read_at` | user-owned | No | user별 notice 필요성 |
| `matches` | 개인 매치 | `id` | `host_user_id`, `sport_id`, `venue_id` | `status` | Yes 후보 | `created_by`, `updated_by` | host/manager/admin | 후보 | draft 저장 여부 |
| `match_media` | 매치 이미지 | `id` | `match_id`, `uploaded_by` | processing 후보 | Yes 후보 | upload actor | host-owned | No | `files` 통합 여부 |
| `match_rules` | 추가 규칙 | `id` | `match_id` | - | No | - | host-owned | No | 단순 text array 가능성 |
| `match_applications` | 참가 신청/승인 | `id` | `match_id`, `user_id`, approver FKs | `status` | No | decision timestamps | applicant/approver | No | 결제 전후 순서 |
| `match_participants` | 확정 참가자 | `id` | `match_id`, `user_id`, `payment_id` | `status` | No | `joined_at` | participant/host | No | application과 생성 순서 |
| `match_waitlist_entries` | 대기열 후보 | `id` | `match_id`, `user_id` | `status` | No | request/promote timestamps | applicant/system | Yes | v1 포함 여부 |
| `match_notification_subscriptions` | 매치 알림 설정 | `id` | `match_id`, `user_id` | `enabled` | No | `created_at` | user-owned | No | notification preference와 중복 |
| `teams` | 서비스 팀 기본 정보 | `id` | `owner_user_id`, `sport_id` | `status`, `visibility` | Yes | `created_by`, `updated_by` | owner/admin | 후보 | owner source 중복 |
| `team_profiles` | 팀 상세 소개 | `team_id` | `team_id` | - | No | `updated_at` | manager+ | No | JSONB 정규화 |
| `team_memberships` | 팀 멤버/권한 | `id` | `team_id`, `user_id` | `status` | No | role/join timestamps | `role` | No | owner role 중복 |
| `team_join_applications` | 팀 가입 신청 | `id` | `team_id`, `user_id`, approver FKs | `status` | No | decision timestamps | applicant/manager | No | 자동 승인 정책 |
| `team_trust_scores` | 팀 신뢰/평판 요약 | `team_id` | `team_id` | `verified_state`, `sample_state` | No | `updated_at` | visibility | No | 산정 근거 |
| `team_matches` | 팀매치 모집 | `id` | `host_team_id`, `created_by`, `sport_id`, `venue_id` | `status` | Yes 후보 | actor columns | team manager/admin | 후보 | 상대팀 확정 모델 |
| `team_match_styles` | 팀매치 스타일 태그 | `id` | `team_match_id` | - | No | - | host manager | No | enum array 가능성 |
| `team_match_applications` | 상대팀 신청/승인 | `id` | `team_match_id`, `applicant_team_id`, `requested_by`, approver FKs, `payment_id` | `status` | No | decision timestamps | team manager | No | 결제 주체/시점 |
| `team_match_invitations` | 상대팀/링크 초대 | `id` | `team_match_id`, `target_team_id` | `status` | No | `sent_at` | host manager | Yes | v1 포함 여부 |
| `chat_rooms` | 채팅방 | `id` | polymorphic link | `status` | 후보 | `last_message_at` | participants/admin | No | target FK 무결성 |
| `chat_room_participants` | 채팅 참여자 상태 | `id` | `room_id`, `user_id` | `status`, `pinned` | No | `left_at` | participant-owned | No | mute/read 구조 |
| `chat_messages` | 메시지 | `id` | `room_id`, `sender_user_id` | `status` | Yes 후보 | `sent_at`, `deleted_at` | sender/admin | No | 실패 재시도 |
| `chat_attachments` | 채팅 이미지 첨부 후보 | `id` | `message_id`, `uploaded_by` | `status` | Yes 후보 | upload actor | sender | Yes | v1 포함 여부 |
| `chat_context_links` | 채팅방 맥락 바로가기 | `id` | `room_id` | - | No | - | system/admin | Yes | 반복 항목 확인 |
| `notifications` | 알림 | `id` | `user_id` | `status` | 후보 | `created_at` | user/system | No | read table 중복 |
| `notification_delivery_events` | 알림 발송/실패 이력 | `id` | `notification_id` | `status` | No | `created_at`, error fields | system | Yes | 적재량/보관 |
| `notification_reads` | 알림 읽음 상태 | `id` | `notification_id`, `user_id` | read | No | `read_at` | user-owned | Yes | user별 알림이면 중복 |
| `notification_preferences` | 알림 설정 | `user_id` | `user_id` | booleans | No | `updated_at` | user-owned | No | category granularity |
| `payments` | 결제 대표 레코드 | `id` | `payer_user_id`, polymorphic target | `payment_mode`, `status` | No | approved/failed timestamps | payer/system/admin | No | FK 무결성 |
| `payment_attempts` | 결제 시도 이력 | `id` | `payment_id` | `status` | No | request/response timestamps | provider/system | No | idempotency key |
| `payment_ledger_events` | 결제 변경 이력 후보 | `id` | `payment_id` | from/to status | No | actor, amount | system/admin | Yes | status log와 중복 |
| `refund_requests` | 환불 요청 | `id` | `payment_id`, `requester_user_id` | `status` | No | reviewed fields | requester/admin | No | 요청 취소 여부 |
| `refund_events` | 환불 처리 이력 후보 | `id` | `refund_request_id` | from/to status | No | actor/reason | admin/provider | Yes | status log와 중복 |
| `disputes` | 분쟁 | `id` | polymorphic target, `opened_by`, `assigned_admin_id` | `status` | No | opened/assigned/resolved timestamps 후보 | requester/admin | No | target 허용 범위 |
| `dispute_events` | 분쟁 이력 | `id` | `dispute_id` | event type | No | actor/body timestamp | user/admin/system | No | message와 분리 |
| `admin_users` | 관리자 계정/권한 | `user_id` | `user_id` | `admin_role`, `status` | No | `last_active_at` | admin role | No | capability 필요성 |
| `admin_permissions` | 관리자 capability 후보 | `id` | `admin_user_id`, `granted_by` | revoked state | No | grant/revoke timestamps | permission code | Yes | role enum으로 충분한지 |
| `admin_operation_tasks` | 운영 큐 | `id` | `assigned_admin_id` | `status` | No | due/summary | assigned admin | No | lock/concurrency |
| `admin_action_logs` | 관리자 조치 audit | `id` | `admin_user_id` | action type | No | before/after/reason | admin actor | No | status log와 책임 분리 |
| `moderation_reports` | 신고/검수 | `id` | `reporter_user_id`, `assigned_admin_id` | `status` | No | `created_at` | reporter/admin | No | report target type |
| `status_change_logs` | 상태 변경 이력 | `id` | polymorphic target | from/to status | No | actor/reason | all actors | No | 도메인 이벤트와 중복 |
| `share_events` | 공유/초대 이벤트 | `id` | `actor_user_id`, polymorphic target | `status` | No | `created_at` | actor | Yes | analytics vs business |
| `user_drafts` | 작성 중 draft 후보 | `id` | `user_id` | `status` | No | `expires_at` | user-owned | Yes | v1 임시저장 확정 |

## 컬럼 상세 정의

아래는 API 설계 전에 타입/nullable/default/상태값을 닫아야 하는 핵심 컬럼이다.
단순 표시 컬럼은 테이블 정의 요약의 `주요 컬럼` 후보를 따른다.

### Identity / User

| 테이블 | 컬럼 | 타입 | nullable | 기본값 | 설명 | 상태값 후보 | API 전 확정 |
|---|---|---|---:|---|---|---|---|
| `users` | `email` | string | Yes | null | 로그인/연락 이메일 | - | unique nullable 정책 |
| `users` | `account_status` | enum/string | No | `active` 후보 | 계정 lifecycle | `active`, `blocked`, `suspended`, `withdrawal_pending`, `deleted` | Yes |
| `users` | `onboarding_status` | enum/string | No | `not_started` 후보 | 온보딩 진행 상태 | `not_started`, `terms_done`, `signup_done`, `sport_done`, `level_done`, `region_done`, `completed`, `deferred` | Yes |
| `users` | `deleted_at` | timestamptz | Yes | null | soft delete | - | 탈퇴/삭제 정책 |
| `auth_identities` | `provider` | enum/string | No | - | OAuth/email provider | provider set | Yes |
| `auth_identities` | `status` | enum/string | No | `active` 후보 | 연결 상태 | `active`, `revoked`, `blocked` 후보 | Yes |
| `user_profiles` | `visibility_status` | enum/string | No | `public` 후보 | 공개 범위 | `public`, `members_only`, `private` 후보 | Yes |
| `user_permission_states` | `permission_type` | enum/string | No | - | 위치/알림 등 | `location`, `notification` 후보 | Yes |
| `user_permission_states` | `status` | enum/string | No | `unknown` | 권한 상태 | `unknown`, `granted`, `denied`, `blocked`, `manual` | Yes |

### Terms / Onboarding / Master

| 테이블 | 컬럼 | 타입 | nullable | 기본값 | 설명 | 상태값 후보 | API 전 확정 |
|---|---|---|---:|---|---|---|---|
| `terms_documents` | `terms_type` | enum/string | No | - | 약관 종류 | service/privacy/marketing 후보 | Yes |
| `terms_documents` | `version` | string | No | - | 약관 버전 | - | version unique 정책 |
| `terms_documents` | `required` | boolean | No | false | 필수 여부 | - | Yes |
| `terms_documents` | `status` | enum/string | No | `draft` | 게시 상태 | `draft`, `scheduled`, `published`, `archived` | Yes |
| `user_terms_consents` | `consented` | boolean | No | true | 동의 여부 | - | 철회 모델 |
| `user_terms_consents` | `revoked_at` | timestamptz | Yes | null | 선택 약관 철회 | revoked 후보 | Yes |
| `sports` | `code` | string | No | - | 종목 코드 | - | master vs enum |
| `sport_levels` | `rank_order` | int | No | - | 레벨 정렬 | - | sport별 scale |
| `regions` | `parent_id` | uuid | Yes | null | 행정구역 계층 | - | depth 정책 |

### Match

| 테이블 | 컬럼 | 타입 | nullable | 기본값 | 설명 | 상태값 후보 | API 전 확정 |
|---|---|---|---:|---|---|---|---|
| `matches` | `host_user_id` | uuid | No | - | 생성/운영 주체 | - | manager 모델 |
| `matches` | `venue_id` | uuid | Yes | null | 시설 선택 | - | manual place와 배타성 |
| `matches` | `manual_place_name` | string | Yes | null | 직접 장소 | - | validation |
| `matches` | `starts_at`, `ends_at` | timestamptz | No | - | 경기 시간 | - | timezone |
| `matches` | `capacity` | int | No | - | 정원 | - | min/max |
| `matches` | `fee_amount` | int | No | 0 | 참가비 | - | currency |
| `matches` | `status` | enum/string | No | `draft` or `recruiting` 후보 | 매치 lifecycle | `draft`, `recruiting`, `deadline_soon`, `full`, `waitlist_open`, `closed`, `cancelled`, `completed`, `expired` | Yes |
| `match_applications` | `status` | enum/string | No | `requested` | 신청 lifecycle | `requested`, `payment_pending`, `pending_approval`, `approved`, `rejected`, `withdrawn`, `cancelled_by_host`, `expired` | Yes |
| `match_applications` | `approved_by`, `rejected_by` | uuid | Yes | null | 승인/거절 actor | - | 권한 matrix |
| `match_participants` | `status` | enum/string | No | `approved` 후보 | 참가 상태 | `approved`, `checked_in`, `no_show`, `completed`, `removed` | Yes |
| `match_waitlist_entries` | `status` | enum/string | No | `requested` | 대기열 상태 | `requested`, `promoted`, `expired`, `withdrawn` 후보 | v1 여부 |

### Team / Team Match

| 테이블 | 컬럼 | 타입 | nullable | 기본값 | 설명 | 상태값 후보 | API 전 확정 |
|---|---|---|---:|---|---|---|---|
| `teams` | `owner_user_id` | uuid | No | - | 팀 소유자 | - | membership owner와 중복 |
| `teams` | `status` | enum/string | No | `active` 후보 | 팀 lifecycle | `active`, `hidden`, `suspended`, `deleted` 후보 | Yes |
| `teams` | `visibility` | enum/string | No | `public` 후보 | 노출 범위 | `public`, `private`, `invite_only` 후보 | Yes |
| `team_profiles` | `join_policy` | enum/string | No | `approval_required` 후보 | 가입 정책 | `open`, `approval_required`, `closed` 후보 | Yes |
| `team_memberships` | `role` | enum/string | No | `member` | 팀 권한 | `owner`, `manager`, `member` | Yes |
| `team_memberships` | `status` | enum/string | No | `active` | 멤버 상태 | `active`, `left`, `removed`, `pending` 후보 | Yes |
| `team_join_applications` | `status` | enum/string | No | `requested` | 가입 신청 | `requested`, `pending`, `approved`, `rejected`, `withdrawn`, `blocked` | Yes |
| `team_matches` | `status` | enum/string | No | `draft` or `recruiting` 후보 | 팀매치 lifecycle | `draft`, `recruiting`, `application_pending`, `matched`, `closed`, `cancelled`, `completed` | Yes |
| `team_matches` | `free_invite` | boolean | No | false | 무료초청 여부 | - | 1차 범위 |
| `team_matches` | `mercenary_allowed` | boolean | No | false 후보 | 용병 허용 | - | 1차 범위 |
| `team_matches` | `referee_assigned` | boolean | No | false 후보 | 심판 배정 | - | 1차 범위 |
| `team_match_applications` | `status` | enum/string | No | `requested` | 상대팀 신청 | `requested`, `payment_pending`, `pending`, `approved`, `rejected`, `withdrawn`, `expired` | Yes |
| `team_match_applications` | `requested_by` | uuid | No | - | 신청 actor | - | manager+ 검증 |

### Chat / Notification

| 테이블 | 컬럼 | 타입 | nullable | 기본값 | 설명 | 상태값 후보 | API 전 확정 |
|---|---|---|---:|---|---|---|---|
| `chat_rooms` | `room_type` | enum/string | No | - | 방 유형 | match/team_match/team/direct 후보 | Yes |
| `chat_rooms` | `linked_entity_type`, `linked_entity_id` | string/uuid | Yes | null | 맥락 엔티티 | - | FK 무결성 |
| `chat_rooms` | `status` | enum/string | No | `active` | 방 상태 | `active`, `archived`, `expired` | Yes |
| `chat_room_participants` | `status` | enum/string | No | `active` | 참여자 상태 | `active`, `muted`, `left`, `blocked` | Yes |
| `chat_room_participants` | `pinned` | boolean | No | false | user별 고정 | - | Yes |
| `chat_messages` | `status` | enum/string | No | `sent` | 메시지 상태 | `sent`, `failed`, `deleted` 후보 | Yes |
| `notifications` | `status` | enum/string | No | `created` | 알림 상태 | `created`, `delivered`, `failed`, `read`, `archived` | Yes |
| `notification_delivery_events` | `event_type` | enum/string | No | - | 발송 이벤트 | push/in_app/websocket 후보 | Yes |
| `notification_preferences` | `*_enabled` | boolean | No | true | category opt-out | - | category set |

### Payment / Refund / Dispute / Admin

| 테이블 | 컬럼 | 타입 | nullable | 기본값 | 설명 | 상태값 후보 | API 전 확정 |
|---|---|---|---:|---|---|---|---|
| `payments` | `target_type`, `target_id` | string/uuid | No | - | 결제 대상 | match/team_match 등 | target 범위 |
| `payments` | `payment_mode` | enum/string | No | `test_only` 후보 | 정직성 모드 | `test_only`, `mock`, `live`, `legacy_unavailable` | Yes |
| `payments` | `status` | enum/string | No | `prepared` | 결제 상태 | `prepared`, `pending`, `paid`, `failed`, `cancelled`, `refunding`, `refunded`, `unavailable` | Yes |
| `payment_attempts` | `provider_request_id` | string | Yes | null | provider/idempotency 후보 | - | Yes |
| `payment_attempts` | `status` | enum/string | No | `pending` | 시도 상태 | provider status mapping | Yes |
| `refund_requests` | `status` | enum/string | No | `requested` | 환불 상태 | `requested`, `reviewing`, `approved`, `rejected`, `processing`, `processed`, `failed` | Yes |
| `disputes` | `target_type`, `target_id` | string/uuid | No | - | 분쟁 대상 | payment/match/team_match/chat/report 후보 | target 범위 |
| `disputes` | `status` | enum/string | No | `opened` | 분쟁 상태 | `opened`, `assigned`, `admin_reviewing`, `waiting_user`, `resolved`, `rejected`, `cancelled` | Yes |
| `admin_users` | `admin_role` | enum/string | No | - | 관리자 역할 | owner/ops/support 후보 | capability 필요성 |
| `admin_permissions` | `permission_code` | string | No | - | 세부 권한 | - | v1 포함 여부 |
| `admin_operation_tasks` | `status` | enum/string | No | `open` | 운영 task | `open`, `assigned`, `in_review`, `blocked`, `resolved`, `failed` | Yes |
| `admin_action_logs` | `before_state`, `after_state` | jsonb | Yes | null | 관리자 조치 audit | - | required 범위 |
| `status_change_logs` | `target_type`, `target_id` | string/uuid | No | - | 공통 상태 변경 대상 | - | 도메인 이벤트와 중복 |

## 과도한 분리 가능성

| 후보 | 과도 분리 가능성 | 검토 방향 |
|---|---|---|
| `match_rules` | 높음 | 단순 문자열 배열이면 `matches.rules jsonb/text[]` 가능 |
| `team_match_styles` | 중간 | 태그 검색이 중요하면 분리, 아니면 enum array 가능 |
| `notification_reads` | 중간 | 알림이 user별 row이면 `notifications.read_at`로 충분할 수 있음 |
| `payment_ledger_events` + `status_change_logs` | 높음 | 결제 전용 ledger와 공통 status log 책임 분리 필요 |
| `refund_events` + `status_change_logs` | 높음 | refund event가 필요한 provider 세부 정보가 있는지 확인 |
| `admin_permissions` | 중간 | role enum으로 충분하면 v1 제외 가능 |
| `chat_context_links` | 높음 | linked entity 하나로 충분하면 제외 가능 |
| `user_drafts` | 중간 | client-only draft면 DB 제외 가능 |
