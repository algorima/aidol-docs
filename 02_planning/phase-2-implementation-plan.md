# Phase 2 실행 계획: UGC 콘텐츠 플랫폼 전환

- **목적**: Phase 2 구현을 위한 상세 실행 계획
- **대상**: 개발팀, AI 에이전트 (Claude, OpenClaw)
- **상태**: active / v1.0
- **작성일**: 2026-02-08
- **전제 조건**: Phase 1 완료 + Go 결정 (전환율 30%+, 공유 의향 4.0+)

## 1. Phase 2 목표

### 1.1 핵심 전환 사항

**From Phase 1:**
- 내 AI 아이돌과만 1:1 채팅
- 관계성 설정만 가능 (채팅에 반영 X)
- 다른 그룹 콘텐츠는 보기만 가능

**To Phase 2:**
- ✅ **다른 그룹 멤버와도 1:1 채팅 가능**
- ✅ **Sprint 2 관계성이 채팅 맥락에 반영** ⭐️ 팬들 환장 포인트
- ✅ 콘텐츠 자동 생성 + 플랫폼 업로드
- ✅ 추천/검색/구독 시스템
- ✅ 크리에이터 수익 분배

### 1.2 성공 지표

| 지표 | 6개월 목표 | 12개월 목표 |
|------|-----------|------------|
| MAU | 50K | 200K |
| 크리에이터 수 | 1K | 10K |
| 일평균 콘텐츠 업로드 | 100 | 500 |
| 평균 세션 시간 | 15분 | 30분 |
| 크리에이터 수익 (상위 100명) | $100/월 | $500/월 |

## 2. 구현 우선순위 (3단계)

### Stage 1: 채팅 확장 + 관계성 반영 (Month 1-2)

**목표:** 다른 그룹과 채팅 + 관계성 맥락 반영

**Features:**
1. 다른 그룹 멤버와 1:1 채팅
2. 관계성 기반 채팅 컨텍스트 생성
3. 팔로우 시스템

### Stage 2: 콘텐츠 생성 + 플랫폼 인프라 (Month 3-4)

**목표:** 자동 생성 콘텐츠 업로드 + 탐색

**Features:**
1. 콘텐츠 자동 생성 파이프라인
2. 콘텐츠 업로드 + 공개/비공개 설정
3. 추천/트렌딩 시스템 (v1: 인기순/최신순)
4. 검색 기능

### Stage 3: 수익화 + 크리에이터 도구 (Month 5-6)

**목표:** 크리에이터 이코노미 구축

**Features:**
1. 조회수/좋아요 측정
2. 수익 분배 시스템 (70/30)
3. 크리에이터 대시보드
4. 구독/멤버십 시스템

## 3. Stage 1: 채팅 확장 + 관계성 반영

### 3.1 Feature: 다른 그룹 멤버와 1:1 채팅

#### 3.1.1 요구사항

**As a 사용자:**
- 다른 사용자가 만든 AI 아이돌 그룹 탐색 가능
- 다른 그룹의 멤버와 1:1 채팅 시작 가능
- 여러 그룹의 멤버와 동시에 채팅 유지 가능

**Acceptance Criteria:**
- [ ] 홈 화면에 "탐색" 탭 추가
- [ ] 다른 그룹 프로필 상세 페이지 표시
- [ ] 멤버 클릭 → 채팅 시작 가능
- [ ] 수신함에 내 그룹 + 다른 그룹 멤버 채팅 모두 표시
- [ ] 채팅방별로 멤버 정보 표시 (그룹명, 포지션, 관계성)

#### 3.1.2 기술 구현

**Database Schema 변경:**

```sql
-- 기존: conversations 테이블
ALTER TABLE conversations
ADD COLUMN is_own_group BOOLEAN DEFAULT true,
ADD COLUMN companion_owner_id VARCHAR(255),
ADD INDEX idx_companion_owner (companion_owner_id);

-- 새로운 테이블: follows
CREATE TABLE follows (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  aidol_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_follow (user_id, aidol_id),
  INDEX idx_user_id (user_id),
  INDEX idx_aidol_id (aidol_id)
);
```

**API Endpoints:**

```typescript
// 다른 그룹 탐색
GET /api/aidols/explore
Query: {
  page: number,
  pageSize: number,
  sort: 'popular' | 'recent' | 'trending'
}
Response: {
  aidols: AIdol[],
  total: number,
  hasMore: boolean
}

// 다른 그룹 팔로우
POST /api/aidols/{aidolId}/follow
Response: { success: boolean }

// 다른 그룹 멤버와 채팅 시작
POST /api/conversations/start
Body: {
  companionId: string,
  isOwnGroup: boolean
}
Response: {
  conversationId: string,
  companion: Companion,
  owner: { id: string, name: string }
}

// 수신함 조회 (내 그룹 + 다른 그룹)
GET /api/conversations/inbox
Response: {
  ownGroup: Conversation[],
  following: Conversation[]
}
```

**파일 구조:**

