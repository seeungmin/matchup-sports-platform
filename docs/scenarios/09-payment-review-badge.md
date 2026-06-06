# Payment Review Badge Scenarios

> Status: Partial / payment and badge verification pending
> 결제/환불/배지 표면은 코드에 존재하지만, 이 문서 기준 scenario verification evidence는 아직 부족하다.
> 리뷰는 Task 89에서 post-event review API/UI가 구현됐고, 최신 시나리오 계약은 `12-v1-sm-new-e2e-scenarios.md`의 `V1-14-*`가 기준이다.

## Scenario Checklist

- [ ] PAY-001 체크아웃 완료 후 주문 데이터 저장 (`match` 결제 중심, dedicated Playwright pending)
- [ ] PAY-002 환불 요청과 후속 상태 반영 (owner-bound detail/refund UI exists, cross-surface verification pending)
- [x] REV-001 Post-event reviews (Task 89 API/UI implemented and validated; payment/badge remain pending)
- [ ] BADGE-001 배지 / 진행도 갱신 (badge catalog exists, earned/progress is mixed sample data)

## PAY-001 체크아웃 완료 후 주문 데이터 저장

### Target Domains

- [x] 개인 매치 참가 결제
- [ ] 장터 주문 (현재 미지원)
- [ ] 레슨 구매 (현재 미지원)

### Steps

- [ ] 결제를 완료한다.
- [ ] `/payments`와 상세 화면을 확인한다.
- [ ] 원 기능 화면에서 상태를 다시 확인한다.

### Expected

- [ ] 결제 내역이 저장된다.
- [ ] 원 화면과 결제 화면의 상태가 일치한다.
- [ ] 중복 결제가 발생하지 않는다.

## PAY-002 환불 요청과 후속 상태 반영

### Steps

- [ ] 환불 요청을 생성한다.
- [ ] 사용자 화면에서 상태를 확인한다.
- [ ] 관리자 또는 정산 화면에서 같은 건을 확인한다.

### Expected

- [ ] 환불 상태가 양쪽 화면에 일관되게 보인다.

## REV-001 경기 후 리뷰 작성과 반영

Canonical detailed scenarios:

- `docs/scenarios/12-v1-sm-new-e2e-scenarios.md` `V1-14-001` through `V1-14-007`.

Primary contracts:

- `GET /reviews?tab=pending|written`
- `GET /reviews/received`
- `GET /reviews/sources/:sourceType/:sourceId`
- `POST /reviews`

### Steps

- [x] 종료된 개인 매치에서 참가자 리뷰 대상을 확인한다.
- [x] 종료된 팀매치에서 현재 owner/manager가 상대 팀 리뷰 대상을 확인한다.
- [x] 별점 `1-5`와 하나 이상의 predefined tag로 리뷰를 제출한다.
- [x] written tab과 received page를 확인한다.
- [x] 동일 reviewer/target/source 중복 제출을 확인한다.

### Expected

- [x] 리뷰가 저장된다.
- [x] 선택한 tag가 `v1_post_event_review_tags`에 저장된다.
- [x] 중복 제출은 기존 리뷰와 `alreadySubmitted: true`로 수렴하고 duplicate row를 만들지 않는다.
- [x] 개인 매치 리뷰는 대상 사용자 reputation summary를 실제 리뷰 기반으로 갱신한다.
- [x] 팀매치 리뷰는 대상 팀 trust score를 실제 리뷰 기반으로 갱신한다.

## BADGE-001 배지 / 진행도 갱신

### Trigger Candidates

- [ ] 경기 완료
- [ ] 리뷰 누적
- [ ] 팀 활동 누적

### Expected

- [ ] `/badges`에 진행도 또는 신규 획득 상태가 반영된다.

## Notes

- 결제/환불은 외부 연동 범위 때문에 mock/stub 경계 정의가 필요하다.
- 2026-04-11: checkout/refund/review/badge 화면은 “구현됨”과 “검증됨”을 분리해서 기록한다. 현재 상태는 implemented surface가 존재하지만 verified scenario는 아직 없음이다.
- 2026-04-11: match payment detail/refund surface는 real-data + owner-bound contract로 정리됐고, context 없는 checkout 진입은 막혀 있다.
- 2026-04-11: lesson/marketplace commerce는 fake success가 아니라 명시적 미지원 상태라서 `PAY-001`의 현재 인스코프는 match payment 중심이다.
- 2026-04-11: `/my/reviews-received`와 `/badges`는 trust signal banner로 sample/mixed 상태를 명시한다. 실데이터 기반 리뷰/뱃지 progression verification은 follow-up이다.
- 2026-04-11: Task 38에서 venue review form의 사진 업로드 UI가 real `/uploads` contract로 연결됐고, venue detail route에서 form open smoke는 통과했다. 다만 리뷰 저장 end-to-end verification은 아직 별도 시나리오로 닫히지 않았다.
- 2026-06-03: Task 89 post-event review는 venue review가 아니라 completed personal match participant review와 completed team match opposing-team review가 canonical이다. `/my/reviews`, `/my/reviews/[sourceType]/[sourceId]`, `/my/reviews/received`와 `/api/v1/reviews*`를 기준으로 검증한다.
- 2026-06-05: REV-001은 Task 89 89-11에서 검증 완료. Evidence: Prisma Client regenerate, API/Web typecheck, backend unit suite 87/87, targeted review view-model test 1/1, and review route responsive smoke 29 routes x 3 viewports with 0 issues (`output/playwright/v1-responsive-smoke/reviews-responsive-smoke-final/report.md`).
