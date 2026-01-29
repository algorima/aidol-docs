# AIdol PRD (Product Requirements Document)

- 목적: AIdol MVP 제품 요구사항 정의
- 상태/버전: draft / v0.2
- 소유자: 김영욱(yw)
- 관련 문서:
  - BM 문서: `20260114__aidol-business-model__draft__v0.1__yw.md`
  - 기술 명세: `20260115__aidol-technical-spec__draft__v0.1__yw.md`
  - 기능명세서: `전체 기능 명세서 2ec46f965504805a94fbed8c0109cd91.md`
  - ERD: `20260122__aidol-erd__draft__v0.1__yw.md`

---

## 1. Overview

### 1.1 Problem Statement

K-pop 팬들은 좋아하는 아이돌과 소통하고 싶지만, 기존 서비스는 **소비** 중심이다:
- Bubble: 실제 아이돌의 일방향 메시지 (양방향 대화 불가)
- Character.AI: 범용 AI 캐릭터 (K-pop 특화 없음, 내가 만든 캐릭터 아님)
- PLAVE: 가상 아이돌 그룹 (사용자가 직접 생성 불가)

### 1.2 Solution

**"내가 상상한 아이돌을 만들고, 대화하고, 키우는 가장 쉬운 방법"**

사용자가 직접 AI 아이돌을 **생성**하고, 텍스트 **채팅**으로 관계를 형성한다.

### 1.3 Hypothesis

> "나만의 아이돌을 만들고 키우는데 사용자가 돈을 지불할 것인가?"

**부분 검증 데이터**: 20명 중 6명이 150,000원 결제 (30% 전환율)

### 1.4 MVP 검증 범위

| 요소 | MVP (Phase 1) | Phase 2 |
|------|--------------|---------|
| **만들고** | ✓ 검증 | - |
| **대화하고** | ✓ 검증 | - |
| **키우는** | △ 로컬 스토리지로 재접근 | 인증 + 육성 시스템 |

MVP는 **"생성 + 대화"** 핵심 경험을 검증. "육성"은 로컬 스토리지로 데이터 연속성 확보 후 Phase 2에서 본격 검증.

---

## 2. Goals & Success Metrics

### 2.1 MVP Goal

**4주 내 (2026-02-16 설 전) MVP 출시, PMF 신호 확인**

### 2.2 Success Metrics

