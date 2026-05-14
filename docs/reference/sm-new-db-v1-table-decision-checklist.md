# SM New DB v1 Table Decision Checklist

## 1. 기준

```text
Status: working checklist
Design baseline: Team Design > 1차 디자인 완료
Scope: DB v1 core table decisions only
Not for: candidate module tables, Prisma migration, API endpoint contract
```

이 문서는 `Team Design > 1차 디자인 완료` 기준으로 DB v1 테이블을 하나씩 확정하기 위한 진행판이다.

현재 목적은 테이블별로 다음 항목을 빠짐없이 닫는 것이다.

- 테이블 목적
- 연결 화면
- 컬럼
- PK/FK
- unique/index
- 상태값
- lifecycle
- 권한/소유권
- soft delete
- audit
- API read/write 영향
- open question

후보군 기능은 이번 체크리스트에서 설계하지 않는다. 필요한 경우 이름만 `Deferred Tables`에 남기고 추후 별도 설계한다.

## 2. 완료 기준

테이블 하나가 완료되려면 아래 체크박스가 모두 완료되어야 한다.

```text
Done = 목적, 화면, 컬럼, 관계, 상태값, lifecycle, 권한, audit/index, open question이 모두 닫힌 상태
```

공통 체크 항목:

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

## 3. 진행 요약

| Domain | Done | Total | Status |
|---|---:|---:|---|
| Identity/Auth | 4 | 4 | Done |
| Terms/Master | 1 | 5 | In progress |
| User Preference/Home | 0 | 7 | Not started |
| Personal Match | 0 | 4 | Not started |
| Team | 0 | 5 | Not started |
| Team Match | 0 | 2 | Not started |
| Chat/Notification | 0 | 5 | Not started |
| Payment/Support | 0 | 5 | Not started |
| Admin/Audit | 0 | 4 | Not started |
| **Total** | **5** | **41** | **In progress** |

## 4. 결정 로그

아래 항목은 테이블을 확정하면서 누적한다.

| Date | Table | Decision | Reason | Follow-up |
|---|---|---|---|---|
| 2026-05-14 | - | 체크리스트 생성 | DB v1 core 테이블을 후보군과 분리해 하나씩 확정하기 위함 | `users`부터 검토 |
| 2026-05-14 | `users` | 계정 식별자와 계정 lifecycle 전용 테이블로 확정. 프로필 노출 정보는 `user_profiles`로 분리 | 인증/권한/actor 기준과 공개 프로필 정보를 분리해 탈퇴/차단/익명화 정책을 안정화하기 위함 | `auth_identities` 검토 |
| 2026-05-14 | `auth_identities` | provider별 로그인 identity 연결 테이블로 확정. 식별 기준은 `(provider, provider_user_key)` unique | 내부 user와 외부/로그인 provider identity를 분리하고, 다중 provider 연결 및 연결 해제 이력을 보존하기 위함 | `user_profiles` 검토 |
| 2026-05-14 | `user_profiles` | 사용자 노출 프로필 1:1 테이블로 확정. 계정 삭제 시 row 삭제 대신 노출 정보 익명화 | 과거 매치/팀/채팅/audit FK를 보존하면서 개인정보 노출을 제거하기 위함 | `user_onboarding_progress` 검토 |
| 2026-05-14 | `user_onboarding_progress` | 온보딩 상세 진행/재개 상태 1:1 테이블로 확정. `users.onboarding_status`는 summary로 분리 | 온보딩 중간 저장과 최종 preference 반영 책임을 분리하기 위함 | `terms_documents` 검토 |
| 2026-05-14 | `terms_documents` | 약관 종류/버전/게시 상태 master 테이블로 확정. 삭제 대신 `archived`로 보존 | 약관 동의 이력과 법적/운영 버전 추적을 안정적으로 유지하기 위함 | `user_terms_consents` 검토 |

## 5. Tables

