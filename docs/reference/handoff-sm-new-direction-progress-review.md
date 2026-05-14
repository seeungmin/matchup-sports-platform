# Handoff SM New Direction Progress Review

## 1. 분석 개요

```text
작성일: 2026-05-14
분석 기준: Team Design > 1차 디자인 완료
산출물 목적: 신규 기능 구현 전 디자인/DB/API 준비도 점검
코드 수정: 없음
기존 문서 수정: 없음
```

이번 분석의 최상위 기준은 `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html`의 `SMNewViewerGuide > 1차 디자인 완료` 모드와 `SM_FIRST_DESIGN_COMPLETE_SECTIONS`이다.

기존 프로젝트의 코드, 기존 Prisma schema, 기존 API 문서, 과거 디자인 시스템 문서는 구현 가능성 및 drift 확인용 참고 자료로만 본다. 현재 방향은 기존 기능을 그대로 가져오는 것이 아니라, `Team Design > 1차 디자인 완료`를 기준으로 DB/API를 새로 설계한 뒤 기능 구현으로 넘어가는 흐름이다.

핵심 결론:

- 디자인 기준선은 최근 커밋에서 비교적 명확해졌다. 17개 섹션이 `1차 디자인 완료` 묶음으로 고정되어 있다.
- DB 설계는 테이블 후보, 주요 컬럼, ERD, lifecycle 다이어그램까지 draft가 작성되었다.
- API 설계는 아직 endpoint 계약 단계가 아니다. 현재는 API/DB baseline 선언과 API 설계 전 gate가 정리된 상태다.
- 기능 구현은 일부 읽기/목록/기본 화면부터 시작할 수 있으나, 신청/승인/결제/환불/분쟁/관리자 처리 같은 상태 전이 도메인은 추가 설계 없이는 위험하다.

## 2. 최근 커밋 요약

최근 커밋은 크게 세 흐름이다.

1. `handoff-sm-new-direction` reference pack 생성 및 후보 방향 정리.
2. `Team Design > 1차 디자인 완료` 프로토타입 보강.
3. DB/API planning baseline과 DB draft 문서화.

| Commit | 목적 | 주요 파일 | 분류 | 기능 구현 연결성 | 단순 문서 정리 여부 |
|---|---|---|---|---|---|
| `5d4cd7d` `docs: add SM New API DB planning baseline and ERD drafts` | SM New API/DB 설계 기준 선언, ERD/테이블/lifecycle draft 추가 | `docs/reference/sm-new-api-db-baseline.md`, `docs/reference/db-erd-overview.md`, `docs/reference/db-lifecycle-diagram.md`, `docs/reference/db-table-definition.md`, `docs/reference/handoff-sm-new-direction/HANDOFF.md`, `docs/reference/handoff-sm-new-direction/INDEX.md`, `.github/tasks/81-sm-new-direction-0502-freeze.md` | DB/API/문서 | 높음. 구현 전 기준선과 설계 gate를 만든 커밋 | 단순 정리 아님. API/DB planning baseline |
| `d69523a` `Merge branch 'main' ...` | 원격 main 병합 | 병합 커밋. `git show --stat`상 별도 변경 파일 없음 | 기타 | 직접 판단 근거 적음 | 병합 |
| `d193bc4` `docs: refine team design DB planning` | `1차 디자인 완료` 기준 DB 초안 보강 및 handoff 리뷰 추가 | `docs/reference/team-design-first-design-db-plan.md`, `docs/reference/handoff-sm-new-direction-review.md` | DB/문서 | 높음. DB 후보, 상태값, 권한, API 전 고려사항을 넓게 정리 | 단순 정리 아님. 설계 draft 확장 |
| `e9918a2` `docs: refine team design DB planning` | `d193bc4`와 동일 내용으로 보이는 중복 커밋 | 동일 | DB/문서 | 높음이나 중복 가능성 있음. 확인 필요 | 중복 커밋으로 보임 |
| `4a8655f` `docs: organize sm handoff and db design plan` | handoff 문서 정리, archive/cleanup 도입, DB 설계 초안 최초 추가 | `docs/reference/handoff-sm-new-direction/HANDOFF.md`, `ARCHIVE.md`, `CLEANUP_PLAN.md`, `DIRECTION.md`, `INDEX.md`, `docs/reference/team-design-first-design-db-plan.md` | 디자인/DB/문서 | 높음. 기준 충돌 정리와 DB 초안의 시작점 | 단순 정리 이상. 기준 재분류 포함 |
| `dc65c7e` `docs: finalize 07 my page SM design updates` | 마이/프로필/평판 SM 디자인 최종 업데이트 | `Teameet Design.html`, `screens-sm-revision.jsx` | 디자인 | 중간-높음. My/Profile 화면 구현 근거 | 프로토타입 구현 문서/디자인 변경 |
| `9777ddf` `docs: finalize SM team browse and my profile prototypes` | 팀 둘러보기와 마이 프로필 prototype 보강 | `Teameet Design.html`, `screens-sm-revision.jsx` | 디자인 | 중간. 팀 둘러보기는 body 미정이 남아 있어 바로 구현은 제한적 | 디자인 prototype 변경 |
| `e9988bd` `docs: finalize SM match and team match prototype flows` | 개인 매치/팀매치 목록, 상세, 신청, 생성 흐름 prototype 보강 | `Teameet Design.html`, `screens-sm-revision.jsx` | 디자인 | 높음. 매치/팀매치 화면 액션과 상태의 직접 근거 | 디자인 prototype 변경 |
| `9560e88` `docs: finalize SM design complete prototype` | `1차 디자인 완료` prototype 구조 추가, module map 갱신, 정적 파일 serving 스크립트 추가 | `Teameet Design.html`, `screens-sm-revision.jsx`, `prototype-system/MODULE_MAP.md`, `scripts/qa/serve-static-file.mjs` | 디자인/문서/QA 보조 | 높음. `1차 디자인 완료` 묶음의 핵심 커밋 | 단순 문서 정리 아님 |
| `3df6f0f` `docs: add sm2 core design revisions` | 0502 디자인 고정 원문/정리본 추가, SM revision prototype 추가 | `.github/tasks/81-sm-new-direction-0502-freeze.md`, `0502-design-freeze-brief.md`, `0502 문서화.md`, `COMMON_FLOWS.md`, `MODULE_MAP.md`, `Teameet Design.html`, `screens-sm-revision.jsx` | 디자인/문서 | 높음. 0502 요구사항을 실제 prototype으로 옮긴 시작점 | 기준 입력 추가 및 prototype 변경 |
| `d725f22` `docs: update staged handoff-sm-new-direction prototype docs` | 기존 handoff pack의 section reorder, team browse 후보, 화면/섹션 보강 | `DIRECTION.md`, `INDEX.md`, `MODULE_MAP.md`, `COMMON_FLOWS.md`, `Teameet Design.html`, `screens-v2main*.jsx` | 디자인/문서 | 중간. 현재 기준 이전의 staged 후보라 참고 필요 | 일부는 현재 기준에서 reference-only |
| `fd72009` `docs: add sm-new design handoff reference` | `handoff-2026-04-25` 기반 candidate reference pack 대량 추가 | `handoff-sm-new-direction-plan.md`, `ANALYSIS.md`, `DIRECTION.md`, `INDEX.md`, `prototype-system/*`, `sports-platform/project/*`, mock assets, serve scripts | 디자인/문서/자산 | 중간. 기반 자료지만 현재 기준보다 오래된 우선순위 포함 | reference pack 생성 |

