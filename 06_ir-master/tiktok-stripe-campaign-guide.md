# TikTok + Stripe 세일즈 캠페인 실행 가이드

## 1. 개요

TikTok 영상 → Linktree → Stripe 결제로 이어지는 첫 매출 캠페인.
개발 없이 바로 실행 가능한 세팅이 완료된 상태.

**목표:** 2026.03~04 내 첫 유료 결제 100건+ 달성

## 2. 세팅 현황

### 2.1 Linktree

- URL: https://linktr.ee/aioia_official
- TikTok bio에 이 링크 연결

### 2.2 Stripe Payment Links (Live)

실제 결제가 가능한 링크. Linktree에 아래 링크를 추가하면 됨.

> **참고**: 아래 가격은 해외 유저 대상 Early Bird 프로모션 가격입니다. 국내 가격 정책(3,000~10,000원)은 `05-business-model.md`를 참조하세요.

| 상품 | 가격 | Payment Link |
| --- | --- | --- |
| AIdol Season Pass (Early Bird) | $1.49/월 (구독) | https://buy.stripe.com/9B63cuaBLdu80Uh8e6bEA08 |
| AIdol Draft Slot | $1.99 (일회성) | https://buy.stripe.com/fZu8wO8tDfCgeL7dyqbEA09 |
| AIdol Premium Concept Pack | $2.99 (일회성) | https://buy.stripe.com/dRm6oG5hr1Lq32pfGybEA0a |

### 2.3 AIdol 체험 링크

Linktree에 추가할 제품 체험 링크:

```
https://aioia.ai/aidol?utm_source=tiktok&utm_medium=linktree
```

**주의:** 반드시 `?utm_source=tiktok&utm_medium=linktree` 를 붙여야 유입 추적이 됨.

## 3. Linktree 세팅 방법

1. https://linktr.ee/admin 접속
2. "Add link" 클릭
3. 아래 순서대로 링크 추가 (위에서 아래로 우선순위)

| 순서 | 링크 제목 (영어) | URL |
| --- | --- | --- |
| 1 | Try AIdol - Build Your K-pop Idol Group | `https://aioia.ai/aidol?utm_source=tiktok&utm_medium=linktree` |
| 2 | Season Pass (Early Bird) - $1.49/mo | https://buy.stripe.com/9B63cuaBLdu80Uh8e6bEA08 |
| 3 | Draft Slot - $1.99 | https://buy.stripe.com/fZu8wO8tDfCgeL7dyqbEA09 |
| 4 | Premium Concept Pack - $2.99 | https://buy.stripe.com/dRm6oG5hr1Lq32pfGybEA0a |

## 4. UTM 규칙

### 4.1 UTM이 필요한 링크

aioia.ai로 향하는 링크에만 UTM을 붙임. Stripe Payment Link에는 붙이지 않음 (Stripe Dashboard에서 자체 추적됨).

### 4.2 UTM 파라미터 규칙

| 파라미터 | 값 | 설명 |
| --- | --- | --- |
| utm_source | `tiktok` | 유입 채널 |
| utm_medium | `linktree` | 중간 경로 |
| utm_campaign | (선택) 캠페인명 | 특정 캠페인 구분 시 사용 |

### 4.3 채널별 UTM 예시

나중에 다른 채널을 추가할 때 이 규칙을 따름:

| 채널 | UTM |
| --- | --- |
| TikTok | `?utm_source=tiktok&utm_medium=linktree` |
| Instagram | `?utm_source=instagram&utm_medium=linktree` |
| Twitter/X | `?utm_source=twitter&utm_medium=linktree` |
| 직접 공유 | `?utm_source=direct&utm_medium=share` |

## 5. 성과 확인 방법

### 5.1 클릭 수 (Linktree)

- https://linktr.ee/admin → Analytics
- 링크별 클릭 수 확인 가능 (무료)

### 5.2 결제 (Stripe Dashboard)

- https://dashboard.stripe.com → Payments
- 결제 건수, 금액, 시간 확인
- 구독(Season Pass)은 Subscriptions 탭에서 확인

### 5.3 사이트 유입 (PostHog)

- PostHog Dashboard에서 utm_source=tiktok 필터로 조회
- aioia.ai/aidol 페이지뷰 + UTM 소스별 분류 확인

### 5.4 전환율 퍼널

```
TikTok 영상 조회 → Linktree 클릭 → Stripe 결제
```

- Linktree 클릭 / TikTok 조회 = 클릭률
- Stripe 결제 / Linktree 클릭 = 전환율

## 6. TikTok 영상 운영

### 6.1 영상에 포함할 CTA

- "Link in bio" 멘트 또는 텍스트
- 영상 설명에 "Link in bio" 포함

### 6.2 영상 아이디어

- AIdol로 그룹 만드는 과정 (캐스팅 → 그룹 구성)
- AI 아이돌과 채팅하는 장면
- "나만의 K-pop 그룹 만들기" 챌린지
- 미진 담당: 춤/노래 영상 제작 → AIdol 연계 콘텐츠

## 7. 체크리스트

- [ ] Linktree에 4개 링크 추가 완료
- [ ] TikTok bio에 Linktree URL 연결
- [ ] 테스트 결제 1건 진행 (본인 카드로 $1.49 결제 후 환불)
- [ ] 첫 TikTok 영상 업로드
- [ ] Stripe Dashboard 접속 확인
- [ ] 1주일 후 Linktree 클릭 수 + Stripe 결제 수 확인