```
frontend/src/
├── app/[lang]/
│   ├── explore/              # 신규: 탐색 페이지
│   │   ├── page.tsx
│   │   └── [aidolId]/        # 다른 그룹 상세
│   │       └── page.tsx
│   └── inbox/
│       └── page.tsx          # 수정: 내 그룹 + 다른 그룹 분리
├── components/
│   ├── explore/              # 신규
│   │   ├── ExploreGrid.tsx
│   │   ├── AIdolCard.tsx
│   │   └── FollowButton.tsx
│   └── inbox/
│       ├── InboxTabs.tsx     # 신규: 내 그룹 / 팔로잉 탭
│       └── ConversationList.tsx

backend/src/
├── routes/
│   ├── aidols.ts             # 수정: explore endpoint 추가
│   └── conversations.ts      # 수정: 다른 그룹 채팅 지원
└── repositories/
    ├── AIdolRepository.ts    # 수정: explore, follow 메서드
    └── ConversationRepository.ts
```

#### 3.1.3 구현 체크리스트

**Backend:**
- [ ] `follows` 테이블 마이그레이션 작성
- [ ] `AIdolRepository.getExplore()` 구현
- [ ] `AIdolRepository.follow()` / `unfollow()` 구현
- [ ] `ConversationRepository.startWithOtherGroup()` 구현
- [ ] `GET /api/aidols/explore` 엔드포인트 구현
- [ ] `POST /api/aidols/{id}/follow` 엔드포인트 구현
- [ ] `POST /api/conversations/start` 수정 (isOwnGroup 지원)
- [ ] `GET /api/conversations/inbox` 수정 (그룹 분리)

**Frontend:**
- [ ] `ExploreGrid` 컴포넌트 구현
- [ ] `AIdolCard` 컴포넌트 구현 (프로필, 멤버 수, 팔로워 수)
- [ ] `FollowButton` 컴포넌트 구현 (팔로우/언팔로우 토글)
- [ ] `/explore` 페이지 구현
- [ ] `/explore/[aidolId]` 상세 페이지 구현
- [ ] `InboxTabs` 컴포넌트 구현 (내 그룹 / 팔로잉)
- [ ] 채팅 UI에 그룹 소유자 정보 표시

**Testing:**
- [ ] Unit: `AIdolRepository.follow()` 중복 팔로우 방지
- [ ] Unit: `ConversationRepository.startWithOtherGroup()` 검증
- [ ] Integration: 다른 그룹 팔로우 → 채팅 시작 플로우
- [ ] E2E: 홈 → 탐색 → 프로필 → 멤버 선택 → 채팅 시작
- [ ] E2E: 수신함에서 내 그룹 / 팔로잉 필터링

### 3.2 Feature: 관계성 기반 채팅 컨텍스트

#### 3.2.1 요구사항

**As a 그룹 생성자:**
- Sprint 2에서 설정한 멤버 간 관계가 채팅 대화에 자연스럽게 반영됨
- 예: A와 B가 "라이벌" 관계 → A와 채팅 시 B를 언급하면 경쟁 맥락 반영
- 예: C와 D가 "소꿉친구" → C와 채팅 시 D를 그리워하는 대화 가능

**Acceptance Criteria:**
- [ ] 멤버와 채팅 시 해당 멤버의 관계 목록 조회
- [ ] 관계성 정보가 LLM 프롬프트에 컨텍스트로 추가
- [ ] 대화 중 다른 멤버 언급 시 관계성 반영된 응답 생성
- [ ] 관계 보드에서 관계 수정 → 즉시 채팅 맥락 업데이트

#### 3.2.2 기술 구현

**Database Schema 변경:**

```sql
-- 기존: companion_relationships 테이블 (Sprint 2에서 이미 존재)
-- 변경 불필요, 조회 로직만 추가

-- relationships 조회용 뷰 (optional, 성능 최적화)
CREATE VIEW companion_relationships_view AS
SELECT
  cr.id,
  cr.companion_id_a,
  cr.companion_id_b,
  cr.relationship_type,
  cr.relationship_alias,
  ca.name AS companion_a_name,
  ca.position AS companion_a_position,
  cb.name AS companion_b_name,
  cb.position AS companion_b_position
FROM companion_relationships cr
JOIN companions ca ON cr.companion_id_a = ca.id
JOIN companions cb ON cr.companion_id_b = cb.id;
```

**API Endpoints:**

```typescript
// 멤버의 관계 목록 조회 (채팅 컨텍스트용)
GET /api/companions/{companionId}/relationships
Response: {
  relationships: [{
    relatedCompanion: {
      id: string,
      name: string,
      position: string
    },
    type: 'rival' | 'friend' | 'roommate' | 'custom',
    alias: string | null,
    description: string | null
  }]
}
```

**LLM Prompt Context 생성:**

```typescript
// backend/src/services/ChatService.ts

async function buildChatContext(
  companion: Companion,
  conversationHistory: Message[]
): Promise<string> {
  // 1. 기본 캐릭터 정보
  let context = `You are ${companion.name}, a ${companion.position} in the group ${companion.aidolGroup.name}.\n`;
  context += `MBTI: ${companion.mbti}\n`;
  context += `Biography: ${companion.biography}\n\n`;

  // 2. 관계성 정보 추가 ⭐️ 신규
  const relationships = await CompanionRepository.getRelationships(companion.id);
  if (relationships.length > 0) {
    context += `=== Your relationships with other members ===\n`;
    relationships.forEach(rel => {
      context += `- ${rel.relatedCompanion.name} (${rel.relatedCompanion.position}): `;
      context += `${rel.type}`;
      if (rel.alias) context += ` (nicknamed "${rel.alias}")`;
      if (rel.description) context += ` - ${rel.description}`;
      context += `\n`;
    });
    context += `\nWhen the user mentions these members, respond according to your relationship with them.\n\n`;
  }

  // 3. 대화 히스토리
  context += `=== Conversation history ===\n`;
  conversationHistory.forEach(msg => {
    context += `${msg.role}: ${msg.content}\n`;
  });

  return context;
}
```