최근 커밋에서 확인한 흐름:

- `fd72009`에서 과거 handoff pack을 후보 reference로 복사했다.
- `3df6f0f`부터 0502 SM 메모가 들어오며 `홈 / 매치 / 팀매치 / 팀 / 마이` 5탭과 핵심 화면 수정이 시작됐다.
- `9560e88`부터 `1차 디자인 완료` prototype 묶음이 명시적으로 생겼다.
- `e9988bd`, `9777ddf`, `dc65c7e`에서 매치/팀매치/팀/마이 쪽 화면 완성도가 올라갔다.
- `4a8655f`, `d193bc4`, `5d4cd7d`에서 디자인 기준을 DB/API planning으로 넘기기 위한 문서가 추가됐다.

## 3. 분석 대상 문서 목록

### 최우선 기준

| 문서/파일 | 역할 | 상태 |
|---|---|---|
| `docs/reference/handoff-sm-new-direction/sports-platform/project/Teameet Design.html` | 실제 Team Design prototype 원본. `SM_FIRST_DESIGN_COMPLETE_SECTIONS`와 `1차 디자인 완료` 모드 포함 | 현재 기준 |
| `docs/reference/sm-new-api-db-baseline.md` | SM New API/DB 설계 기준 선언 | 기준 선언. endpoint/schema 확정 아님 |
| `docs/reference/team-design-first-design-db-plan.md` | `1차 디자인 완료` 기준 DB 설계 초안 | draft |
| `docs/reference/db-table-definition.md` | DB table 후보 정의서 | draft table definition |
| `docs/reference/db-erd-overview.md` | DB ERD 시각화 | draft visualization |
| `docs/reference/db-lifecycle-diagram.md` | 상태 전이/소유권 다이어그램 | draft lifecycle visualization |

### handoff-sm-new-direction 관련 문서

