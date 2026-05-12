# Handoff SM New Direction Review

## 평가 기준

이 평가는 `docs/reference/handoff-sm-new-direction` 관련 문서를 대상으로 한다.

이번 평가의 유일한 디자인 기준은 `Team Design > 1차 디자인 완성`이다. 프로젝트 내부의 과거 디자인, 기능, 설계, 기존 코드, 기존 DB/API 문서는 참고 증거로만 본다. 기존 구조를 그대로 재사용하는 판단은 하지 않는다.

## 1. 현재 기준 문서

| 우선순위 | 문서/소스 | 평가 |
|---:|---|---|
| 1 | `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html` | 실제 `Team Design` 프로토타입 원본. `SMNewViewerGuide`의 `1차 디자인 완료` 모드와 `SM_FIRST_DESIGN_COMPLETE_SECTIONS`가 현재 기준이다. |
| 2 | `docs/reference/team-design-first-design-db-plan.md` | `Team Design > 1차 디자인 완료`만 기준으로 DB를 역산한 초안. API 설계 전 DB 후보/갭 확인용으로 유지 가능하다. |
| 3 | `docs/reference/handoff-sm-new-direction/prototype-system/MODULE_MAP.md`의 `First Design Complete Sections` | `1차 디자인 완료` 묶음이 어떤 core/candidate 섹션과 연결되는지 설명한다. 단, 과거 module map 설명도 섞여 있어 보조 색인으로만 사용한다. |
| 4 | `docs/reference/handoff-sm-new-direction/0502-design-freeze-brief.md` | 0502 입력을 구조화한 문서. `1차 디자인 완료`를 해석하는 보조 근거로 유효하지만, 원문 `0502 문서화.md`가 현재 폴더에 없어 원문 검증은 확인 필요다. |

`SM_FIRST_DESIGN_COMPLETE_SECTIONS` 기준 섹션은 다음 17개다.

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

## 2. 현재 방향성과 충돌하는 문서

| 문서 | 충돌 내용 | 처리 |
|---|---|---|
| `docs/reference/handoff-sm-new-direction-plan.md` | 초기 plan은 용병/종목·실력·안전을 core로 두고, 레슨/장터/시설만 candidate로 둔다. 현재 `1차 디자인 완료` 기준과 `DIRECTION.md`의 최신 override와 맞지 않는다. | deprecated priority. 새 API/DB 설계 기준으로 사용 금지. |
| `docs/reference/handoff-sm-new-direction/DIRECTION.md` | 최신 core/candidate 분류는 유효하지만, 문서 안에 “canonical design rules still live in `DESIGN.md`”와 기존 bottom nav `home/matches/teams/marketplace/more` 보존 문구가 있다. 이번 기준은 `Team Design > 1차 디자인 완성`뿐이므로 충돌한다. | 방향 참고만 유지. 기준 문서로 사용 금지. |
| `docs/reference/handoff-sm-new-direction/INDEX.md` | candidate pack을 기존 `DESIGN.md`, `.impeccable.md`, `globals.css` 아래 reference로 둔다. 이번 재설계 기준과 다르다. | 진입 색인으로만 유지. 기준 문구는 수정 필요. |
| `docs/reference/handoff-sm-new-direction/HANDOFF.md` | 기존 디자인 문법과 기존 구현 기준을 계속 언급한다. 또한 bottom nav 충돌을 “확인 필요”로 남긴다. | handoff 배경 참고만 유지. 현재 기준과 충돌하는 rule 문구는 deprecated. |
| `prototype-system/BOTTOM_NAV_CONTRACT_FIX27.md` | 기존 production-aligned nav `home/matches/teams/marketplace/more`를 기준으로 한다. `1차 디자인 완료`의 5탭 `홈/매치/팀매치/팀/마이`와 충돌한다. | deprecated 추천. |
| `prototype-system/ROUTE_OWNERSHIP_MANIFEST_FIX27.md` | 기존 source route ownership 기반이다. “기존 기능/DB/API/코드 그대로 사용 금지” 조건과 맞지 않는다. | 참고 evidence만 유지. API 설계 기준으로 사용 금지. |
| `SOURCE_PROTOTYPE_PARITY.md` | 실제 `apps/web` source parity를 우선순위로 삼는다. 이번 방향은 기존 source를 기준으로 삼지 않는다. | deprecated 추천. |
| `SECTION_UNIFICATION_MATRIX.md` | 기준을 `DESIGN.md`, strongest boards `00~00h`, 기존 route로 둔다. `Team Design > 1차 디자인 완성` 단일 기준과 충돌한다. | deprecated 추천. |
| `SYSTEM_CANDIDATE.md` | `00 · Toss DNA`와 `00b~00h`를 기준 팩으로 승격하자는 결론이다. 이번 기준은 `1차 디자인 완료`이다. | 과거 디자인 시스템 후보로만 보존. |
| `sports-platform/project/uploads/DESIGN.md` | Toss 기반 일반 디자인 노트다. `Team Design > 1차 디자인 완성` 자체가 아니다. | archive source. 기준 사용 금지. |