**파일 구조:**

```
backend/src/
├── services/
│   ├── ChatService.ts        # 수정: buildChatContext() 관계성 추가
│   └── RelationshipService.ts # 신규: 관계성 관련 비즈니스 로직
└── repositories/
    └── CompanionRepository.ts # 수정: getRelationships() 추가
```

#### 3.2.3 구현 체크리스트

**Backend:**
- [ ] `CompanionRepository.getRelationships()` 구현
- [ ] `RelationshipService` 생성 (관계성 조회, 포맷팅)
- [ ] `ChatService.buildChatContext()` 수정 (관계성 섹션 추가)
- [ ] `GET /api/companions/{id}/relationships` 엔드포인트 구현
- [ ] LLM 프롬프트 템플릿 업데이트

**Frontend:**
- [ ] 채팅 UI에 "관계 보기" 버튼 추가 (현재 멤버의 관계 표시)
- [ ] 관계 보드 수정 시 채팅 캐시 무효화

**Testing:**
- [ ] Unit: `buildChatContext()` 관계성 포맷 검증
- [ ] Integration: 관계 설정 → 채팅 → LLM 응답에 관계성 반영 확인
- [ ] E2E: 라이벌 관계 설정 → 채팅에서 라이벌 언급 → 경쟁적 응답
- [ ] E2E: 소꿉친구 관계 → 채팅에서 친구 언급 → 친근한 응답

### 3.3 Feature: 팔로우 시스템

#### 3.3.1 요구사항

**As a 사용자:**
- 다른 그룹을 팔로우/언팔로우 가능
- 내가 팔로우한 그룹 목록 조회 가능
- 그룹의 팔로워 수 표시

**Acceptance Criteria:**
- [ ] 그룹 프로필에 "팔로우" 버튼 표시
- [ ] 팔로우 상태 토글 (팔로우 / 팔로잉)
- [ ] 내 프로필에 "팔로잉" 탭 추가
- [ ] 그룹 카드에 팔로워 수 표시

#### 3.3.2 구현 체크리스트

**Backend:**
- [ ] `follows` 테이블 이미 생성됨 (3.1.2)
- [ ] `AIdolRepository.getFollowerCount()` 구현
- [ ] `AIdolRepository.getFollowingList()` 구현

**Frontend:**
- [ ] `FollowButton` 컴포넌트 이미 구현됨 (3.1.3)
- [ ] `/profile/following` 페이지 구현
- [ ] 그룹 카드에 팔로워 수 표시

**Testing:**
- [ ] E2E: 팔로우 → 언팔로우 → 팔로잉 목록에서 제거 확인

## 4. Stage 2: 콘텐츠 생성 + 플랫폼 인프라

### 4.1 Feature: 콘텐츠 자동 생성 파이프라인

#### 4.1.1 요구사항

**As a 크리에이터:**
- AI 아이돌 그룹의 콘텐츠가 자동으로 생성됨
- 생성된 콘텐츠를 검토 후 업로드 가능
- 콘텐츠 유형: 채팅 UI 스토리, 이미지 (썸네일)

**콘텐츠 유형:**
1. **채팅 UI 스토리** (MVP)
   - 멤버 간 대화 형식
   - 예: "숙소 생활 에피소드", "연습 중 갈등", "데뷔 준비 일상"
   - LLM으로 대화 생성 → 채팅 UI로 렌더링

2. **썸네일 이미지**
   - Gemini Nanobanana API로 생성
   - 콘텐츠 주제 기반 프롬프트

#### 4.1.2 기술 구현

**Database Schema:**

```sql
-- 콘텐츠 테이블
CREATE TABLE contents (
  id VARCHAR(255) PRIMARY KEY,
  aidol_id VARCHAR(255) NOT NULL,
  creator_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'chat_ui_story' | 'image' | 'video'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  content_url VARCHAR(500), -- 채팅 UI 스토리 JSON 또는 이미지 URL
  status VARCHAR(50) DEFAULT 'draft', -- 'draft' | 'published' | 'archived'
  visibility VARCHAR(50) DEFAULT 'public', -- 'public' | 'followers_only' | 'premium'
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  INDEX idx_aidol_id (aidol_id),
  INDEX idx_creator_id (creator_id),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at)
);

-- 채팅 UI 스토리 상세 (JSON)
CREATE TABLE chat_ui_stories (
  id VARCHAR(255) PRIMARY KEY,
  content_id VARCHAR(255) NOT NULL,
  story_json JSON NOT NULL, -- { messages: [{ companionId, name, text, timestamp }] }
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

-- 콘텐츠 좋아요
CREATE TABLE content_likes (
  id VARCHAR(255) PRIMARY KEY,
  content_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (content_id, user_id),
  INDEX idx_content_id (content_id),
  INDEX idx_user_id (user_id)
);
```

**AI 생성 파이프라인:**

