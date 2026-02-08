# Phase 2 실행 계획 (Sprint 4-5-6)

- **기간**: 3주 (Sprint 4, 5, 6)
- **전제 조건**: Phase 1 검증 완료 (전환율 30%+, 공유 의향 4.0+)
- **목표**: 관계성 반영 채팅 + 다른 그룹 채팅 활성화
- **작성일**: 2026-02-08

---

## Phase 2 핵심 차별점 (팬들 환장 포인트!)

### ⭐️ 1. 다른 그룹 멤버와도 채팅 가능
- Phase 1: 내 그룹 멤버와만 채팅
- **Phase 2: 모든 그룹 멤버와 채팅**

### ⭐️ 2. 관계성 반영 채팅
- Phase 1: 관계 설정만 가능, 채팅에 반영 X
- **Phase 2: Sprint 2 설정한 관계가 대화에 반영**
- 예: A-B "라이벌" → A와 채팅 시 B 언급하면 경쟁심 표현

---

## Sprint 4: 다른 그룹 채팅 활성화 (1주)

### 목표
- 그룹 탐색 기능
- 팔로우 시스템
- 다른 그룹 멤버와 채팅 허용

---

### Day 1-2: 그룹 탐색 + 팔로우

**P0-1: 그룹 탐색 화면 (4시간)**

```yaml
작업:
  1. 홈 화면 "다른 그룹" 섹션 (1.5시간)
     - 프리셋 그룹 카드 리스트
     - 그룹 엠블럼, 이름, 멤버 수

  2. 그룹 상세 페이지 (1.5시간)
     - 그룹 정보, 멤버 목록
     - "팔로우" 버튼

  3. 정렬/필터 (1시간)
     - 인기순 / 최신순
     - 성별 필터 (남성그룹/여성그룹/혼성)

산출물:
  - /frontend/src/app/[lang]/explore/page.tsx
  - /frontend/src/app/[lang]/groups/[groupId]/page.tsx

검증 기준:
  ✅ 다른 그룹 목록 표시
  ✅ 그룹 상세 페이지 진입
  ✅ 정렬 작동
```

**P0-2: 팔로우 시스템 (3시간)**

```yaml
작업:
  1. 백엔드 API (1.5시간)
     - POST /api/groups/{id}/follow
     - DELETE /api/groups/{id}/follow
     - GET /api/users/me/following

  2. 프론트엔드 (1.5시간)
     - 팔로우 버튼 토글
     - 팔로우 상태 표시
     - 팔로우한 그룹 목록

데이터베이스:
  Table: follows
    userId: string
    groupId: string
    followedAt: timestamp

검증 기준:
  ✅ 팔로우/언팔로우 작동
  ✅ 팔로우한 그룹 목록 확인 가능
```

---

### Day 3-4: 다른 그룹 채팅 허용

**P0-3: 채팅 권한 확장 (3시간)**

```yaml
작업:
  1. 권한 체크 로직 수정 (1시간)
     기존: if (companion.groupId === myGroupId) → allow
     신규: if (companion.groupId === myGroupId || isFollowing(companion.groupId)) → allow

  2. Inbox 화면 재구성 (1.5시간)
     - "내 그룹" 섹션
     - "팔로우한 그룹" 섹션
     - 섹션별 구분선

  3. 채팅 UI 구분 (0.5시간)
     - 내 그룹: 프로필 배경 파란색
     - 다른 그룹: 프로필 배경 회색
     - 그룹명 표시

검증 기준:
  ✅ 팔로우한 그룹 멤버와 채팅 시작 가능
  ✅ Inbox에서 섹션별 구분됨
  ✅ 팔로우 안 한 그룹은 제한 모달 표시
```

**P0-4: 제한 로직 구현 (2시간)**

```yaml
작업:
  - 무료: 팔로우 3개 그룹까지
  - 프리미엄: 무제한 팔로우
  - 팔로우 제한 도달 시 업그레이드 모달

검증 기준:
  ✅ 무료 유저 3개 초과 시 모달 표시
  ✅ 프리미엄 구독 시 제한 해제
```

---

### Day 5: 테스트 + 폴리싱

**P0-5: 전체 플로우 테스트 (2시간)**