### 5.1 Identity/Auth

#### `users`

- [x] 목적 확정
- [x] 연결 화면 확정
- [x] 컬럼 확정
- [x] nullable/default 확정
- [x] PK/FK 확정
- [x] unique/index 확정
- [x] status enum 필요 여부 및 값 확정
- [x] lifecycle 필요 여부 및 전이 확정
- [x] owner/permission 확정
- [x] soft delete 여부 확정
- [x] audit 필요 여부 확정
- [x] API read/write 영향 확인
- [x] open question 없음

```text
Purpose:
서비스 사용자 계정의 최상위 식별자와 계정 상태를 관리한다. 모든 도메인에서
user actor FK의 기준이 된다. 닉네임, 프로필 이미지, 소개, 매너 점수 같은
노출 정보는 `user_profiles`로 분리한다.

Screens:
01 인증/온보딩
02 홈
07 마이/프로필
09 설정/탈퇴
12 관리자/운영
전체 도메인의 created_by, updated_by, actor FK

Columns:
id uuid pk
email string nullable
phone string nullable
account_status enum not null default active
onboarding_status enum not null default not_started
last_login_at timestamptz nullable
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
deleted_at timestamptz nullable

Status:
account_status = active | suspended | blocked | withdrawal_pending | deleted
onboarding_status = not_started | terms_done | signup_done | sport_done |
  level_done | region_done | completed | deferred

Lifecycle:
created -> active
active -> suspended
suspended -> active
active -> blocked
blocked -> active 또는 deleted
active -> withdrawal_pending
withdrawal_pending -> active
withdrawal_pending -> deleted

Permissions:
user = 자기 계정 조회, 자기 탈퇴 요청, 일부 설정 변경
admin = 계정 정지/차단/복구, 탈퇴/삭제 상태 확인, 운영 목적 조회
system = 회원가입 완료, 마지막 로그인 시각 갱신, 탈퇴 유예 기간 만료 처리

Indexes:
PK = id
unique = email where email is not null
unique = phone where phone is not null
index = account_status
index = onboarding_status
index = deleted_at

Audit:
status_change_logs = account_status 변경, withdrawal_pending 전환, deleted 전환
admin_action_logs = admin에 의한 suspended/blocked/active 변경

Soft delete:
Yes. `deleted_at` 사용. 단, 개인정보 익명화/삭제 정책은 별도 계정 삭제
정책에서 다룬다.

API read/write impact:
Read = 현재 사용자 조회, 관리자 사용자 조회, actor display용 최소 사용자 참조
Write = 회원가입/소셜 로그인 시 생성, 마지막 로그인 갱신, 온보딩 요약 상태 갱신,
  탈퇴 요청, 관리자 상태 변경

Open questions:
없음
```

#### `auth_identities`

- [x] 목적 확정
- [x] 연결 화면 확정
- [x] 컬럼 확정
- [x] nullable/default 확정
- [x] PK/FK 확정
- [x] unique/index 확정
- [x] status enum 필요 여부 및 값 확정
- [x] lifecycle 필요 여부 및 전이 확정
- [x] owner/permission 확정
- [x] soft delete 여부 확정
- [x] audit 필요 여부 확정
- [x] API read/write 영향 확인
- [x] open question 없음