## 3. 유지해야 하는 문서

| 문서 | 유지 이유 | 사용 방식 |
|---|---|---|
| `Teameet Design.html` | 현재 유일한 실제 디자인 원본이다. | 최상위 기준. `1차 디자인 완료` 모드만 사용. |
| `team-design-first-design-db-plan.md` | 현재 기준 디자인에서 DB 후보를 역산한 유일한 문서다. | DB 초안으로 유지하되, 미완성/확인 필요 표시를 유지. |
| `prototype-system/MODULE_MAP.md` | `First Design Complete Sections` 색인이 있다. | 섹션 탐색용. 과거 모듈 번호는 주의. |
| `0502-design-freeze-brief.md` | 홈/매치/팀매치/팀/채팅/알림 등 핵심 의사결정과 애매한 항목 로그가 있다. | `1차 디자인 완료` 해석 보조. 원문 부재 확인 필요. |
| `ARCHIVE.md` | 과거 문서의 성격과 deprecated priority를 분리한다. | 보존 정책 문서로 유지. |
| `CLEANUP_PLAN.md` | 문서 중복/충돌을 이미 식별했다. | 이번 리뷰 이후 정리 작업의 참고로 유지. |
| `COMPONENT_CATALOG.md` | 컴포넌트 후보를 나열한다. | API/DB 기준은 아니며 UI component 참고만. |
| `COMMON_FLOWS.md`, `INTERACTIONS_AND_STATES.md`, `CASE_COVERAGE_MATRIX.md` | 상태/흐름 coverage를 확인할 수 있다. | `1차 디자인 완료`에서 빠진 상태를 확인하는 참고 evidence. |

## 4. Deprecated 추천 문서

deprecated는 삭제가 아니라 “새 DB/API 설계의 기준으로 쓰지 말라”는 의미다.

| 문서/그룹 | 사유 |
|---|---|
| `handoff-sm-new-direction-plan.md` | 현재 기준보다 오래된 core/candidate 분류를 담고 있다. |
| `SOURCE_PROTOTYPE_PARITY.md` | 기존 source route parity 중심이다. 이번 작업은 기존 코드/기능을 가져오지 않는다. |
| `SECTION_UNIFICATION_MATRIX.md` | `DESIGN.md`, `00~00h`, 기존 route를 기준으로 삼는다. |
| `SYSTEM_CANDIDATE.md` | `00 Toss DNA` 승격안이다. 현재 기준은 `1차 디자인 완료`다. |
| `prototype-system/BOTTOM_NAV_CONTRACT_FIX27.md` | bottom nav가 `1차 디자인 완료`의 5탭과 다르다. |
| `prototype-system/ROUTE_OWNERSHIP_MANIFEST_FIX27.md` | 기존 앱 route 소유권 기반이다. |
| `prototype-system/PRODUCTION_HANDOFF_FIX26.md` | production migration 전제 문서다. 새 설계의 출발점으로 부적합하다. |
| `prototype-system/DESIGN_QA_FIX*.md`, `PAGE_READINESS_AUDIT_FIX*.md` | 과거 QA 라운드 증거다. 기준 문서가 아니라 archive evidence다. |
| `sports-platform/project/uploads/DESIGN.md` | Toss 디자인 일반 노트이며 `1차 디자인 완료` 자체가 아니다. |
| `sports-platform/chats/chat1.md` | 원 대화 source evidence일 뿐 현재 기준 문서가 아니다. |

## 5. 현재 DB 설계 상태 평가

`team-design-first-design-db-plan.md`는 방향이 맞다. 기존 schema를 복사하지 않고 `1차 디자인 완료` 화면에서 필요한 데이터 후보를 역산한다는 점은 현재 작업 조건과 일치한다.