| 문서 | 역할 | 현재 분석상 사용 방식 |
|---|---|---|
| `docs/reference/handoff-sm-new-direction/HANDOFF.md` | 현재 방향과 관련 문서 역할을 요약한 통합 handoff | 참고. DB/API note는 유효 |
| `docs/reference/handoff-sm-new-direction/INDEX.md` | 폴더 진입점, 읽는 순서, current priority override | 참고. 읽기 순서와 module status 확인 |
| `docs/reference/handoff-sm-new-direction/DIRECTION.md` | candidate 방향과 core/candidate 분류 | 참고. 과거 기준 문구는 주의 |
| `docs/reference/handoff-sm-new-direction/0502-design-freeze-brief.md` | 0502 디자인 메모 구조화본 | 디자인 해석 보조 |
| `docs/reference/handoff-sm-new-direction/ARCHIVE.md` | 오래된 문서 보존 기준 | 참고 |
| `docs/reference/handoff-sm-new-direction/CLEANUP_PLAN.md` | 문서 충돌/정리 계획 | 참고 |
| `docs/reference/handoff-sm-new-direction/prototype-system/MODULE_MAP.md` | prototype section map, `First Design Complete Sections` 설명 | 화면 범위 확인용 |
| `docs/reference/handoff-sm-new-direction/prototype-system/COMMON_FLOWS.md` | 공통 flow 원칙, SM bottom nav | UI/action/state 참고 |
| `docs/reference/handoff-sm-new-direction/prototype-system/INTERACTIONS_AND_STATES.md` | 상태/인터랙션 contract 색인 | 보조 참고 |
| `docs/reference/handoff-sm-new-direction/prototype-system/COMPONENT_CATALOG.md` | 컴포넌트 후보 catalog | UI 구현 참고. API/DB 기준 아님 |

### reference-only 또는 deprecated-priority로 봐야 하는 문서

| 문서/그룹 | 이유 |
|---|---|
| `docs/reference/handoff-sm-new-direction-plan.md` | 초기 core/candidate 분류가 현재 기준과 다름. 용병/종목·실력·안전 우선순위가 이후 변경됨 |
| `SOURCE_PROTOTYPE_PARITY.md` | 기존 source route parity 중심. 신규 기준이 아님 |
| `SECTION_UNIFICATION_MATRIX.md` | `DESIGN.md`, `00 Toss DNA`, 기존 route 기준이 섞임 |
| `SYSTEM_CANDIDATE.md` | 과거 디자인 시스템 승격 후보. `1차 디자인 완료` 자체가 아님 |
| `BOTTOM_NAV_CONTRACT_FIX27.md` | 기존 nav contract가 SM 5탭과 충돌 |
| `ROUTE_OWNERSHIP_MANIFEST_FIX27.md` | 기존 앱 route 소유권 기반 |
| `PRODUCTION_HANDOFF_FIX26.md` | production migration 전제. 신규 DB/API 설계 기준 아님 |
| `DESIGN_QA_FIX*`, `PAGE_READINESS_AUDIT_FIX*` | 과거 QA evidence. 현재 설계 기준 아님 |

## 4. handoff-sm-new-direction 문서별 분석

### `docs/reference/handoff-sm-new-direction/HANDOFF.md`

- 목적: `handoff-sm-new-direction` 관련 문서를 읽는 작업자가 현재 방향, 보존해야 할 증거, 과거 흔적을 이해하도록 만든 통합 handoff.
- 현재 상태: candidate/reference. 구현 기준 자체는 아니며, DB/API planning은 `sm-new-api-db-baseline.md`를 먼저 보라고 명시한다.
- 주요 내용: core/candidate module, 문서별 역할, duplicate/conflict resolution, DB/API design notes, 확인 필요 목록.
- 1차 디자인 연결성: 간접 연결. `1차 디자인 완료` 자체보다 candidate pack의 방향과 충돌 처리에 초점.
- DB 연결성: 팀 탐색, 개인 매치, 팀매치, 채팅/알림, 결제/환불/분쟁, 관리자에서 DB/API로 넘길 때 고정할 항목을 요약한다.
- API 연결성: endpoint는 없지만 상태값, websocket/backfill, payment honesty, admin audit 필요성을 지적한다.
- 바로 사용 가능 여부: 구현 기준으로 바로 쓰기보다는 설계 전 체크리스트로 사용 가능.
- 부족/확인 필요: SM bottom nav가 production contract인지 후보 prototype 전용인지, `my team` 목적지, candidate module 출시 범위.

### `docs/reference/handoff-sm-new-direction/INDEX.md`

- 목적: 폴더 진입점, reading order, candidate pack status 정리.
- 현재 상태: candidate, not canonical, implementation reference only.
- 주요 내용: `sm-new-api-db-baseline.md`를 handoff 문서보다 먼저 읽으라는 순서, current priority override, 17개 core/candidate 재배치.
- 1차 디자인 연결성: `Phase 2b SM design freeze update`와 `1차 디자인 완료` 관련 섹션을 연결한다.
- DB 연결성: API/DB planning reading order를 제공한다.
- API 연결성: 직접 endpoint 없음. 기준선 문서로 유도한다.
- 바로 사용 가능 여부: 문서 탐색과 우선순위 확인에는 바로 사용 가능.
- 부족/확인 필요: 과거 `DESIGN.md`, `.impeccable.md`, `globals.css`를 active design rule로 언급하는 문구는 현재 요청 기준과 충돌하므로 주의.

### `docs/reference/handoff-sm-new-direction/0502-design-freeze-brief.md`