```typescript
// backend/src/services/ContentGenerationService.ts

interface ChatUIStory {
  title: string;
  description: string;
  messages: {
    companionId: string;
    companionName: string;
    text: string;
    timestamp: number;
  }[];
}

class ContentGenerationService {
  /**
   * 채팅 UI 스토리 자동 생성
   *
   * @param aidolId - AI 아이돌 그룹 ID
   * @param theme - 스토리 주제 (예: "숙소 생활 에피소드")
   * @returns 생성된 스토리 + 썸네일
   */
  async generateChatUIStory(
    aidolId: string,
    theme: string
  ): Promise<{ story: ChatUIStory; thumbnailUrl: string }> {
    // 1. 그룹 및 멤버 정보 조회
    const aidol = await AIdolRepository.getOne({ id: aidolId, include: ['companions'] });
    const companions = aidol.companions;

    // 2. 멤버 간 관계성 조회
    const relationships = await this.getGroupRelationships(aidolId);

    // 3. LLM 프롬프트 생성
    const prompt = this.buildStoryPrompt(companions, relationships, theme);

    // 4. LLM으로 대화 생성 (Claude 3.5 Sonnet)
    const llmResponse = await this.callLLM(prompt);
    const story = this.parseStoryFromLLM(llmResponse);

    // 5. 썸네일 생성 (Gemini Nanobanana API)
    const thumbnailPrompt = `${theme}: ${story.title}`;
    const thumbnailUrl = await this.generateThumbnail(thumbnailPrompt);

    return { story, thumbnailUrl };
  }

  private buildStoryPrompt(
    companions: Companion[],
    relationships: Relationship[],
    theme: string
  ): string {
    let prompt = `Generate a chat-style story for a K-pop idol group.\n\n`;
    prompt += `Theme: ${theme}\n\n`;

    prompt += `Members:\n`;
    companions.forEach(c => {
      prompt += `- ${c.name} (${c.position}, ${c.mbti}): ${c.biography}\n`;
    });

    prompt += `\nRelationships:\n`;
    relationships.forEach(r => {
      prompt += `- ${r.companionA.name} ↔ ${r.companionB.name}: ${r.type}`;
      if (r.alias) prompt += ` (${r.alias})`;
      prompt += `\n`;
    });

    prompt += `\nGenerate a realistic chat conversation (5-10 messages) that:\n`;
    prompt += `1. Reflects the members' personalities and relationships\n`;
    prompt += `2. Is engaging and entertaining for fans\n`;
    prompt += `3. Feels authentic to K-pop idol life\n`;
    prompt += `4. Includes some conflict, humor, or heartwarming moments\n\n`;

    prompt += `Output format (JSON):\n`;
    prompt += `{\n`;
    prompt += `  "title": "Short catchy title",\n`;
    prompt += `  "description": "One-sentence summary",\n`;
    prompt += `  "messages": [\n`;
    prompt += `    { "companionName": "Name", "text": "Message text" }\n`;
    prompt += `  ]\n`;
    prompt += `}\n`;

    return prompt;
  }

  private async callLLM(prompt: string): Promise<string> {
    // Claude 3.5 Sonnet API 호출
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content[0].text;
  }

  private async generateThumbnail(prompt: string): Promise<string> {
    // Gemini Nanobanana API 호출
    const response = await fetch('https://api.gemini.com/nanobanana/generate', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();

    // 이미지 저장 (CloudFlare R2)
    const imageUrl = await this.uploadToR2(data.imageData);
    return imageUrl;
  }
}
```

**API Endpoints:**

```typescript
// 콘텐츠 자동 생성 (크리에이터용)
POST /api/contents/generate
Body: {
  aidolId: string,
  theme: string // "숙소 생활", "연습실 에피소드", etc.
}
Response: {
  contentId: string, // draft 상태로 저장됨
  story: ChatUIStory,
  thumbnailUrl: string
}

// 콘텐츠 게시
POST /api/contents/{contentId}/publish
Body: {
  visibility: 'public' | 'followers_only' | 'premium'
}
Response: { success: boolean }

// 콘텐츠 조회 (단건)
GET /api/contents/{contentId}
Response: {
  content: Content,
  story: ChatUIStory, // type이 'chat_ui_story'인 경우
  creator: { id: string, name: string },
  aidol: AIdol
}

// 콘텐츠 목록 (홈 피드)
GET /api/contents/feed
Query: {
  page: number,
  pageSize: number,
  sort: 'popular' | 'recent' | 'trending'
}
Response: {
  contents: Content[],
  total: number,
  hasMore: boolean
}
```

#### 4.1.3 구현 체크리스트

**Backend:**
- [ ] `contents`, `chat_ui_stories`, `content_likes` 테이블 마이그레이션
- [ ] `ContentGenerationService` 클래스 생성
- [ ] `generateChatUIStory()` 구현 (LLM 호출)
- [ ] `generateThumbnail()` 구현 (Gemini API)
- [ ] `uploadToR2()` 구현 (CloudFlare R2)
- [ ] `POST /api/contents/generate` 엔드포인트
- [ ] `POST /api/contents/{id}/publish` 엔드포인트
- [ ] `GET /api/contents/{id}` 엔드포인트
- [ ] `GET /api/contents/feed` 엔드포인트

**Frontend:**
- [ ] `/create/content` 페이지 (테마 선택 → 생성 → 프리뷰)
- [ ] `ChatUIStoryViewer` 컴포넌트 (채팅 UI 렌더링)
- [ ] `ContentCard` 컴포넌트 (썸네일 + 제목 + 조회수)
- [ ] `/contents/{id}` 상세 페이지

**Testing:**
- [ ] Unit: `buildStoryPrompt()` 관계성 포함 검증
- [ ] Integration: LLM 응답 파싱 → DB 저장
- [ ] Integration: 썸네일 생성 → R2 업로드
- [ ] E2E: 콘텐츠 생성 → 프리뷰 → 게시 → 피드 노출

### 4.2 Feature: 추천 시스템 (v1)

#### 4.2.1 요구사항

**As a 소비자:**
- 홈 피드에서 인기/최신 콘텐츠 탐색 가능
- 내가 팔로우한 그룹의 콘텐츠 우선 노출

**v1 알고리즘 (간단):**
1. **인기순**: 좋아요 수 + 조회수 기반 점수
2. **최신순**: 게시 시간 기준
3. **팔로잉 우선**: 내가 팔로우한 그룹 콘텐츠 상위 노출

#### 4.2.2 기술 구현

**추천 점수 계산:**

```sql
-- 인기 점수 계산 (Trending Score)
-- Formula: (like_count * 3 + view_count * 1) / (hours_since_publish + 2)^1.5