다만 상태는 “API 설계 가능한 완성 DB 설계”가 아니라 “초기 엔티티 후보 목록”에 가깝다.

강점:

- core 섹션 00~13과 Admin까지 화면별 데이터 요구를 한 번씩 훑었다.
- 사용자, 약관, 온보딩, 매치, 팀, 팀매치, 채팅, 알림, 결제, 환불, 분쟁, 관리자 audit의 큰 축은 포함한다.
- 결제 상태와 신청/승인 상태를 분리해야 한다는 방향이 맞다.
- `verified`, `estimated`, `sample`, `mock/test` 같은 신뢰/거래 상태를 별도로 보아야 한다는 문제의식이 있다.

미완성/위험:

- 0502 기준에서 “만들기 흐름”, “팀 둘러보기 본문”, “my team 이동 대상”이 미정인데 DB 초안은 이미 일부 테이블을 제안한다.
- 상태값이 후보 수준이다. 상태 전이, actor, 권한, 취소/만료/완료/노쇼/대기열 같은 lifecycle이 아직 닫히지 않았다.
- 팀/팀매치/개인매치의 소유권과 운영 권한 모델이 API 설계에 충분한 수준으로 정의되지 않았다.
- 결제/환불/분쟁은 테이블 후보는 있지만, “테스트 결제/실청구 없음/legacy unavailable/실패 재시도” 정책이 상태 기계로 고정되지 않았다.
- 추천/검색/날씨/공지/통계는 저장/캐시/API 계산 경계가 불명확하다.
- 기존 코드 참고 목록이 문서에 포함되어 있어, 이후 작업자가 기존 schema/API를 기준처럼 오해할 위험이 있다.

결론: DB 문서는 유지하되 `draft`, `확인 필요`, `API 설계 전 정책 필요` 상태를 명확히 표시해야 한다.

## 6. 누락된 엔티티/관계/상태값

### 엔티티/관계 누락 또는 보강 필요

- `files` / `media_assets`: 매치/팀매치/팀/프로필 이미지 업로드, 소유자, 처리 상태, 삭제 상태.
- `review_requests`, `reviews`, `review_targets`: 경기 후 리뷰/평판의 source, 작성 가능 조건, 중복 방지.
- `reputation_events`: 매너 점수/신뢰 점수 산정 근거. 단순 summary만으로는 검증 가능성이 부족하다.
- `team_roles` 또는 role capability matrix: owner/manager/member의 생성, 수정, 승인, 멤버 관리 권한.
- `match_waitlist` / `team_match_waitlist`: 모집 완료 후 대기 신청 가능 여부가 디자인에 언급된다.
- `match_lifecycle_events`, `team_match_lifecycle_events`: 모집, 마감, 승인, 취소, 완료 이력.
- `attendance_checkins`: 참가 확정 이후 실제 경기 출석/노쇼를 다룰 경우 필요. `확인 필요`.
- `participant_profiles_snapshot`: 참가자 목록/더보기에서 당시 닉네임, 이미지, 레벨을 어떻게 보여줄지 정책 필요.
- `weather_snapshots`: 홈 날씨를 DB/cache로 둘지 외부 API로 둘지 확인 필요.
- `recommendation_snapshots`: 추천 매치 reason, rank, stale 처리 기준.
- `search_result_events`: 검색 이력만으로는 stale query, empty/error 상태 분석이 부족할 수 있다.
- `notification_delivery_events`: 생성, 발송, 실패, 읽음, 딥링크 처리 분리.
- `chat_attachments`: 채팅방 `+` 이미지 전송 요구를 지원.
- `chat_context_links`: 채팅방의 팀/개인매치/팀매치 맥락 박스 목적지. 현재 0502 문서의 반복 항목은 확인 필요.
- `payment_ledger_events`: payment 대표 row와 provider attempt 사이의 금액/상태 변경 추적.
- `refund_events`, `dispute_assignments`: 처리 주체와 변경 이력.
- `admin_permissions`: `admin_users.admin_role`만으로 운영 권한을 닫기 어렵다.
- `terms_acceptance_requirements`: 약관 버전 변경 시 재동의 필요 여부.
- `user_blocks` / `report_targets`: 채팅 차단, 신고, 관리자 큐와 연결.

### 상태값 보강 필요