- 목적: 0502 원문 메모를 화면/상태/동작 기준으로 구조화.
- 현재 상태: 후보/디자인 참고용. 원문 `0502 문서화.md`를 source로 둔다.
- 주요 내용: 지원 종목, 상단바/하단 5탭, 홈, 개인 매치, 개인 매치 상세, 팀매치, 결제, 로그인, 리뷰, 관리자, 랜딩.
- 1차 디자인 연결성: 높음. `1차 디자인 완료` prototype의 핵심 입력으로 보인다.
- DB 연결성: 홈 추천/날씨/공지, 매치 신청/결제/승인, 팀매치 신청, 프로필/리뷰, 결제/환불/관리자 데이터 요구를 도출할 수 있다.
- API 연결성: 화면별 이동, UI action, 상태 copy가 API surface map의 입력이 된다. 다만 request/response는 없음.
- 바로 사용 가능 여부: 화면 action inventory 작성에는 바로 사용 가능. endpoint 구현에는 부족.
- 부족/확인 필요: `my team` 이동 대상 미정, 개인 매치/팀매치 만들기 상세 부족, 팀 둘러보기 body 일부 미정, 오류 문구 정리 필요.

### `docs/reference/handoff-sm-new-direction/prototype-system/MODULE_MAP.md`

- 목적: rendered prototype 구조와 section 순서를 기록.
- 현재 상태: prototype map. 현재 `First Design Complete Sections` 색인으로 유효.
- 주요 내용: core/candidate section order, 05 팀 둘러보기 추가, 용병 candidate 이동, 각 기능 section의 board 수와 목적, SM 수정안별 변경 이력.
- 1차 디자인 연결성: 높음. `00~13 · 1차 디자인 완료`가 core 원본/수정본/번호별 최종본 42개 보드로 구성됨을 명시한다.
- DB 연결성: 기능 모듈별 데이터 요구 범위를 확인하는 색인으로 쓸 수 있다.
- API 연결성: 일부 case matrix와 motion/interaction contract가 API surface map의 보조 근거가 될 수 있다.
- 바로 사용 가능 여부: 화면 범위와 섹션 탐색에는 사용 가능.
- 부족/확인 필요: 과거 module number와 current section id가 함께 있어, API/DB 설계자는 `SM_FIRST_DESIGN_COMPLETE_SECTIONS`를 우선해야 한다.

### `docs/reference/handoff-sm-new-direction/prototype-system/COMMON_FLOWS.md`

- 목적: prototype 전체 반복 flow 정리.
- 현재 상태: 공통 flow reference.
- 주요 내용: 탐색 -> 판단 -> 신청/결제/저장 -> 상태 확인, 실패/pending/unavailable 노출, SM bottom nav 5탭, onboarding/discovery/detail/create/payment/operations/case matrix flow.
- 1차 디자인 연결성: 높음. SM 수정안 이후 하단바는 `홈 / 매치 / 팀매치 / 팀 / 마이`를 기본값으로 쓴다고 명시한다.
- DB 연결성: create/edit draft, payment/refund, operations audit 같은 저장 요구를 간접적으로 제공한다.
- API 연결성: detail-to-action, create/edit, payment/refund, operations API의 action 단위 설계에 유용하다.
- 바로 사용 가능 여부: 화면별 구현 원칙과 API action map의 보조 근거로 사용 가능.
- 부족/확인 필요: owning section 번호 일부는 과거 번호 체계가 남아 있어 현재 `1차 디자인 완료` section id와 cross-check 필요.

### `docs/reference/handoff-sm-new-direction-review.md`

- 목적: `handoff-sm-new-direction` 문서를 `Team Design > 1차 디자인 완성` 기준으로 평가.
- 현재 상태: review 문서. 이번 분석과 가장 가까운 선행 검토.
- 주요 내용: 기준 문서 우선순위, 충돌 문서, 유지/ deprecated 문서, DB 상태 평가, 누락 엔티티, API 설계 전 필요 요소, 위험, 다음 작업 순서.
- 1차 디자인 연결성: 매우 높음. 유일한 디자인 기준을 `Team Design > 1차 디자인 완성`으로 선언한다.
- DB 연결성: DB draft의 강점/미완성을 평가하고 누락 엔티티/상태값을 제안한다.
- API 연결성: API surface map, DTO/error/status contract가 아직 필요하다고 명시한다.
- 바로 사용 가능 여부: 기능 구현 전 gap list로 바로 사용 가능.
- 부족/확인 필요: endpoint 목록이나 DTO를 제공하지는 않는다.

### `docs/reference/handoff-sm-new-direction-plan.md`

- 목적: candidate reference pack 생성 초기 계획.
- 현재 상태: deprecated-priority로 보는 것이 안전하다.
- 주요 내용: 기존 handoff 복사, direction 문서 추가, 초기 core/candidate 분류, component catalog 생성.
- 1차 디자인 연결성: 낮음-중간. 현재 `1차 디자인 완료` 이전의 방향이 섞여 있다.
- DB/API 연결성: 직접 연결 낮음.
- 바로 사용 가능 여부: 신규 구현 기준으로 사용하면 안 됨.
- 부족/확인 필요: 초기 core 분류가 현재와 다르다. 용병/종목·실력·안전 등이 현재 candidate로 이동한 흐름과 충돌한다.

### `docs/reference/sm-new-api-db-baseline.md`