```text
Purpose:
사용자의 로그인 provider identity를 관리한다. 하나의 `users` row가 여러
provider identity를 가질 수 있다. 실제 외부 계정 식별 기준은
`provider + provider_user_key`다.

Screens:
01 인증/온보딩
09 설정/계정 연결
12 관리자/사용자 조회

Columns:
id uuid pk
user_id uuid not null fk users.id
provider enum not null
provider_user_key string not null
email string nullable
phone string nullable
status enum not null default active
linked_at timestamptz not null default now()
last_used_at timestamptz nullable
revoked_at timestamptz nullable
created_at timestamptz not null default now()
updated_at timestamptz not null default now()

Status:
provider = kakao | google | apple | email
status = active | revoked | blocked

Lifecycle:
none -> active
active -> revoked
active -> blocked
blocked -> active
revoked -> active

Revoked identity를 재연결하면 기존 row를 active로 복구한다. 과거 연결 이력을
유지하기 위함이다.

Permissions:
user = 자기 provider 연결 조회, 자기 provider 연결 해제
system = 로그인 성공 시 생성/갱신, last_used_at 갱신, provider callback 처리
admin = 보안/운영 목적 조회, identity blocked 처리 후보

Indexes:
PK = id
FK = user_id -> users.id
unique = (provider, provider_user_key)
index = user_id
index = provider
index = status
index = last_used_at

FK delete policy:
restrict 또는 no action. 사용자 삭제 시 identity row를 물리 삭제하지 않고
user 상태와 익명화 정책으로 처리한다.

Audit:
status_change_logs = provider identity 연결, 연결 해제, blocked 처리, blocked 해제
admin_action_logs = admin에 의한 blocked 처리/해제

Soft delete:
No. 연결 해제는 `status = revoked`, `revoked_at`으로 표현하고 row는 유지한다.

API read/write impact:
Read = 내 연결 계정 목록, 관리자 사용자 상세의 auth provider 정보
Write = OAuth callback 로그인/가입, 이메일 로그인/연결, provider 연결 해제,
  provider 재연결, 보안 차단/해제

Open questions:
없음
```

#### `user_profiles`

- [x] 목적 확정
- [x] 연결 화면 확정
- [x] 컬럼 확정
- [x] nullable/default 확정
- [x] PK/FK 확정
- [x] unique/index 확정
- [x] status enum 필요 여부 및 값 확정
- [x] lifecycle 필요 여부 및 전이 확정
- [x] owner/permission 확정
- [x] soft delete 여부 확정
- [x] audit 필요 여부 확정
- [x] API read/write 영향 확인
- [x] open question 없음

```text
Purpose:
사용자 공개/마이 프로필에 표시되는 기본 정보를 관리한다. 계정 lifecycle은
`users`가 담당하고, 프로필 노출 정보는 `user_profiles`가 담당한다.
평판/활동 집계는 `user_reputation_summaries`로 분리한다.

Screens:
02 홈 인사/요약
03 개인 매치 host/participant profile
05 팀 멤버/가입자 profile
06 채팅 avatar/name
07 마이/프로필/평판
10 공개 프로필
12 관리자 사용자 상세

Columns:
user_id uuid pk fk users.id
display_name string not null
profile_image_url string nullable
bio string nullable
visibility_status enum not null default public
created_at timestamptz not null default now()
updated_at timestamptz not null default now()

Excluded columns:
manner_score, activity_count, review_count, trust_label은 이 테이블에 두지 않는다.
평판/활동 값은 갱신 주기와 신뢰 상태가 다르므로 `user_reputation_summaries`에서
관리한다.

Status:
visibility_status = public | members_only | private

Lifecycle:
users 생성 후 profile 생성
profile 수정
users withdrawal_pending 또는 deleted 전환 시 익명화 후보

Deletion/anonymization policy:
`user_profiles` row는 물리 삭제하지 않는다. 계정 삭제는 `users.account_status = deleted`,
`users.deleted_at`으로 관리하고, `user_profiles`는 아래처럼 익명화한다.

display_name = "탈퇴한 사용자"
profile_image_url = null
bio = null
visibility_status = private

재식별 가능한 provider key, email, phone 등은 `auth_identities`와 계정 삭제 정책에서
별도로 제거/비활성화한다. 결제/분쟁/audit 등 법적 또는 업무상 보존 대상 기록은
개인정보 최소화 및 목적 제한 상태로 보존한다.

Permissions:
user = 자기 프로필 조회/수정, 자기 공개 범위 변경
related user = visibility_status에 따라 제한된 조회
admin = 운영 목적 조회, 부적절한 프로필 이미지/소개 조치 후보

Indexes:
PK = user_id
FK = user_id -> users.id
index = visibility_status

display_name은 unique로 두지 않는다. 동명이인을 허용한다.

Audit:
status_change_logs = visibility_status 변경, 탈퇴/삭제 시 익명화 처리
admin_action_logs = admin에 의한 프로필 조치
선택 = 일반 display_name/bio/profile_image_url 수정 이력은 v1 필수 아님

Soft delete:
No. 사용자 탈퇴/삭제는 `users` 상태와 `deleted_at`으로 관리하고, 프로필은 익명화한다.

API read/write impact:
Read = 내 프로필 조회, 공개 프로필 조회, 매치/팀/채팅의 actor display 정보 조회,
  관리자 사용자 상세
Write = 내 프로필 수정, 공개 범위 변경, 탈퇴/삭제 시 익명화, 관리자 프로필 조치 후보

Open questions:
없음
```