```yaml
시나리오:
  1. 그룹 탐색 → 3개 그룹 팔로우
  2. 각 그룹 멤버와 채팅 시작
  3. 4번째 그룹 팔로우 시도 → 제한 모달
  4. Inbox에서 섹션별 확인

검증 기준:
  ✅ 모든 시나리오 통과
  ✅ 에러 없음
```

---

## Sprint 5: 관계성 반영 채팅 (1주)

### 목표
- 관계 컨텍스트를 채팅에 반영
- 자연스러운 관계 표현

---

### Day 1-2: 관계 컨텍스트 로딩

**P0-6: 백엔드 관계 API (3시간)**

```yaml
작업:
  GET /api/companions/{id}/context

  Response:
    {
      companion: {
        id, name, position, mbti, biography
      },
      relationships: [
        {
          targetCompanionId: "abc",
          targetName: "서윤",
          targetPosition: "mainDancer",
          relationType: "rival",
          customType: null,
          nickname: "라이벌즈",
          description: "같은 그룹 메인 포지션 경쟁"
        },
        {...}
      ]
    }

검증 기준:
  ✅ 채팅 시작 시 관계 정보 로드
  ✅ 모든 관계 타입 포함
```

**P0-7: 채팅 프롬프트에 관계 추가 (4시간)**

```yaml
작업:
  시스템 프롬프트 v2:
    """
    You are {companion.name}, a K-pop idol.

    Profile:
    - Position: {companion.position}
    - MBTI: {companion.mbti}
    - Personality: {companion.biography}

    Your relationships:
    {for each relationship}
    - {target.name} ({target.position}): {relationType}
      Context: {relationshipContext}
      Nickname: {nickname}
    {/for}

    Instructions:
    - When user mentions someone in your relationships, reflect the relationship naturally
    - Don't overdo it - not every response needs to mention relationships
    - Be authentic to the relationship type

    Examples:
    User: "서윤이랑 잘 지내?"
    You (if rival): "서윤이? ㅋㅋ 연습실에서 맨날 경쟁하는데 나 지면 안 되지! 근데 실력은 인정한다."
    You (if friend): "서윤이? 우리 완전 친해~ 어제도 같이 야식 먹었어ㅎㅎ"
    """

검증 기준:
  ✅ 관계 정보가 프롬프트에 포함됨
  ✅ 예시 응답 자연스러움
```

---

### Day 3-4: 관계성 반영 테스트 + 튜닝

**P0-8: 관계 타입별 테스트 (3시간)**

```yaml
테스트 시나리오:
  1. 라이벌 관계
     User: "서윤이 어때?"
     Expected: 경쟁심 + 존중

  2. 소꿉친구 관계
     User: "지우 얘기 좀 해봐"
     Expected: 친근함 + 추억

  3. 같은 기획사 출신
     User: "하준이랑 어떻게 알아?"
     Expected: 동질감 + 과거 이야기

  4. 커스텀 관계 ("멍멍즈")
     User: "민준이는?"
     Expected: 별명 언급 + 관계 특성

각 시나리오 × 10회 대화 = 40개 응답 검토

검증 기준:
  ✅ 관계성이 자연스럽게 반영됨
  ✅ 과도한 언급 없음 (50% 정도만 관계 언급)
  ✅ 관계 타입별 톤 차이 명확
```

**P0-9: 프롬프트 튜닝 (4시간)**

```yaml
작업:
  1. 부자연스러운 응답 패턴 수집
  2. 프롬프트 조정
     - "Don't overdo it" → 구체적 비율 제시
     - 관계별 톤 가이드 추가
  3. 재테스트

튜닝 포인트:
  - 모든 대화에 관계 언급 X
  - 유저가 먼저 언급했을 때만 상세히 설명
  - 자연스럽게 흘러가는 대화 유지

검증 기준:
  ✅ 2차 테스트 품질 4.0+/5.0
  ✅ 부자연스러운 응답 < 10%
```

---

### Day 5: 내부 UT

**P0-10: 관계성 채팅 내부 UT (1일)**