- 목적: SM New API/DB planning의 시작점 선언.
- 현재 상태: baseline declaration. schema/API 확정 아님.
- 주요 내용: 유일한 design baseline, 문서 우선순위, reference-only source, deprecated source, planning boundaries, naming conflict, API/DB design gate, 다음 문서 순서.
- 1차 디자인 연결성: 매우 높음. `SM_FIRST_DESIGN_COMPLETE_SECTIONS` 17개를 기준으로 고정한다.
- DB 연결성: DB v2 전 state/permission/action inventory가 필요하다고 선언한다.
- API 연결성: final endpoint contract를 쓰기 전 `screen action inventory`, `state transition`, `permission matrix`, `ER v2`, `API surface map`, `DTO/error/status contract`가 필요하다고 명시한다.
- 바로 사용 가능 여부: 구현 시작 gate로 바로 사용 가능.
- 부족/확인 필요: 실제 API 목록, request/response, error code는 아직 없다.

## 5. 1차 디자인 완성 진행 상태

`SM_FIRST_DESIGN_COMPLETE_SECTIONS` 기준 17개 섹션:

| 순서 | Section id | 화면 묶음 | 진행 상태 |
|---:|---|---|---|
| 1 | `core-shell-sm-final` | 상단바, 하단 5탭, 검색/알림 shell | 비교적 명확 |
| 2 | `auth-onboarding-sm-final` | 약관, 가입 완료, 운동 설정 | 화면/흐름 있음 |
| 3 | `home-discovery-sm-final` | 홈 추천/검색/활동/공지 진입 | 상세 상태 있음 |
| 4 | `home-notice-sm-final` | 공지 목록/상세 | 기본 흐름 있음 |
| 5 | `matches-core-sm-final` | 개인 매치 목록/상세/참가 | 상세 상태와 CTA 있음 |
| 6 | `matches-core-sm-create-final` | 개인 매치 만들기/수정 | final section은 있으나 정책 확인 필요 |
| 7 | `teams-team-matches-sm-revision-4` | 팀매치 조회/상세/신청 | 상세 상태 있음 |
| 8 | `teams-team-matches-sm-create-final` | 팀매치 만들기/수정 | final section은 있으나 기능 범위 확인 필요 |
| 9 | `team-browse-sm-revision-5` | 팀 둘러보기/팀 상세/가입 | shell과 의도는 있으나 body 정책 일부 미정 |
| 10 | `community-sm-final` | 채팅/알림 | unread/read, pin/leave, deep link 이슈 있음 |
| 11 | `my-profile-trust-sm-revision` | 마이/프로필/평판 | 화면 묶음 있음 |
| 12 | `payments-support-sm-revision` | 결제/환불/분쟁 | honesty copy와 상태 필요성 있음 |
| 13 | `settings-states` | 설정/약관/상태 | 기본 상태 있음 |
| 14 | `public-marketing-sm-revision` | 공개/마케팅 | CTA/공개 흐름 있음 |
| 15 | `desktop-web` | 데스크탑 웹 | 모바일 이후 projection 성격 |
| 16 | `admin-ops-sm-revision` | 관리자/운영 | 운영 큐/audit/partial failure 필요 |
| 17 | `common-flows-motion` | 공통 flow/interaction | 구현 원칙 있음 |

평가:

- 화면/섹션 범위: 상당히 정리됨. 17개 기준 section이 문서와 prototype에 존재한다.
- 화면별 기능 정의: `team-design-first-design-db-plan.md`의 화면별 기능 분석이 넓게 정리했다.
- UI 액션: 검색, 필터, 보기 전환, 상세 이동, 참가 sheet, 결제 CTA, 공유, 알림, pin/leave, 관리자 처리 등 주요 action이 정리되어 있다.
- 버튼/탭/검색/필터/모달/상세 이동: 주요 user-facing flow는 분석되어 있다. 특히 홈/개인 매치/팀매치/채팅/결제/관리자는 충분한 단서가 있다.
- DB/API 연결성: DB 후보와 API 전 고려사항으로 연결은 시작됐다. 그러나 화면 action inventory가 독립 문서로 아직 완성되지 않았다.
- 기능 구현 전 남은 부분: route map, `my team` destination, 만들기/수정 상세 policy, 팀 둘러보기 상세 body, 상태 전이/권한 matrix 확정, API surface map.

## 6. DB 설계 진행 상태

### 현재 수준

DB 설계는 “초기 엔티티 후보”에서 “상세 draft” 단계까지 올라왔다. `team-design-first-design-db-plan.md`가 화면 기준으로 데이터 요구를 역산했고, `db-table-definition.md`, `db-erd-overview.md`, `db-lifecycle-diagram.md`가 추가되어 설계 검토가 가능해졌다.

단, 모든 관련 문서가 명시적으로 `draft`, `candidate only`, `not Prisma migration`, `not endpoint contract` 상태다. 즉 아직 migration을 작성할 수준은 아니다.

### 테이블 후보

테이블 후보는 충분히 넓다. 주요 그룹:

- Identity/User: `users`, `auth_identities`, `user_profiles`, `user_onboarding_progress`, `user_permission_states`
- Terms/Master: `terms_documents`, `user_terms_consents`, `sports`, `sport_levels`, `regions`, `venues`
- Preference/Search/Home: `user_sport_preferences`, `user_regions`, `search_histories`, `saved_filters`, `user_activity_summaries`, `user_reputation_summaries`, `match_recommendations`, `notices`, `notice_reads`
- Match: `matches`, `match_media`, `match_rules`, `match_applications`, `match_participants`, `match_waitlist_entries`, `match_notification_subscriptions`
- Team/Team Match: `teams`, `team_profiles`, `team_memberships`, `team_join_applications`, `team_trust_scores`, `team_matches`, `team_match_styles`, `team_match_applications`, `team_match_invitations`
- Chat/Notification: `chat_rooms`, `chat_room_participants`, `chat_messages`, `chat_attachments`, `chat_context_links`, `notifications`, `notification_delivery_events`, `notification_reads`, `notification_preferences`
- Payment/Refund/Dispute: `payments`, `payment_attempts`, `payment_ledger_events`, `refund_requests`, `refund_events`, `disputes`, `dispute_events`
- Admin/Audit/Common: `admin_users`, `admin_permissions`, `admin_operation_tasks`, `admin_action_logs`, `moderation_reports`, `status_change_logs`, `share_events`, `user_drafts`

### 컬럼/PK/FK/관계

- 컬럼 정의: 주요 테이블의 핵심 컬럼, 상태값 후보, nullable/default 확정 필요 여부가 정리되어 있다.
- PK/FK: ERD 문서와 table definition에서 주요 FK가 제시되어 있다.
- 관계: 사용자-매치-신청-결제, 사용자-팀-멤버십-팀매치, 채팅/알림, 결제/환불/분쟁, 관리자 audit 관계가 큰 틀로 잡혀 있다.

### 상태값/lifecycle

상태값 후보와 lifecycle 초안은 상당히 진전됐다.

- 개인 매치 신청
- 팀 가입 신청
- 팀매치 신청
- 결제
- 환불
- 분쟁
- 채팅/알림
- 관리자 task

다만 아직 확정 enum이 아니다. 특히 결제 후 승인인지, 승인 후 결제인지, 자동 승인 여부, waitlist/attendance/no-show v1 포함 여부는 확인 필요다.

### 권한/소유권 모델

권한 matrix 초안이 있다.

- 개인 매치: 비로그인, 일반 사용자, 신청자, 승인 참가자, host/creator, manager 후보, admin.
- 팀: 일반 사용자, 신청자, member, manager, owner, admin.
- 팀매치: host team member, host owner/manager, applicant team owner/manager, approved opponent, admin.
- 결제/환불/분쟁: payer/requester, host/team manager, admin, provider/system.
- 채팅/알림/관리자: room participant, left user, admin, system.

부족한 부분:

- `teams.owner_user_id`와 `team_memberships.role=owner` 중 owner SSOT 미정.
- manager 권한 범위 미정.
- admin role만으로 충분한지 capability table 필요 여부 미정.

### 복잡 도메인

결제/환불/분쟁은 별도 상태 정책으로 잘 분리되었다.

- `payment_mode`: `test_only`, `mock`, `live`, `legacy_unavailable`
- `payment_status`: `prepared`, `pending`, `paid`, `failed`, `cancelled`, `refunding`, `refunded`, `unavailable`
- refund/dispute 상태값도 후보가 있다.

위험:

- 결제 상태와 신청/승인 상태 동기화 규칙이 아직 미정.
- provider retry/idempotency/partial refund/legacy unavailable 정책이 확정되지 않았다.
- `payment_ledger_events`, `refund_events`, `status_change_logs`, `admin_action_logs`의 책임 중복 가능성이 있다.

### API 설계 연결 가능성

DB draft는 API 설계로 넘어갈 수 있는 재료를 충분히 제공한다. 하지만 `sm-new-api-db-baseline.md`의 gate에 따르면 다음이 먼저 필요하다.

- screen action inventory
- state transition tables 확정
- actor/permission matrix 확정
- ER v2
- API surface map
- DTO/error/status contract

## 7. API 설계 진행 상태

현재 API 설계는 “준비 기준 선언” 단계다. 최종 API 문서나 endpoint contract는 아직 없다.

평가:

- API 목록: 아직 정리되지 않았다. `sm-new-api-surface-map.md`가 다음 문서로 제안되어 있을 뿐이다.
- 화면별 API 매핑: `team-design-first-design-db-plan.md`에 화면별 필요 데이터와 API 고려사항은 있지만 endpoint 매핑표는 없다.
- Request/Response 구조: 아직 없다.
- 인증/권한 기준: 권한 matrix 초안은 있으나 API guard contract로 확정되지는 않았다.
- 상태값/에러 코드: 상태값 후보는 많지만 error code와 response status contract는 아직 없다.
- DB 테이블 매핑: DB 후보와 화면 데이터는 매핑되어 있으나 endpoint별 table mapping은 없다.
- 실제 구현 가능 수준: 목록/조회 API 후보를 설계하기 위한 재료는 충분하지만, mutation/transaction API는 바로 구현하면 위험하다.
- 확인 필요 영역: idempotency, pagination, stale search, grouped search response, realtime/backfill, payment honesty, admin audit, field masking.