#### `user_onboarding_progress`

- [x] 목적 확정
- [x] 연결 화면 확정
- [x] 컬럼 확정
- [x] nullable/default 확정
- [x] PK/FK 확정
- [x] unique/index 확정
- [x] status enum 필요 여부 및 값 확정
- [x] lifecycle 필요 여부 및 전이 확정
- [x] owner/permission 확정
- [x] soft delete 여부 확정
- [x] audit 필요 여부 확정
- [x] API read/write 영향 확인
- [x] open question 없음

```text
Purpose:
온보딩 진행 상태를 재개할 수 있게 저장한다. `users.onboarding_status`는
계정 전체의 요약 상태이고, `user_onboarding_progress`는 단계별 선택값과
재개 위치를 저장하는 상세 상태다.

Screens:
01 인증/온보딩
01 운동 설정 1/3 종목
01 운동 설정 2/3 실력
01 운동 설정 3/3 지역
02 홈 진입 gate
09 설정에서 운동 정보 재수정 후보

Columns:
user_id uuid pk fk users.id
current_step enum not null default terms
completed_steps jsonb not null default []
selected_sport_ids uuid[] nullable
selected_level_by_sport jsonb nullable
selected_region_ids uuid[] nullable
location_permission_status enum nullable
deferred_at timestamptz nullable
completed_at timestamptz nullable
created_at timestamptz not null default now()
updated_at timestamptz not null default now()

Status:
current_step = terms | signup | sport | level | region | welcome | completed
location_permission_status = unknown | granted | denied | blocked | manual

`deferred`는 current_step 값으로 두지 않는다. 재개할 단계는 `current_step`에 남기고,
나중에 하기는 `deferred_at`으로 표현한다.

Lifecycle:
none -> terms
terms -> signup
signup -> sport
sport -> level
level -> region
region -> welcome
welcome -> completed
any incomplete -> deferred_at set
deferred -> last current_step
completed -> completed

Progress data policy:
온보딩 중간 저장/재개를 위해 선택값을 progress에 draft로 저장한다. 온보딩 완료 시
canonical 데이터는 `user_sport_preferences`, `user_regions`에 확정 반영한다.

진행 중 = user_onboarding_progress에 draft 저장
완료 시 = user_sport_preferences/user_regions에 확정 저장,
  users.onboarding_status = completed,
  user_onboarding_progress.completed_at = now()

Permissions:
user = 자기 온보딩 progress 조회/수정
system = 가입 직후 progress 생성, 온보딩 완료 시 users.onboarding_status 동기화,
  완료 시 preference tables 반영
admin = 일반 수정 없음, 운영 조회 정도만 가능

Indexes:
PK = user_id
FK = user_id -> users.id
index = current_step
index = completed_at
index = deferred_at

Audit:
일반 단계별 저장은 audit 필수 아님.
completed 전환, deferred 선택, admin/system 보정은 status_change_logs 후보.

Soft delete:
No. 사용자 삭제는 `users` 계정 삭제/익명화 정책을 따른다.

API read/write impact:
Read = 온보딩 재개 상태 조회, 현재 단계 조회
Write = 단계별 선택값 저장, 나중에 하기, 온보딩 완료,
  완료 시 user_sport_preferences/user_regions 생성 또는 갱신

Open questions:
없음
```