CREATE VIEW content_trending_scores AS
SELECT
  c.id,
  c.title,
  c.aidol_id,
  c.creator_id,
  c.view_count,
  c.like_count,
  c.published_at,
  (c.like_count * 3 + c.view_count * 1) /
    POWER(TIMESTAMPDIFF(HOUR, c.published_at, NOW()) + 2, 1.5) AS trending_score
FROM contents c
WHERE c.status = 'published'
ORDER BY trending_score DESC;
```

**API 수정:**

```typescript
GET /api/contents/feed
Query: {
  page: number,
  pageSize: number,
  sort: 'popular' | 'recent' | 'trending' | 'following'
}

// 구현:
async function getFeed(userId: string, sort: string, page: number) {
  if (sort === 'following') {
    // 내가 팔로우한 그룹의 콘텐츠만
    return await db.query(`
      SELECT c.* FROM contents c
      JOIN follows f ON c.aidol_id = f.aidol_id
      WHERE f.user_id = ? AND c.status = 'published'
      ORDER BY c.published_at DESC
      LIMIT ? OFFSET ?
    `, [userId, pageSize, page * pageSize]);
  }

  if (sort === 'trending') {
    return await db.query(`
      SELECT c.*, cts.trending_score
      FROM contents c
      JOIN content_trending_scores cts ON c.id = cts.id
      ORDER BY cts.trending_score DESC
      LIMIT ? OFFSET ?
    `, [pageSize, page * pageSize]);
  }

  // ... popular, recent 구현
}
```

#### 4.2.3 구현 체크리스트

**Backend:**
- [ ] `content_trending_scores` 뷰 생성
- [ ] `GET /api/contents/feed` sort 파라미터 구현
- [ ] 팔로잉 필터링 로직 추가

**Frontend:**
- [ ] 홈 피드에 정렬 탭 추가 (트렌딩 / 최신 / 팔로잉)

**Testing:**
- [ ] Unit: Trending score 계산 검증
- [ ] E2E: 탭 전환 시 콘텐츠 목록 변경 확인

## 5. Stage 3: 수익화 + 크리에이터 도구

### 5.1 Feature: 수익 분배 시스템

#### 5.1.1 요구사항

**As a 크리에이터:**
- 내 콘텐츠의 조회수/좋아요 수 확인 가능
- 수익 발생 조건: 조회수 1,000+ 콘텐츠
- 수익 공식: 조회수 기반 + 프리미엄 구독 분배
- 수익 정산: 월 1회, 최소 $10 이상

**수익 계산 (v1):**
```
크리에이터 수익 = (조회수 * $0.001) + (프리미엄 구독 수 * $0.5)
플랫폼 수수료: 30%
크리에이터 지급: 70%
```

#### 5.1.2 기술 구현

**Database Schema:**

```sql
-- 수익 기록
CREATE TABLE creator_earnings (
  id VARCHAR(255) PRIMARY KEY,
  creator_id VARCHAR(255) NOT NULL,
  month VARCHAR(7) NOT NULL, -- 'YYYY-MM'
  total_views INT DEFAULT 0,
  total_likes INT DEFAULT 0,
  premium_subscribers INT DEFAULT 0,
  gross_revenue DECIMAL(10,2) DEFAULT 0, -- 총 수익
  platform_fee DECIMAL(10,2) DEFAULT 0, -- 플랫폼 수수료 (30%)
  net_revenue DECIMAL(10,2) DEFAULT 0, -- 순수익 (70%)
  payout_status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
  payout_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_creator_month (creator_id, month),
  INDEX idx_creator_id (creator_id),
  INDEX idx_month (month),
  INDEX idx_payout_status (payout_status)
);
```

**월별 수익 집계 (Cron Job):**

```typescript
// backend/src/jobs/EarningsCalculationJob.ts

class EarningsCalculationJob {
  /**
   * 매월 1일 자정에 실행
   * 지난 달의 수익 집계
   */
  async run() {
    const lastMonth = getLastMonth(); // 'YYYY-MM'

    // 모든 크리에이터 조회
    const creators = await db.query(`
      SELECT DISTINCT creator_id FROM contents
      WHERE status = 'published'
    `);

    for (const creator of creators) {
      await this.calculateMonthlyEarnings(creator.creator_id, lastMonth);
    }
  }