현재 API 설계의 가장 정확한 상태:

```text
API status: not an endpoint contract
현재 문서 역할: API 설계 전 gate와 고려사항 정리
다음 필요 문서: sm-new-screen-action-inventory.md, sm-new-state-machines.md, sm-new-permission-matrix.md, sm-new-db-design-v2.md, sm-new-api-surface-map.md
```

## 8. 기능 구현 준비도 평가

### 바로 구현 가능한 부분

아래는 단, 기존 코드를 그대로 기준으로 삼지 않고 신규 설계 기준에서 구현한다는 전제다.

- 정적/읽기 중심 UI shell: 상단바, 하단 5탭, 기본 route shell.
- 홈의 비로그인/네트워크 fallback UI.
- 공지 목록/상세의 기본 read model 초안.
- 개인 매치/팀매치 목록 UI의 검색/필터 draft state.
- 카드형/콤팩트형 view mode UI.
- 팀/매치/팀매치 목록의 read-only mock-backed prototype 구현.
- 채팅 목록의 pin/leave UI skeleton.
- 설정/약관 read-only 구조.
- 관리자 큐 read-only shell.

### 추가 설계가 필요한 부분

- `my team` quick action destination.
- 개인 매치 만들기/수정 payload와 저장 정책.
- 팀매치 만들기/수정 payload, 비용/무료초청/심판/용병 허용의 v1 포함 여부.
- 팀 둘러보기 상세 body, 가입/선택 CTA 정책.
- 개인 매치/팀매치 신청, 승인, 결제 순서.
- waitlist, attendance, no-show, completion v1 포함 여부.
- 팀 owner/manager/member 권한.
- 결제 retry/idempotency/provider callback.
- 환불/분쟁 처리 주체, audit, partial failure.
- 알림 모두읽음, deep link와 읽음 mutation 경합, websocket late-connect backfill.
- 관리자 권한 capability와 operation task locking.

### 위험한 부분

- API 계약 없이 DB 테이블부터 확정하는 것.
- 상태 전이 확정 없이 신청/승인/결제 mutation을 구현하는 것.
- 기존 production route/API를 새 디자인의 기준처럼 끌어오는 것.
- `Team` 용어를 service team과 match-side team에 혼용하는 것.
- `mock/test payment`를 실제 결제처럼 보이게 만드는 것.
- admin action을 toast-only/local mock으로 끝내는 것.
- 신뢰/평판/매너/팀 신호를 `verified`, `estimated`, `sample`, `unavailable` 구분 없이 노출하는 것.

### 기존 프로젝트를 참고해야 하는 부분

- cursor pagination과 목록 API gotcha.
- 기존 chat/notification realtime backfill 문제.
- 기존 admin audit 처리 패턴.
- 기존 payments/refunds 구현상의 provider/mock mode 분리 문제.
- Nest module 경계, DTO validation, guard/service permission check 구조.
- Prisma migration feasibility와 기존 데이터 drift.

### 기존 프로젝트를 절대 기준으로 삼으면 안 되는 부분

- 기존 bottom nav `home/matches/teams/marketplace/more`.
- 기존 route ownership manifest.
- 기존 Prisma `Team`/`SportTeam` 명칭과 관계를 그대로 가져오는 것.
- 기존 API endpoint path를 화면 요구보다 우선하는 것.
- 과거 `00 Toss DNA`나 2026-04-25 handoff를 현재 디자인 기준으로 보는 것.
- `lessons`, `marketplace`, `venues`, `mercenary` 등 candidate module을 core v1처럼 자동 포함하는 것.

### 구현 전 반드시 확정해야 하는 정책

1. SM 5탭 shell을 production navigation으로 확정할지.
2. API v1에 17개 baseline section 중 어디까지 포함할지.
3. 개인 매치/팀매치 신청과 결제 순서.
4. 팀 owner SSOT와 manager 권한.
5. 결제 mode와 사용자-facing copy.
6. 환불/분쟁/관리자 audit 필수 필드.
7. 검색/추천/날씨/통계의 저장/캐시/API 계산 경계.
8. 알림/채팅 read/backfill/idempotency 정책.
9. public/private visibility와 field masking.
10. candidate module 제외/보존/추후 설계 기준.

## 9. 진행률 요약

진행률은 문서와 최근 커밋 근거로 추정한 값이다.

| 항목 | 추정 진행률 | 근거 |
|---|---:|---|
| 디자인 분석 | 80% | `Teameet Design.html`에 `1차 디자인 완료` 모드와 17개 section이 있고, `MODULE_MAP.md`, `0502-design-freeze-brief.md`가 보조한다. 단 browser visual QA와 desktop-specific SM 비교는 미완료 |
| 화면 기능 정의 | 65% | `team-design-first-design-db-plan.md`에 화면별 기능/데이터/UI action이 정리되어 있다. 다만 독립적인 screen action inventory 문서는 아직 없음 |
| DB 설계 | 60% | 테이블 후보, 컬럼, ERD, lifecycle draft가 존재한다. 하지만 schema/migration 확정 전이며 상태/권한/저장 경계가 열려 있다 |
| API 설계 | 25% | API/DB baseline과 API 고려사항은 있다. endpoint 목록, request/response, error code, DTO 문서는 아직 없음 |
| 권한/상태값 정책 | 45% | 상태 전이표와 권한 matrix 초안이 있다. actor, audit, 결제 순서, owner SSOT 등 핵심 정책은 미확정 |
| 기능 구현 준비도 | 40% | read-only/UI skeleton은 시작 가능하나 transaction mutation과 실제 backend 구현은 추가 설계가 필요 |