```yaml
참가자:
  - 팀원 5명
  - 각자 Phase 1에서 만든 그룹 사용

진행:
  1. 관계 설정 확인 (최소 3개 관계)
  2. 각 관계 멤버와 10회 이상 대화
  3. 설문 작성:
     - 관계가 자연스럽게 반영되었나요? (1-5점)
     - 어색한 부분이 있었나요? (주관식)
     - 팬들이 환장할 만한가요? (1-5점)

검증 기준:
  ✅ 평균 만족도 4.0+/5.0
  ✅ "환장할 만하다" 4.0+/5.0
  ✅ 치명적 버그 없음
```

---

## Sprint 6: 콘텐츠 자동 생성 PoC (1주)

### 목표
- LLM 기반 스토리 자동 생성 검증
- 10개 샘플 생성 + 품질 평가
- Phase 3 진행 여부 판단

---

### Day 1: 파이프라인 설계

**P0-11: 콘텐츠 생성 파이프라인 (2시간)**

```yaml
파이프라인:
  Input:
    - groupId
    - contentType: "member_review" | "daily_story"
    - targetMembers: [memberId1, memberId2]

  Step 1: 컨텍스트 수집 (API 호출)
    - 그룹 정보
    - 멤버 프로필
    - 관계 정보

  Step 2: LLM 생성
    - 프롬프트 구성
    - Claude API 호출
    - 채팅 UI 형태 텍스트 생성

  Step 3: 검수
    - 길이 체크 (5-10개 대화)
    - 욕설/부적절 표현 필터링

  Step 4: 썸네일 생성
    - Gemini Nanobanana API
    - 이미지 프롬프트 자동 생성

  Output:
    - content: { title, chatMessages[], thumbnail }

검증 기준:
  ✅ 파이프라인 구조 정의됨
  ✅ 각 단계 역할 명확
```

---

### Day 2-3: 콘텐츠 생성 프롬프트

**P0-12: 멤버 후기 프롬프트 (4시간)**

```yaml
프롬프트:
  """
  You are {memberA.name}, writing a casual chat-style review about {memberB.name}.

  Context:
  - Your group: {group.name}
  - Your relationship: {relationship.type} ({relationship.nickname})
  - Setting: After living in dorm for 1 week

  Write 5-10 chat messages about {memberB}:
  1. First impression
  2. Surprising habit or trait
  3. Something you admire or find funny
  4. A specific moment or story
  5. Final comment

  Format: Korean chat bubbles, casual tone, K-pop idol style
  Each message: 2-3 sentences max
  Reflect your relationship naturally (don't force it)
  """

테스트:
  - 5개 관계 타입 × 2개 샘플 = 10개 생성
  - 품질 평가 (1-5점)

검증 기준:
  ✅ 10개 샘플 생성됨
  ✅ 관계성 반영됨
  ✅ 평균 품질 3.5+/5.0
```

**P0-13: 일상 스토리 프롬프트 (3시간)**

```yaml
프롬프트:
  """
  Write a chat-style story about {event} involving {member1} and {member2}.

  Context:
  - Group: {group.name}
  - Relationship: {relationship.type}
  - Setting: {setting}

  Structure:
  - Setup: What happened
  - Interaction: How they reacted based on their relationship
  - Punchline or resolution

  Format: 7-10 chat messages
  Include: reactions, dialogue, emotions
  Reflect relationship naturally
  """

테스트:
  - 5개 이벤트 × 2개 샘플 = 10개 생성

검증 기준:
  ✅ 10개 샘플 생성됨
  ✅ 스토리 구조 갖춰짐
  ✅ 평균 품질 3.5+/5.0
```

---

### Day 4: 썸네일 자동 생성

**P0-14: 이미지 프롬프트 생성 (3시간)**

```yaml
작업:
  1. 스토리 → 이미지 프롬프트 자동 변환
     - LLM이 스토리 읽고 시각적 장면 추출
     - K-pop 아이돌 스타일 명시

  2. Gemini Nanobanana API 호출
     - 생성된 프롬프트로 이미지 생성

  3. 품질 체크
     - 스토리와 어울리는지 확인

예시:
  스토리: "민준이와 서윤이가 연습실에서 춤 배틀"
  이미지 프롬프트:
    "Two K-pop idols in dance practice room,
     one energetic male with blue hair,
     one focused female with black hair,
     friendly competition atmosphere,
     bright studio lighting,
     anime art style"

검증 기준:
  ✅ 20개 썸네일 생성
  ✅ 스토리와 어울림
  ✅ 품질 acceptable
```