  private async calculateMonthlyEarnings(creatorId: string, month: string) {
    // 1. 지난 달 콘텐츠 조회수 합산
    const stats = await db.query(`
      SELECT
        SUM(view_count) as total_views,
        SUM(like_count) as total_likes
      FROM contents
      WHERE creator_id = ?
        AND status = 'published'
        AND DATE_FORMAT(published_at, '%Y-%m') = ?
    `, [creatorId, month]);

    const { total_views, total_likes } = stats[0];

    // 2. 프리미엄 구독자 수 (TBD: 구독 시스템 구현 후)
    const premium_subscribers = 0;

    // 3. 수익 계산
    const grossRevenue = (total_views * 0.001) + (premium_subscribers * 0.5);
    const platformFee = grossRevenue * 0.3;
    const netRevenue = grossRevenue * 0.7;

    // 4. DB 저장
    await db.query(`
      INSERT INTO creator_earnings
      (id, creator_id, month, total_views, total_likes, premium_subscribers,
       gross_revenue, platform_fee, net_revenue, payout_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      generateId(),
      creatorId,
      month,
      total_views,
      total_likes,
      premium_subscribers,
      grossRevenue,
      platformFee,
      netRevenue
    ]);

    // 5. 이메일 발송 (수익 $10 이상인 경우)
    if (netRevenue >= 10) {
      await this.sendPayoutEmail(creatorId, netRevenue);
    }
  }
}
```

**API Endpoints:**

```typescript
// 크리에이터 대시보드
GET /api/creator/dashboard
Response: {
  totalViews: number,
  totalLikes: number,
  totalContents: number,
  currentMonthEarnings: {
    grossRevenue: number,
    netRevenue: number,
    estimatedPayout: number
  },
  topContents: Content[], // 상위 5개
  recentEarnings: CreatorEarning[] // 최근 6개월
}

// 월별 수익 내역
GET /api/creator/earnings
Query: { page: number, pageSize: number }
Response: {
  earnings: CreatorEarning[],
  total: number
}
```

#### 5.1.3 구현 체크리스트

**Backend:**
- [ ] `creator_earnings` 테이블 마이그레이션
- [ ] `EarningsCalculationJob` 구현
- [ ] Cron Job 스케줄러 설정 (매월 1일 00:00)
- [ ] `GET /api/creator/dashboard` 엔드포인트
- [ ] `GET /api/creator/earnings` 엔드포인트
- [ ] Payout 이메일 템플릿 작성

**Frontend:**
- [ ] `/creator/dashboard` 페이지 구현
- [ ] 수익 차트 컴포넌트 (월별 추이)
- [ ] 인기 콘텐츠 목록 표시

**Testing:**
- [ ] Unit: `calculateMonthlyEarnings()` 수익 계산 검증
- [ ] Integration: Cron Job 실행 → DB 저장 확인
- [ ] E2E: 대시보드에서 수익 데이터 표시

### 5.2 Feature: 크리에이터 대시보드

이미 5.1.3에 포함됨.

## 6. 기술 스택 및 인프라

### 6.1 Backend

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM**: Prisma (또는 raw SQL)
- **LLM**: Claude 3.5 Sonnet (Anthropic API)
- **Image Generation**: Gemini Nanobanana API
- **Storage**: CloudFlare R2 (S3 compatible)
- **CDN**: CloudFlare
- **Cron Jobs**: node-cron

### 6.2 Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Query (server state) + Zustand (client state)

### 6.3 인프라

- **Hosting**: Vercel (Frontend) + Render/Railway (Backend)
- **Database Hosting**: PlanetScale 또는 AWS RDS
- **Storage**: CloudFlare R2
- **Monitoring**: Sentry (Error Tracking) + PostHog (Analytics)

## 7. 마이그레이션 계획

### 7.1 Phase 1 → Phase 2 데이터 마이그레이션

**필요한 마이그레이션:**

1. `conversations` 테이블에 `is_own_group`, `companion_owner_id` 컬럼 추가
2. `follows` 테이블 생성
3. `contents` 관련 테이블 생성
4. `creator_earnings` 테이블 생성

**마이그레이션 스크립트:**

```sql
-- migrations/20260301_phase2_initial.sql

-- 1. conversations 확장
ALTER TABLE conversations
ADD COLUMN is_own_group BOOLEAN DEFAULT true,
ADD COLUMN companion_owner_id VARCHAR(255),
ADD INDEX idx_companion_owner (companion_owner_id);

-- 기존 대화는 모두 is_own_group = true로 설정
UPDATE conversations SET is_own_group = true WHERE is_own_group IS NULL;

-- 2. follows 테이블
CREATE TABLE follows (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  aidol_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_follow (user_id, aidol_id),
  INDEX idx_user_id (user_id),
  INDEX idx_aidol_id (aidol_id)
);

-- 3. contents 테이블
CREATE TABLE contents (
  id VARCHAR(255) PRIMARY KEY,
  aidol_id VARCHAR(255) NOT NULL,
  creator_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  content_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'draft',
  visibility VARCHAR(50) DEFAULT 'public',
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  INDEX idx_aidol_id (aidol_id),
  INDEX idx_creator_id (creator_id),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at)
);

CREATE TABLE chat_ui_stories (
  id VARCHAR(255) PRIMARY KEY,
  content_id VARCHAR(255) NOT NULL,
  story_json JSON NOT NULL,
  FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

CREATE TABLE content_likes (
  id VARCHAR(255) PRIMARY KEY,
  content_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (content_id, user_id),
  INDEX idx_content_id (content_id),
  INDEX idx_user_id (user_id)
);

-- 4. creator_earnings 테이블
CREATE TABLE creator_earnings (
  id VARCHAR(255) PRIMARY KEY,
  creator_id VARCHAR(255) NOT NULL,
  month VARCHAR(7) NOT NULL,
  total_views INT DEFAULT 0,
  total_likes INT DEFAULT 0,
  premium_subscribers INT DEFAULT 0,
  gross_revenue DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  net_revenue DECIMAL(10,2) DEFAULT 0,
  payout_status VARCHAR(50) DEFAULT 'pending',
  payout_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_creator_month (creator_id, month),
  INDEX idx_creator_id (creator_id),
  INDEX idx_month (month),
  INDEX idx_payout_status (payout_status)
);

-- 5. Trending 점수 뷰
CREATE VIEW content_trending_scores AS
SELECT
  c.id,
  c.title,
  c.aidol_id,
  c.creator_id,
  c.view_count,
  c.like_count,
  c.published_at,
  (c.like_count * 3 + c.view_count * 1) /
    POWER(TIMESTAMPDIFF(HOUR, c.published_at, NOW()) + 2, 1.5) AS trending_score
FROM contents c
WHERE c.status = 'published'
ORDER BY trending_score DESC;
```

### 7.2 롤백 계획

Phase 2 출시 후 문제 발생 시:

```sql
-- rollback/20260301_phase2_rollback.sql

-- 1. 신규 테이블 삭제
DROP VIEW IF EXISTS content_trending_scores;
DROP TABLE IF EXISTS creator_earnings;
DROP TABLE IF EXISTS content_likes;
DROP TABLE IF EXISTS chat_ui_stories;
DROP TABLE IF EXISTS contents;
DROP TABLE IF EXISTS follows;

-- 2. conversations 컬럼 제거
ALTER TABLE conversations
DROP COLUMN is_own_group,
DROP COLUMN companion_owner_id;
```

## 8. 테스트 전략

### 8.1 Unit Tests

**Coverage 목표: 80%+**

**주요 테스트 대상:**
- `ContentGenerationService.generateChatUIStory()`
- `ContentGenerationService.buildStoryPrompt()`
- `ChatService.buildChatContext()` (관계성 포함)
- `EarningsCalculationJob.calculateMonthlyEarnings()`
- `AIdolRepository.getExplore()`, `follow()`

### 8.2 Integration Tests

**주요 시나리오:**
- 다른 그룹 팔로우 → 채팅 시작 → 관계성 반영 확인
- 콘텐츠 생성 → LLM 응답 → DB 저장 → 썸네일 업로드
- 월별 수익 계산 → 이메일 발송

### 8.3 E2E Tests (Playwright)

**Critical User Flows:**
1. **다른 그룹과 채팅:**
   - 홈 → 탐색 → 그룹 선택 → 멤버 선택 → 채팅 시작
   - 관계성 언급 시 맥락 반영 확인

2. **콘텐츠 생성 및 게시:**
   - 크리에이터 대시보드 → 콘텐츠 생성 → 테마 선택 → 프리뷰 → 게시
   - 홈 피드에 노출 확인

3. **콘텐츠 소비:**
   - 홈 피드 → 콘텐츠 클릭 → 채팅 UI 스토리 읽기 → 좋아요
   - 조회수 증가 확인

4. **크리에이터 대시보드:**
   - 대시보드 → 수익 확인 → 인기 콘텐츠 확인

### 8.4 성능 테스트

**목표:**
- API 응답 시간: p95 < 500ms
- 콘텐츠 생성 (LLM): p95 < 5초
- 썸네일 생성: p95 < 3초
- 피드 로딩: p95 < 300ms

**도구:**
- k6 (Load Testing)
- Lighthouse (Frontend Performance)

## 9. 릴리스 계획

### 9.1 Stage 1 릴리스 (Month 1-2)

**Release Date:** Month 2 End

**Features:**
- ✅ 다른 그룹 멤버와 1:1 채팅
- ✅ 관계성 기반 채팅 컨텍스트
- ✅ 팔로우 시스템

**Success Criteria:**
- 다른 그룹 채팅 시작율: 20%+
- 관계성 언급 대화: 세션당 1회+
- 팔로우 전환율: 15%+

### 9.2 Stage 2 릴리스 (Month 3-4)

**Release Date:** Month 4 End

**Features:**
- ✅ 콘텐츠 자동 생성 파이프라인
- ✅ 콘텐츠 업로드 + 게시
- ✅ 추천/트렌딩 시스템 (v1)
- ✅ 검색 기능

**Success Criteria:**
- 일평균 콘텐츠 업로드: 50+
- 콘텐츠 소비 세션: 평균 10분+
- 콘텐츠 → 채팅 전환율: 10%+

### 9.3 Stage 3 릴리스 (Month 5-6)

**Release Date:** Month 6 End

**Features:**
- ✅ 조회수/좋아요 측정
- ✅ 수익 분배 시스템
- ✅ 크리에이터 대시보드
- ✅ 구독/멤버십 시스템

**Success Criteria:**
- 크리에이터 수: 1K+
- 상위 100명 평균 수익: $100/월+
- 프리미엄 구독 전환율: 5%+

## 10. 리스크 및 대응

### 10.1 기술 리스크

| 리스크 | 확률 | 영향 | 대응 |
|-------|------|------|------|
| LLM 생성 품질 낮음 | 중 | 고 | - Phase 1에서 PoC 검증 완료<br>- 프롬프트 엔지니어링 강화<br>- 크리에이터 수동 편집 기능 제공 |
| 썸네일 생성 실패 | 중 | 중 | - Fallback: 기본 템플릿 이미지<br>- 여러 Image Gen API 병행 (DALL-E, Midjourney) |
| 관계성 반영 미흡 | 중 | 고 | - 프롬프트 템플릿 고도화<br>- Few-shot learning 예제 추가<br>- 유저 피드백 수집 + 개선 |
| 스토리지 비용 폭증 | 저 | 중 | - CloudFlare R2 사용 (저렴)<br>- 이미지 압축 최적화<br>- 오래된 콘텐츠 아카이빙 |

### 10.2 비즈니스 리스크

| 리스크 | 확률 | 영향 | 대응 |
|-------|------|------|------|
| 크리에이터 수익 낮음 | 중 | 고 | - 초기 크리에이터 인센티브 프로그램<br>- 수익 분배 비율 조정 (70% → 80%)<br>- 프리미엄 구독 도입 가속화 |
| 콘텐츠 품질 저하 | 중 | 중 | - 큐레이션 팀 운영<br>- 커뮤니티 신고 시스템<br>- AI 콘텐츠 품질 필터링 |
| 관계성 기능 미사용 | 저 | 중 | - 온보딩 튜토리얼 강화<br>- 관계성 설정 인센티브 (배지, 리워드) |

## 11. 체크리스트

### Stage 1 체크리스트 (Month 1-2)

**Backend:**
- [ ] `follows` 테이블 마이그레이션
- [ ] `conversations` 테이블 수정
- [ ] `AIdolRepository.getExplore()` 구현
- [ ] `AIdolRepository.follow()` / `unfollow()` 구현
- [ ] `CompanionRepository.getRelationships()` 구현
- [ ] `ChatService.buildChatContext()` 관계성 추가
- [ ] API 엔드포인트 구현 (explore, follow, relationships)

**Frontend:**
- [ ] `/explore` 페이지
- [ ] `/explore/[aidolId]` 상세 페이지
- [ ] `FollowButton` 컴포넌트
- [ ] `InboxTabs` (내 그룹 / 팔로잉)
- [ ] 채팅 UI에 관계성 표시

**Testing:**
- [ ] Unit Tests (80%+ coverage)
- [ ] Integration Tests (핵심 플로우)
- [ ] E2E Tests (Critical Paths)

**Deployment:**
- [ ] Staging 환경 배포
- [ ] Beta 테스트 (50명)
- [ ] Production 배포

### Stage 2 체크리스트 (Month 3-4)

**Backend:**
- [ ] `contents`, `chat_ui_stories`, `content_likes` 테이블 마이그레이션
- [ ] `ContentGenerationService` 구현
- [ ] LLM 프롬프트 템플릿 작성
- [ ] Gemini Nanobanana API 연동
- [ ] CloudFlare R2 연동
- [ ] Trending score 뷰 생성
- [ ] API 엔드포인트 구현 (generate, publish, feed)

**Frontend:**
- [ ] `/create/content` 페이지
- [ ] `ChatUIStoryViewer` 컴포넌트
- [ ] `ContentCard` 컴포넌트
- [ ] `/contents/{id}` 상세 페이지
- [ ] 홈 피드 정렬 탭

**Testing:**
- [ ] LLM 생성 품질 검증 (10개 샘플)
- [ ] 썸네일 생성 검증
- [ ] E2E: 콘텐츠 생성 → 게시 → 피드 노출

**Deployment:**
- [ ] Staging 배포 + 테스트
- [ ] Production 배포

### Stage 3 체크리스트 (Month 5-6)

**Backend:**
- [ ] `creator_earnings` 테이블 마이그레이션
- [ ] `EarningsCalculationJob` 구현
- [ ] Cron Job 스케줄러 설정
- [ ] Payout 이메일 템플릿
- [ ] API 엔드포인트 (dashboard, earnings)

**Frontend:**
- [ ] `/creator/dashboard` 페이지
- [ ] 수익 차트 컴포넌트
- [ ] 인기 콘텐츠 목록

**Testing:**
- [ ] 수익 계산 로직 검증
- [ ] Cron Job 테스트
- [ ] E2E: 대시보드 확인

**Deployment:**
- [ ] Production 배포
- [ ] 첫 수익 정산 테스트 (수동)

## 12. 다음 단계 (Phase 3)

Phase 2 완료 후 고려 사항:

1. **고도화된 추천 알고리즘** (협업 필터링)
2. **영상 콘텐츠 생성** (AI Video Gen)
3. **B2B API 라이센스**
4. **소속사 파트너십**
5. **모바일 앱** (React Native)

---

**작성일**: 2026-02-08
**작성자**: Claude Sonnet 4.5
**버전**: v1.0 (active)
**Next Review**: Stage 1 완료 시