- `match_status`: `draft`, `published/recruiting`, `deadline_soon`, `full`, `waitlist_open`, `closed`, `cancelled`, `completed`, `expired`.
- `match_application_status`: `requested`, `payment_pending`, `pending_approval`, `approved`, `rejected`, `withdrawn`, `cancelled_by_host`, `expired`.
- `participant_status`: `approved`, `checked_in`, `no_show`, `completed`, `removed`.
- `team_match_status`: `draft`, `recruiting`, `application_pending`, `matched`, `closed`, `cancelled`, `completed`.
- `team_join_status`: `requested`, `pending`, `approved`, `rejected`, `withdrawn`, `blocked`.
- `payment_mode`: `test_only`, `mock`, `live`, `legacy_unavailable`.
- `payment_status`: `prepared`, `pending`, `paid`, `failed`, `cancelled`, `refunding`, `refunded`, `unavailable`.
- `refund_status`: `requested`, `reviewing`, `approved`, `rejected`, `processing`, `processed`, `failed`.
- `dispute_status`: `opened`, `assigned`, `admin_reviewing`, `waiting_user`, `resolved`, `rejected`, `cancelled`.
- `notification_status`: `created`, `delivered`, `failed`, `read`, `archived`.
- `chat_participant_status`: `active`, `muted`, `pinned`, `left`, `blocked`.
- `trust_signal_state`: `verified`, `estimated`, `sample`, `unavailable`.

## 7. API 설계 전에 추가 필요한 설계 요소

1. Product scope freeze
   - `1차 디자인 완료` 17개 섹션 중 API 1차 범위를 확정해야 한다.
   - candidate 모듈은 API/DB 1차 범위에서 제외할지, master/reference만 둘지 결정해야 한다.

2. Navigation and route map
   - 5탭 `홈/매치/팀매치/팀/마이`를 확정해야 한다.
   - `my team` 목적지, 채팅 floating entry, 알림/검색 진입 규칙을 route contract로 고정해야 한다.

3. State machine
   - 개인 매치, 팀매치, 팀 가입, 결제, 환불, 분쟁, 알림, 채팅방의 상태 전이표가 필요하다.
   - 각 전이에 actor, 권한, 실패/되돌림, audit 기록 여부를 붙여야 한다.

4. Permission model
   - 사용자, 호스트, 팀 owner/manager/member, 신청자, 관리자 권한을 API 전에 정의해야 한다.

5. List/search/filter contract
   - 카드형/콤팩트형은 presentation인지 API view인지 결정해야 한다.
   - 종목 count, summary counter, 정렬, stale query, empty/error 응답 형식을 정해야 한다.

6. Create/edit wizard payload
   - UI draft와 API DTO를 분리해야 한다.
   - 이미지 업로드, 장소/시설, 날짜/시간, 비용, 규칙, 팀 선택의 validation contract가 필요하다.

7. Payment honesty contract
   - 테스트 결제, mock 결제, 실제 청구 없음, legacy unavailable을 응답 모델에 반드시 포함해야 한다.

8. Realtime/backfill contract
   - 알림/채팅은 websocket 이벤트만으로 설계하면 안 된다.
   - focus/visibility backfill, 모두읽음 부분 실패, 딥링크와 읽음 mutation 경합 처리가 필요하다.

9. Admin audit contract
   - 관리자 조치는 actor, reason, before/after, partial failure, concurrent processing을 필수로 남겨야 한다.

10. Privacy and visibility
   - 공개 프로필, 팀 신뢰 신호, 참가자 리스트, 리뷰/평판, 알림/채팅 노출 범위를 정해야 한다.

11. Data freshness and cache
   - 홈 추천, 날씨, 월간 통계, 공지 pin, unread count의 freshness 기준이 필요하다.

12. Error model
   - `새로고침 필요합니다 필요` 같은 임시 문구는 최종 error code/copy로 정리해야 한다.

## 8. 가장 위험한 구조적 문제

가장 큰 위험은 “기준 문서가 여러 층으로 충돌하는 상태에서 API/DB 설계가 시작되는 것”이다.

현재 폴더에는 최소 네 종류의 기준이 섞여 있다.

- 기존 production/design 기준: `DESIGN.md`, `.impeccable.md`, `globals.css`, 기존 route ownership.
- 과거 handoff 기준: `00 Toss DNA`, `00b~00h`, 01~24/19 모듈 체계.
- candidate 방향 기준: core/candidate 재분류, 용병/레슨/장터/시설 등의 우선순위 이동.
- 현재 요청 기준: `Team Design > 1차 디자인 완성`만 사용.