---

### Day 5: PoC 평가 + Go/No-Go

**P0-15: 자동 생성 품질 UT (1일)**

```yaml
목표:
  - 자동 생성 vs 수동 제작 비교
  - 유저가 구분할 수 있는지 확인

진행:
  1. 자동 생성 10개 준비
  2. Phase 1 수동 제작 10개 준비
  3. 사용자 5-10명에게 랜덤 노출
  4. 설문:
     - 어느 쪽이 더 재미있었나요?
     - 자동 생성인지 구분할 수 있었나요?
     - 품질 점수 (1-5점)

검증 기준:
  ✅ 자동 생성 품질 >= 3.5/5.0
  ✅ 수동 제작과 품질 차이 < 0.5점
  ✅ 50%+ 유저가 자동 생성 못 구분
```

**P0-16: Phase 3 Go/No-Go 판단**

```yaml
GO 조건:
  ✅ 관계성 반영 채팅 만족도 4.0+
  ✅ 다른 그룹 채팅 활성화 (팔로우 3+/유저)
  ✅ 콘텐츠 자동 생성 품질 3.5+
  ✅ 유저가 자동/수동 구분 못 함

→ Phase 3 진행

NO-GO:
  ❌ 콘텐츠 품질 < 3.0
  ❌ 관계성 반영 어색함

→ 콘텐츠 자동 생성 중단
→ 수동 큐레이션 플랫폼으로 pivot
```

---

## 핵심 성공 지표

| 카테고리 | 지표 | 목표 | 측정 방법 |
|---------|------|------|----------|
| **채팅 확장** | 팔로우한 그룹 수/유저 | 3개+ | DB 쿼리 |
| **관계성** | 관계 반영 만족도 | 4.0+/5.0 | UT 설문 |
| **관계성** | 환장 포인트 점수 | 4.0+/5.0 | UT 설문 |
| **자동 생성** | 콘텐츠 품질 | 3.5+/5.0 | UT 설문 |
| **자동 생성** | 자동/수동 구분 실패율 | 50%+ | UT 설문 |

---

## 리스크 및 대응

### 리스크 1: 관계성 반영이 어색함
- **확률**: 중
- **영향**: 핵심 차별점 상실
- **대응**: 프롬프트 튜닝 반복, 다양한 테스트

### 리스크 2: 콘텐츠 자동 생성 품질 낮음
- **확률**: 중
- **영향**: Phase 3+ 진행 불가
- **대응**: PoC 철저히 검증, 품질 < 3.0이면 pivot

### 리스크 3: 팔로우 기능 사용 저조
- **확률**: 저
- **영향**: 다른 그룹 채팅 활성화 실패
- **대응**: 프리셋 그룹 품질 강화, 추천 알고리즘

---

## 우선순위

### P0 (Must Have)
1. 그룹 탐색 + 팔로우
2. 다른 그룹 채팅 허용
3. 관계 컨텍스트 로딩
4. 관계성 반영 프롬프트
5. 콘텐츠 자동 생성 PoC

### P1 (Should Have)
1. 팔로우 제한 로직
2. 프롬프트 튜닝 고도화

### P2 (Nice to Have)
1. 팔로우 추천 알고리즘
2. 관계 진화 시스템

---

## 완료 기준

### Sprint 4 완료
- [ ] 그룹 탐색 + 팔로우 기능 작동
- [ ] 다른 그룹 멤버와 채팅 가능
- [ ] 제한 로직 작동

### Sprint 5 완료
- [ ] 관계 컨텍스트 로딩
- [ ] 관계성 반영 채팅 작동
- [ ] 내부 UT 만족도 4.0+

### Sprint 6 완료
- [ ] 콘텐츠 자동 생성 파이프라인 구축
- [ ] 20개 샘플 생성
- [ ] PoC 품질 평가 3.5+
- [ ] Phase 3 Go/No-Go 판단 완료

---

**다음 단계: Phase 3**
- 콘텐츠 업로드 시스템
- 탐색 (피드, 검색, 트렌딩)
- 구독, 좋아요, 댓글