## 10. 위험 요소

1. 기준 문서 충돌
   - `DESIGN.md`, `00 Toss DNA`, 2026-04-25 handoff, candidate plan, `1차 디자인 완료`가 한 폴더에 함께 존재한다.
   - 해결: `sm-new-api-db-baseline.md`의 문서 우선순위를 지킨다.

2. API 설계 부재
   - 현재는 API 목록과 DTO가 없다.
   - 해결: endpoint가 아니라 screen action 기준으로 API surface map을 작성한다.

3. DB draft 과확정 위험
   - 테이블 후보가 많고 일부는 v1 scope가 불명확하다.
   - 해결: v1 제외 후보를 명시하고 ER v2에서 줄인다.

4. 상태 전이 미확정
   - 결제/승인/환불/분쟁은 순서에 따라 DB와 API가 크게 달라진다.
   - 해결: 상태 전이표를 먼저 확정한다.

5. 권한 모델 미확정
   - 팀 owner/manager/member, match host/manager, admin capability가 닫히지 않았다.
   - 해결: permission matrix를 guard/service 설계 전 확정한다.

6. 기존 코드 재사용 오해
   - 기존 schema/API가 있는 도메인은 구현자가 그대로 연결하려는 유혹이 크다.
   - 해결: 기존 코드는 feasibility 참고로만 사용한다.

7. candidate module scope creep
   - lessons/marketplace/venues/mercenary 등이 reference pack에 남아 있어 v1 scope에 섞일 수 있다.
   - 해결: core v1과 candidate backlog를 분리한다.

## 11. 구현 전 확인 필요 사항

- `my team` quick action의 실제 destination.
- SM 5탭 `홈 / 매치 / 팀매치 / 팀 / 마이`의 production 확정 여부.
- `1차 디자인 완료` 17개 section 중 API v1 범위.
- 개인 매치 참가가 결제 후 승인인지, 승인 후 결제인지.
- 팀매치도 개인 매치와 같은 결제/승인 순서를 쓰는지.
- 개인 매치/팀매치 만들기 상세 payload와 validation.
- 팀매치 `심판 배정`, `용병 허용`, `무료초청`의 1차 포함 여부.
- 팀 둘러보기 body 요구사항과 팀 상세/가입/선택 CTA 범위.
- 팀 owner/manager 권한, owner 이전/회수 정책.
- waitlist, attendance, no-show, 경기 완료 처리를 v1에 넣을지.
- 결제 retry가 동일 `payments` row 아래 `payment_attempts`인지 새 payment인지.
- `test_only`, `mock`, `live`, `legacy_unavailable`의 copy와 CTA 차단 기준.
- 환불 요청 취소, 부분 환불, provider 실패 후 복원 정책.
- dispute target 허용 범위와 재심/이의제기 여부.
- 알림 read 모델을 `notifications.read_at`로 둘지 `notification_reads`로 분리할지.
- 채팅 이미지 첨부와 context link가 v1인지.
- 관리자 role만으로 충분한지 `admin_permissions`가 필요한지.
- 추천/검색/날씨/공지/통계의 저장/캐시/API 계산 경계.
- error copy, 특히 `새로고침 필요합니다 필요` 같은 임시 문구의 최종 정리.

## 12. 추천 다음 작업 순서

1. `sm-new-screen-action-inventory.md` 작성
   - 17개 section별 화면, 버튼, 입력, 전환, empty/error/loading, 권한 상태를 action 단위로 정리한다.

2. `sm-new-state-machines.md` 작성
   - match, match application, participant, team join, team match, payment, refund, dispute, notification, chat, admin task를 확정한다.

3. `sm-new-permission-matrix.md` 작성
   - user, host, applicant, team owner, manager, member, admin, system, provider 권한을 action별로 닫는다.

4. DB v2 작성
   - 현재 table 후보를 v1/core와 candidate/deferred로 나누고 과도 분리 후보를 줄인다.

5. API surface map 작성
   - route 기준이 아니라 user action 기준으로 목록/상세/create/edit/apply/pay/refund/read-all/admin-action을 설계한다.

6. DTO/error/status contract 작성
   - request/response, pagination, idempotency, partial failure, field masking, trust signal state를 확정한다.

7. 기존 코드 재사용 가능성 검토
   - 위 기준이 닫힌 뒤에만 기존 Prisma/API/FE route와 gap analysis를 한다.

8. 구현 phase 분리
   - 먼저 read-only core, 그 다음 create/edit, 마지막으로 transaction/admin/realtime 순서로 진행한다.