이 상태에서 API를 설계하면, 화면은 5탭 `홈/매치/팀매치/팀/마이`를 요구하는데 API/route는 기존 `home/matches/teams/marketplace/more` 또는 과거 01~19 모듈을 따라가는 식의 drift가 발생할 가능성이 높다.

두 번째 위험은 DB 초안이 “화면에서 보이는 데이터 후보” 수준인데, 상태 전이와 권한이 확정되기 전에 테이블/API가 고정되는 것이다. 특히 결제/승인/환불/분쟁/관리자 처리처럼 되돌리기 어려운 거래형 플로우에서 이 문제가 크다.

## 9. 추천하는 다음 작업 순서

1. `Team Design > 1차 디자인 완성` 기준 선언 문서 작성
   - `Teameet Design.html`의 `SM_FIRST_DESIGN_COMPLETE_SECTIONS`를 SSOT로 고정한다.
   - 기존 `DESIGN.md`, `00 Toss DNA`, source parity, old route ownership은 참고 전용이라고 명시한다.

2. 문서 등급표 갱신
   - keep / reference-only / deprecated-priority / archive-evidence를 `INDEX.md` 또는 별도 status 문서에 반영한다.
   - 특히 `handoff-sm-new-direction-plan.md`, `SOURCE_PROTOTYPE_PARITY.md`, `SECTION_UNIFICATION_MATRIX.md`, `BOTTOM_NAV_CONTRACT_FIX27.md`의 기준 사용 금지를 명시한다.

3. `1차 디자인 완료` 화면 인벤토리 확정
   - 각 섹션별 화면, 버튼, 입력, 상태, 전환, 비로그인/오류/빈 상태를 표로 만든다.
   - `확인 필요`: 팀 둘러보기 본문, my team 목적지, 개인/팀매치 만들기 상세, 채팅 맥락 링크.

4. 도메인 상태 전이표 작성
   - match, match application, participant, team, team membership, team match, team match application, payment, refund, dispute, notification, chat room을 우선한다.

5. 권한/actor matrix 작성
   - user, host, team owner, team manager, team member, applicant, admin의 가능한 action을 정한다.

6. DB 설계 2차안 작성
   - `team-design-first-design-db-plan.md`를 그대로 확장하지 말고, 위 상태 전이/권한 matrix를 반영한 v2를 작성한다.
   - candidate 모듈 테이블은 제외하거나 `확인 필요`로 별도 분리한다.

7. API surface map 작성
   - route 단위가 아니라 화면 행동 단위로 endpoint 후보를 잡는다.
   - 목록/상세/create/edit/apply/pay/refund/read-all/admin-action을 분리한다.

8. API DTO와 error/status contract 작성
   - UI draft payload와 API submit payload를 분리한다.
   - 결제/환불/분쟁/관리자 mutation은 idempotency, audit, partial failure를 먼저 설계한다.

9. 그 다음에만 기존 코드와 연결 가능성 검토
   - 기존 DB/API/코드는 재사용 대상이 아니라 migration feasibility 참고로만 본다.

## 최종 분류 요약

| 분류 | 대상 |
|---|---|
| 현재 기준 | `Teameet Design.html`의 `Team Design > 1차 디자인 완성`, `SM_FIRST_DESIGN_COMPLETE_SECTIONS` |
| DB 초안 유지 | `team-design-first-design-db-plan.md` |
| 보조 유지 | `0502-design-freeze-brief.md`, `MODULE_MAP.md`, `COMPONENT_CATALOG.md`, `COMMON_FLOWS.md`, `INTERACTIONS_AND_STATES.md` |
| 참고만 | `HANDOFF.md`, `DIRECTION.md`, `INDEX.md`, `CLEANUP_PLAN.md`, `ARCHIVE.md` |
| deprecated 추천 | `handoff-sm-new-direction-plan.md`, `SOURCE_PROTOTYPE_PARITY.md`, `SECTION_UNIFICATION_MATRIX.md`, `SYSTEM_CANDIDATE.md`, `BOTTOM_NAV_CONTRACT_FIX27.md`, `ROUTE_OWNERSHIP_MANIFEST_FIX27.md`, `PRODUCTION_HANDOFF_FIX26.md` |
| archive evidence | `DESIGN_QA_FIX*`, `PAGE_READINESS_AUDIT_FIX*`, `PROTOTYPE_*`, `sports-platform/chats/chat1.md`, `sports-platform/project/uploads/DESIGN.md` |