| 지표 | 목표 | 근거 |
|------|------|------|
| 가입자 | 1,000명+ | TikTok 바이럴 |
| D7 Retention | 15%+ | 업계 평균 13% 상회 ([Adjust.com](https://www.adjust.com/blog/what-makes-a-good-retention-rate/)) |
| "매우 실망" 응답 | 40%+ | PMF 기준 ([Superhuman/Sean Ellis](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit)) |
| 유료 전환 의향 | 10%+ | 설문 기반 |

### 2.3 GO/STOP Criteria

**GO (Month 1)**:
- 가입자 ≥ 1,000
- D7 Retention ≥ 15%
- "매우 실망" ≥ 40%

**STOP (Month 1)**:
- 가입자 < 300
- D7 Retention < 7%
- "매우 실망" < 20%

---

## 3. User Stories

### 3.1 Core User Stories

**US-1: 아이돌 생성**
```
As a K-pop 팬,
I want to 외모와 성격을 설명하여 나만의 아이돌을 생성하면,
So I can 내가 상상한 캐릭터를 시각적으로 확인하고 소유할 수 있다.
```

**US-2: 아이돌과 채팅**
```
As a 아이돌 생성자,
I want to 내가 만든 아이돌과 텍스트로 대화하면,
So I can 아이돌과의 관계를 형성하고 감정적 유대를 느낄 수 있다.
```

**US-3: 아이돌 프로필 확인**
```
As a 아이돌 소유자,
I want to 내 아이돌의 프로필(이미지, 이름, 성격)을 확인하면,
So I can 내가 만든 캐릭터를 다시 볼 수 있다.
```

### 3.2 JTBD (Jobs To Be Done)

| When (상황) | I want to (동기) | So I can (결과) |
|-------------|-----------------|-----------------|
| 새로운 K-pop 그룹을 발견했을 때 | 나만의 멤버를 만들고 싶다 | 팬덤 문화에 참여하고 창작 욕구를 충족한다 |
| 최애 아이돌이 휴식 중일 때 | 가상의 아이돌과 대화하고 싶다 | 팬으로서의 감정적 허전함을 채운다 |
| 상상 속 이상형 아이돌이 있을 때 | 그 캐릭터를 직접 만들고 싶다 | 나만의 아이돌을 소유하는 만족감을 느낀다 |

### 3.3 Target User Segments

AIdol은 서로 다른 니즈를 가진 두 사용자 세그먼트를 타깃으로 한다.

#### Segment A: Creator (창작자)

**프로필**:
- K-pop 콘텐츠 제작자, 디렉터, 마케터, 엔터테인먼트 종사자
- AI 아트웍 창작에 관심 있는 메이커
- 연령: 20-40대 (지불 능력 보유)

**니즈**:
- 창작 욕구: 비주얼, 노래, 뮤직비디오 등 AI 아트웍 제작
- 수익화 관심: 포트폴리오, SNS 브랜딩, 사업 아이템 발굴
- 학습 욕구: AI 도구 활용법 습득

**검증 데이터**:
- 공모전 신청자 12명 → 결제자 6명 (50% 전환율)
- 평균 결제 금액: 150,000원
- 주요 채널: 인스타그램, Threads, 링커리어

**MVP 제공 가치**:
- 이미지 생성 + 프로필 카드 → SNS 공유 → 바이럴
- 플랫폼 차별점: 프롬프트 최적화, K-pop 특화 프리셋

#### Segment B: User (소통형 팬)

**프로필**:
- 어린 K-pop 팬 (10-20대)
- 해외 팬 (오프라인 접근 불가)
- 정서적 지지가 필요한 사용자

**니즈**:
- 소통 욕구: 기존 아이돌과의 상호작용 부족 해소
- 감정적 유대: 이상형 아이돌과의 1:1 대화
- 몰입 경험: 내가 만든 캐릭터와의 관계 형성

**검증 데이터**:
- 영상통화 서비스 문의 (해외 사용자)
- TikTok 바이럴 반응 (실제 아이돌로 착각)
- 리텐션 문제: 채팅 경험 불만족 시 즉시 이탈

**MVP 제공 가치**:
- 텍스트 채팅 (fanchat 재사용) → 페르소나 일관성 중요
- 이상형 생성 → 소유감 + 감정적 안전

#### 검증 전략

| 세그먼트 | 검증 방법 | 성공 지표 |
|---------|---------|---------|
| Creator | 설문조사 (창작 의향, 공유 의향) | 공유율 ≥20% |
| User | 설문조사 (채팅 만족도, 재방문 의향) | D7 Retention ≥15% |

**Note**: 두 세그먼트는 상호 보완적. Creator가 만든 아이돌을 User가 소비하는 순환 구조 가능성 존재 (Phase 2 이후).

---

## 4. Functional Requirements

### 4.1 아이돌 생성

#### 4.1.1 그룹 기획

| 기능 | 요구사항 | 비고 |
|------|---------|------|
| 그룹 정보 | 그룹명(필수), 컨셉(선택) | K-pop 주류 모델 |
| 엠블럼 생성 | 텍스트 프롬프트로 그룹 엠블럼 이미지 생성 | 512×512 PNG |
| 인사 문구 | 그룹 고유 인사 문구 입력 (선택) | 예: "안녕하세요, OOO입니다!" |
| 이메일 수집 | 이메일 입력 (선택) | 마케팅용, 빈 값 허용 |

#### 4.1.2 프리셋 연습생 캐스팅

| 기능 | 요구사항 | 비고 |
|------|---------|------|
| 프리셋 연습생 | 시스템 제공 연습생 풀 (사전 생성) | 이름, 성별(Enum), MBTI 슬라이더 4개, 등급(Enum), 능력치, 이미지 포함 |
| 성별 필터 | 남성(기본) / 여성 / 혼성 필터링 | Gender Enum |
| 연습생 목록 | 2열 카드 그리드, 등급 배지 표시 | 계약 완료된 연습생은 블러 처리 |
| 상세 프로필 | 육각형 능력치 차트 (보컬/댄스/랩/비주얼/체력/매력) | 팝업 형태 |
| **캐스팅 (경쟁)** | **다중 사용자 경쟁 자원 확보** | **선착순, 한 번 캐스팅되면 다른 사용자 선택 불가** |
| 계약 완료 상태 | `aidol_id != null`로 판단, 목록에서 블러 + "계약 완료" 레이블 | 영구적 (해제 없음) |

> **설계 의도**: 프리셋 연습생은 **한정 자원**으로, 선착순 캐스팅 경쟁을 통해 희소성과 긴장감을 제공한다. 이는 실제 아이돌 업계의 연습생 영입 경쟁을 모사한 게이미피케이션 요소이다.

**상태 판단**:

| aidol_id | 의미 | UI |
|----------|------|-----|
| `null` | 프리셋 연습생 (캐스팅 안 됨) | 선택 가능 |
| `not null` | 캐스팅됨 | 블러 + "계약 완료" |

**캐스팅 흐름**:

```
첫 캐스팅:
  1. claimToken 생성 → localStorage 저장
  2. POST /aidols { claimToken }        → 빈 그룹 생성
  3. PATCH /companions/{id} { aidolId, claimToken }
     → 서버: aidol.claim_token === claimToken 검증
     → aidol_id 연결 = 캐스팅됨

이후 캐스팅:
  1. localStorage에서 claimToken 조회
  2. PATCH /companions/{id} { aidolId, claimToken }
     → 서버: aidol.claim_token === claimToken 검증
```

**소유권 검증**: 모든 캐스팅 요청에 `claimToken` 필수. 서버는 `aidol.claim_token`과 일치 여부 검증. 불일치 시 403 Forbidden.

**Note**: `is_preset`, `is_casted` 필드 없음. `aidol_id` 값으로 상태 판단.

#### 4.1.3 신규 멤버 생성

| 기능 | 요구사항 | 비고 |
|------|---------|------|
| 성별 선택 | 남성 / 여성 | Step 1, Gender Enum |
| MBTI 설정 | 4개 슬라이더 (I↔E, S↔N, T↔F, J↔P) | 0-100 연속값, 정도 표현 가능 |
| 멤버 이름 | 필수 입력 | Step 3 |
| 이미지 생성 | 텍스트 프롬프트로 프로필 이미지 생성 | 512×512 PNG, 재생성 가능 |
| 초기 상태 | 등급 F(Enum), 모든 능력치 0, aidol_id 즉시 연결 | 프리셋과 차별화 |

#### 4.1.4 캐스팅 보드

| 기능 | 요구사항 | 비고 |
|------|---------|------|
| 캐스팅 목록 | 캐스팅된 멤버 2열 카드 그리드 | `aidol_id = {myAidolId}` |
| 삭제 기능 | 카드 탭 → 삭제 확인 팝업 | 삭제 시 `aidol_id=null` 복원 |
| 데뷔조 확정 | 최소 N명 이상일 때 활성화 | 그룹 생성으로 진행 |

#### 4.1.5 포지션 배정

| 기능 | 요구사항 | 비고 |
|------|---------|------|
| 포지션 목록 | 리더, 메인보컬, 서브보컬, 메인댄서, 서브댄서, 메인래퍼, 서브래퍼, 비주얼, 막내 | 9개, Position Enum |
| 중복 규칙 | 리더/메인보컬/메인댄서/메인래퍼/비주얼/막내 = 1명만 | 서브 포지션은 중복 가능 |
| 포지션 선택 | 카드 탭 → 포지션 선택 팝업 | - |

#### 4.1.6 저장 및 소유권

| 기능 | 요구사항 | 비고 |
|------|---------|------|
| 서버 저장 | AIdol + Companion 테이블 | owner_id = null (MVP) |
| 소유권 증명 | `claim_token` (UUID) | aidol.claim_token에 저장 |
| 클라이언트 저장 | localStorage에 `claimToken`만 저장 | ID 배열 저장 ❌ |

**localStorage 용도**:
- ✓ `claimToken`: 소유권 증명, Phase 2 마이그레이션
- ❌ 캐스팅한 연습생 ID 배열 (aidol_id로 서버 조회)

**페이지 간 상태 전달**:
```
캐스팅 보드 진입:
  1. claimToken = localStorage.getItem('claimToken')
  2. GET /aidols?filter=claimToken:{token}  → 내 그룹
  3. GET /companions?filter=aidolId:{id}    → 내 멤버
```

### 4.2 채팅 (fanchat 재사용)

| 기능 | 요구사항 | 비고 |
|------|---------|------|
| 텍스트 채팅 | 사용자 ↔ 멤버 1:1 대화 | 본인 멤버만 |
| 페르소나 반영 | 생성 시 입력한 성격 기반 응답 | LLM 시스템 프롬프트 |
| 대화 히스토리 | 이전 대화 내용 유지 (P1) | 서버 저장 |

### 4.3 관리/공유

| 기능 | 요구사항 | 비고 |
|------|---------|------|
| 갤러리 | localStorage 기반 내 그룹 목록 | 브라우저 종료 후 유지 |
| URL 공유 | 그룹/멤버 프로필 조회만 (대화 불가) | "나도 만들기" CTA |

UX Flow, Page Structure는 디자인 문서 참조.

---

## 5. Non-Functional Requirements

### 5.1 Performance

| 항목 | 요구사항 | 비고 |
|------|---------|------|
| 이미지 생성 시간 | ≤ 30초 | 사용자 이탈 방지 |
| 채팅 응답 시간 | ≤ 3초 | 첫 토큰 표시 기준 |
| 페이지 로드 | ≤ 2초 | 이미지 lazy loading |

### 5.2 Scalability

| 항목 | MVP 목표 | 비고 |
|------|---------|------|
| 동시 생성 요청 | 10 QPS | 초기 트래픽 기준 |
| MAU | 1,000명 | Month 1 목표 |

### 5.3 Reliability

| 항목 | 요구사항 |
|------|---------|
| 가용성 | 99% (월 7시간 다운타임 허용) |
| 데이터 백업 | 일 1회 |

### 5.4 Security

| 항목 | 요구사항 |
|------|---------|
| 프롬프트 필터링 | NSFW/유해 콘텐츠 차단 |
| Rate Limiting | 생성 요청 1회/분/세션 |
| 인증 | MVP에서는 인증 없음 (익명/세션 기반) |

---

## 6. Out of Scope (MVP 제외)

| 기능 | 제외 이유 |
|------|----------|
| 인증/로그인 | MVP 단순화, 익명 사용으로 진입 장벽 제거 |
| 로컬→계정 마이그레이션 | 인증 추가 시 함께 구현 |
| 육성 시스템 (친밀도/레벨) | 인증 기반 데이터 누적 필요 |
| SSE 스트리밍 응답 | MVP 단순화, 전체 응답 후 표시 |
| 실시간 영상 통화 | 기술 미성숙, 비용 높음 |
| 음성 응답 (TTS) | MVP 검증 후 추가 |
| 콘테스트/랭킹 | 사용자 기반 필요 |
| 굿즈 생성 | 수익화 모델 검증 후 |
| 다중 이미지 선택 | 복잡도 증가 |
| 아이돌 커스터마이징 | MVP 단순화 |

Phase별 배치는 User Story Map 참조. 마이그레이션 경로는 Technical Spec 참조.

---

## 7. Risks & Mitigations

### 7.1 Product Risks

| 리스크 | 영향 | 확률 | 대응 |
|-------|------|------|------|
| 이미지 생성 품질 낮음 | 사용자 이탈 | 중 | 프리셋 스타일 제공, 재생성 기능 |
| 페르소나 일관성 부족 | 몰입 저하 | 중 | 프롬프트 엔지니어링, 피드백 수집 |
| Character.AI 경쟁 | 대체됨 | 저 | K-pop 특화, 생성 기능 차별화 |

### 7.2 Technical Risks

| 리스크 | 영향 | 확률 | 대응 |
|-------|------|------|------|
| 이미지 생성 API 장애 | 생성 불가 | 저 | Fallback 이미지 (기본 실루엣) |
| CompanionProfile 스키마 충돌 | 기존 데이터 영향 | 저 | 새 필드만 추가 (nullable) |

---

## 8. Open Questions

### 8.1 Product Questions

| ID | 질문 | 의사결정자 | 우선순위 |
|----|------|-----------|---------|
| OQ-1 | 프리셋 스타일 제공 범위? (귀여운/시크/청량/카리스마 외 추가?) | PM | P1 |
| OQ-2 | 생성 실패 시 크레딧 환불 정책? (MVP에서 크레딧 시스템 없음) | PM | P2 |
| OQ-3 | 유해 콘텐츠 필터링 기준? (어디까지 허용?) | Legal/PM | P0 |

### 8.2 Technical Questions

| ID | 질문 | 의사결정자 | 우선순위 |
|----|------|-----------|---------|
| ~~OQ-4~~ | ~~이미지 생성 API 선택?~~ → **결정: OpenAI GPT Image 1.5** (최신 모델, 기존 API 키 재사용) | Engineering | 완료 |
| OQ-5 | 생성된 이미지 저장소? (S3 vs CloudFlare R2) | Engineering | P1 |

---

## 9. References

### 9.1 Internal Documents

- BM 문서: `20260114__aidol-business-model__draft__v0.1__yw.md`
- 기술 명세: `20260115__aidol-technical-spec__draft__v0.1__yw.md`
- 회의록: `~/buppy/Meeting Transcription.txt` (2026-01-14)

### 9.2 External Sources

| 출처 | 데이터 | 검증일 |
|------|--------|-------|
| [Adjust.com](https://www.adjust.com/blog/what-makes-a-good-retention-rate/) | D7 Retention 업계 평균 13%, Social apps D1 29% | 2026-01-15 |
| [Superhuman/First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit) | "매우 실망" 40%가 PMF 기준 (Sean Ellis) | 2026-01-15 |
| [Business of Apps](https://www.businessofapps.com/data/character-ai-statistics/) | Character.AI 20M MAU (2025.01), 평균 세션 2시간 | 2026-01-15 |

---

**작성일**: 2026-01-15 (v0.1), 2026-01-24 (v0.2)
**작성자**: Claude Opus 4.5 + 김영욱
**버전**: v0.2 (draft)