### 5.2 Terms/Master

#### `terms_documents`

- [x] 목적 확정
- [x] 연결 화면 확정
- [x] 컬럼 확정
- [x] nullable/default 확정
- [x] PK/FK 확정
- [x] unique/index 확정
- [x] status enum 필요 여부 및 값 확정
- [x] lifecycle 필요 여부 및 전이 확정
- [x] owner/permission 확정
- [x] soft delete 여부 확정
- [x] audit 필요 여부 확정
- [x] API read/write 영향 확인
- [x] open question 없음

```text
Purpose:
서비스 약관, 개인정보 처리방침, 위치 관련 동의, 마케팅 수신 동의 등 약관
문서의 종류와 버전, 게시 상태를 관리한다. 사용자 동의 이력은
`user_terms_consents`가 담당하고, 이 테이블은 약관 원본/버전 master 역할을 한다.

Screens:
01 약관 동의
01 회원가입/온보딩 gate
09 설정/약관
12 관리자/약관 관리 후보

Columns:
id uuid pk
terms_type enum not null
title string not null
version string not null
required boolean not null default false
content text not null
status enum not null default draft
effective_at timestamptz nullable
published_at timestamptz nullable
archived_at timestamptz nullable
requires_reconsent boolean not null default false
created_at timestamptz not null default now()
updated_at timestamptz not null default now()

Status:
terms_type = service | privacy | location | marketing
status = draft | scheduled | published | archived

Required policy:
service = required true
privacy = required true
location = required false 후보
marketing = required false

Reconsent policy:
requires_reconsent = true이면 기존 사용자가 새 버전에 다시 동의해야 한다.
requires_reconsent = false이면 공지/열람만 필요하거나 minor update로 본다.

Lifecycle:
draft -> scheduled
draft -> published
scheduled -> published
published -> archived
draft -> archived

현재 버전이 새 버전으로 대체되면 기존 published 문서는 archived로 전환한다.

Permissions:
public/user = published 약관 조회
admin = 약관 생성/수정/예약/게시/보관
system = 게시 예약 시각 도달 시 scheduled -> published 전환 후보,
  이전 버전 archived 전환 후보

Indexes:
PK = id
unique = (terms_type, version)
index = terms_type
index = status
index = required
index = effective_at

Published uniqueness:
동일 terms_type에서 published 단일성은 v1에서 DB partial unique보다 service logic으로
제어한다.

Audit:
admin_action_logs = 약관 생성, 수정, 게시, 보관, requires_reconsent 변경
status_change_logs = scheduled/published/archived 상태 전환

Soft delete:
No. 약관 문서는 법적/운영 이력으로 보존해야 하므로 삭제하지 않고 archived를 사용한다.

API read/write impact:
Read = 회원가입 약관 목록 조회, 설정 약관 목록/상세 조회, 관리자 약관 조회
Write = 관리자 약관 생성/수정, 게시 예약, 게시, 보관

Open questions:
없음
```

#### `user_terms_consents`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `sports`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `sport_levels`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `regions`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

### 5.3 User Preference/Home

#### `user_sport_preferences`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `user_regions`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `notices`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `notice_reads`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `user_activity_summaries`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `user_reputation_summaries`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `match_recommendations`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

### 5.4 Personal Match

#### `matches`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `match_media`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `match_applications`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `match_participants`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

### 5.5 Team

#### `teams`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `team_profiles`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `team_memberships`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `team_join_applications`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `team_trust_scores`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

### 5.6 Team Match

#### `team_matches`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `team_match_applications`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

### 5.7 Chat/Notification

#### `chat_rooms`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `chat_room_participants`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `chat_messages`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `notifications`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `notification_preferences`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

### 5.8 Payment/Support

#### `payments`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `payment_attempts`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `refund_requests`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `disputes`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `dispute_events`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

### 5.9 Admin/Audit

#### `admin_users`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `admin_operation_tasks`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `admin_action_logs`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

#### `status_change_logs`

- [ ] 목적 확정
- [ ] 연결 화면 확정
- [ ] 컬럼 확정
- [ ] nullable/default 확정
- [ ] PK/FK 확정
- [ ] unique/index 확정
- [ ] status enum 필요 여부 및 값 확정
- [ ] lifecycle 필요 여부 및 전이 확정
- [ ] owner/permission 확정
- [ ] soft delete 여부 확정
- [ ] audit 필요 여부 확정
- [ ] API read/write 영향 확인
- [ ] open question 없음

```text
Purpose:
Screens:
Columns:
Status:
Lifecycle:
Permissions:
Indexes:
Audit:
Open questions:
```

## 6. Deferred Tables

아래 테이블은 현재 DB v1 체크 대상에서 제외한다. 필요성이 확정되면 별도 문서 또는 v1.1/v2에서 설계한다.

| Table | 보류 이유 |
|---|---|
| `venues` | core create flow에서 장소 선택 후보로 언급되지만 시설 self-service는 후보군이다. v1에서는 manual place 또는 외부/master reference로 대체 가능 여부 확인 후 결정 |
| `user_permission_states` | 위치/알림 권한은 화면 상태로 필요하지만 DB 저장 필요성은 불명확 |
| `search_histories` | 최근 검색 저장은 UX 후보. v1 필수 여부 확인 후 포함 가능 |
| `saved_filters` | 저장 필터는 현재 v1 필수 아님 |
| `match_rules` | v1에서는 `matches.rules_text` 또는 `matches.rules`로 단순화 가능 |
| `match_waitlist_entries` | 대기열 v1 포함 여부 미정 |
| `match_notification_subscriptions` | 매치별 알림 구독이 v1 필수인지 미정 |
| `team_match_styles` | v1에서는 `team_matches.play_style_codes` 등으로 단순화 가능 |
| `team_match_invitations` | 초대/공유 세부 흐름 v1 필수 여부 미정 |
| `chat_attachments` | 채팅 이미지 첨부 v1 포함 여부 미정 |
| `chat_context_links` | 채팅방 맥락 링크가 linked entity로 충분한지 확인 필요 |
| `notification_delivery_events` | 발송/실패 이벤트 추적은 v1 운영 요구에 따라 추가 |
| `notification_reads` | 알림이 user별 row이면 `notifications.read_at`으로 단순화 가능 |
| `payment_ledger_events` | v1에서는 `payment_attempts`, `status_change_logs`, `admin_action_logs`로 대체 가능 여부 확인 |
| `refund_events` | v1에서는 `refund_requests`와 audit log로 단순화 가능 |
| `admin_permissions` | v1에서는 `admin_users.admin_role`로 시작하고 capability는 추후 검토 |
| `moderation_reports` | 신고/검수 세부 모델은 관리자 v1 범위 확정 후 검토 |
| `share_events` | 공유 이벤트는 analytics/business 필요성이 확정되면 추가 |
| `user_drafts` | client-only draft로 처리 가능하면 DB 제외 |

## 7. 다음 검토 순서

1. `users`
2. `auth_identities`
3. `user_profiles`
4. `user_onboarding_progress`
5. `terms_documents`
6. `user_terms_consents`
7. `sports`
8. `sport_levels`
9. `regions`

Identity/Auth와 Terms/Master를 먼저 닫은 뒤, Personal Match와 Team 도메인으로 넘어간다.
