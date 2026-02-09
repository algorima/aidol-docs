# AIdol API Specification

- 원본: [Notion](https://www.notion.so/2f046f965504805ca766fd5d0850b3e7)
- Base URL: `http://localhost:8000` (로컬)

---

## 전체 엔드포인트

| 엔드포인트 | 메서드 | 설명 | 인증 | Sprint |
|-----------|--------|------|------|--------|
| `/aidols` | POST | AIdol 그룹 생성 | 토큰 발급 시점 | 1 |
| `/companions` | GET | Companion 목록 조회 | 토큰 필요 | 1 |
| `/companions` | POST | Companion 멤버 생성 | 토큰 필요 | 1 |
| `/companions/{id}` | PATCH | Companion 멤버 수정 | 토큰 필요 | 1 |
| `/companions/images` | POST | 이미지 생성 (GEMINI PRO) | 토큰 필요 | 1 |
| `/companions/{id}` | DELETE | Companion 멤버 삭제 | 토큰 필요 | 1 |
| `/companions/{id}` | GET | Companion 멤버 조회 | 토큰 필요 | - |
| `/aidols/images` | POST | 이미지 생성 (GEMINI PRO) | 토큰 필요 | 1 |
| `/aidols/{id}` | GET | AIdol 그룹 조회 | 토큰 필요 | 1 |
| `/aidols/{id}` | PATCH | AIdol 그룹 수정 | 토큰 필요 | 1 |
| `/leads` | POST | email 수집 | 선택 | 1 |
| `/chatrooms` | POST | 채팅방 생성 | 토큰 필요 | - |
| `/chatrooms/{id}` | GET | 채팅방 조회 | 토큰 필요 | - |
| `/chatrooms/{id}/messages` | GET | 메시지 목록 조회 | 토큰 필요 | - |
| `/chatrooms/{id}/messages` | POST | 메시지 전송 | 토큰 필요 | - |
| `/chatrooms/{id}/response` | POST | AI 응답 생성 | 토큰 필요 | - |

---

## 세부 명세

### 1. POST /aidols - AIdol 그룹 생성

새로운 AIdol 그룹을 생성합니다. 빈 그룹을 생성하고 토큰을 발급합니다.

**Sprint**: Sprint 1

**Headers:** `aioia_anonymous_id`: Optional

**Request**:
```json
{}
```

**Response** (201 Created):
```json
Headers: aioia_anonymous_id

body:
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 2. GET /companions - Companion 목록 조회

AIdol 그룹에 속한 멤버 목록을 조회합니다.

**Sprint**: Sprint 1

**Query Parameters**:

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `gender` | str | - | male \| female |
| `isCast` | bool | - | 캐스팅 여부 |

**예시** (남성 연습생 조회):
```
GET /companions?gender=male&isCast=false
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "companionUuid",
      "aidolId": "aidolUuid",
      "name": "유나",
      "biography": "밝고 긍정적인 성격의 메인보컬",
      "grade": "A",
      "gender": "male",
      "profilePictureUrl": "https://..."
    }
  ],
  "total": 5
}
```

**Errors**:
- `400` - 잘못된 쿼리 파라미터 형식

---

### 3. POST /companions - Companion 멤버 생성

빈 연습생을 생성 및 연습생을 선점합니다.

**Sprint**: Sprint 1

**Request**:
```json
// 새로운 연습생
{
  "aidolId": "aidol-uuid"
}

// 기존에 생성된 연습생
{
  "id": "companion-uuid",
  "aidolId": "aidol-uuid"
}
```

**Response** (201 Created):
```json
{
  "id": "companion-uuid",
  "aidolId": "aidol-uuid"
}
```

---

### 4. PATCH /companions - Companion 멤버 수정

연습생을 생성 과정에서 정보를 업데이트 합니다.

**Sprint**: Sprint 1

**Request**:
```json
{
  "id": "companion-uuid",
  "aidolId": "aidol-uuid",
  "gender": "male",
  "mbtiEnergy": 1,
  "mbtiPerception": 3,
  "mbtiJudgment": 2,
  "mbtiLifestyle": 3
}
```

**Response** (200 OK):
```json
{
  "id": "companion-uuid",
  "aidolId": "aidol-uuid",
  "gender": "male",
  "mbtiEnergy": 1,
  "mbtiPerception": 3,
  "mbtiJudgment": 2,
  "mbtiLifestyle": 3
}
```

---

### 5. POST /companions/images - 이미지 생성

Companion 프로필 이미지를 생성합니다.

**Sprint**: Sprint 1

**Request**:
```json
{
  "prompt": "긴 검은 머리, 큰 눈, 밝은 미소를 가진 20대 한국 여성 아이돌"
}
```

**Response** (201 Created):
```json
{
  "data": {
    "imageUrl": "https://storage.googleapis.com/buppy/aidol-profile-pictures/uuid.png",
    "width": 1024,
    "height": 1024,
    "format": "png"
  }
}
```

**Errors**:
- `422` - prompt 길이 초과 (max 200자)
- `500` - 이미지 생성 실패

---

### 6. GET /companions/{id} - Companion 멤버 조회

**Sprint**: Sprint 1

**Request:** `id`

**Response** (200 OK):
```json
{
  "id": "companion-uuid",
  "aidolId": "aidol-uuid",
  "name": "유나",
  "biography": "밝고 긍정적인 성격의 메인보컬",
  "grade": "A",
  "gender": "male",
  "mbti": "ISTP",
  "profilePictureUrl": "https://...",
  "stats": {
    "vocal": 0,
    "dance": 0,
    "rap": 0,
    "visual": 0,
    "stamina": 0,
    "charm": 0
  },
  "position": "leader"
}
```

**Errors**:
- `404` - Companion 없음

---

### 7. DELETE /companions/{id} - Companion 멤버 삭제

**Sprint**: Sprint 1

**Request:** `id`

**Response** (200 OK):
```json
{
  "id": "companion-uuid",
  "aidolId": "aidol-uuid",
  "name": "유나",
  "biography": "밝고 긍정적인 성격의 메인보컬",
  "grade": "A",
  "gender": "male",
  "mbti": "ISTP",
  "profilePictureUrl": "https://...",
  "stats": {
    "vocal": 0,
    "dance": 0,
    "rap": 0,
    "visual": 0,
    "stamina": 0,
    "charm": 0
  },
  "position": "leader"
}
```

**Errors**:
- `404` - Companion 없음

---

### 8. PATCH /aidols - AIdols 그룹 수정

그룹 생성 과정에서 정보를 업데이트 합니다.

**Sprint**: Sprint 1

**Request**:
```json
{
  "id": "aidol-uuid",
  "name": "드리머즈"
}
```

**Response** (200 OK):
```json
{
  "id": "aidol-uuid",
  "name": "드리머즈"
}
```

**Errors**:
- `404` - AIdol 그룹 없음

---

### 9. POST /aidols/images - 이미지 생성

aidols 엠블럼 이미지를 생성합니다.

**Sprint**: Sprint 1

**Request**:
```json
{
  "prompt": "5인 그룹 검정색 배경 엠블럼.."
}
```

**Response** (201 Created):
```json
{
  "data": {
    "imageUrl": "https://storage.googleapis.com/buppy/aidol-profile-pictures/uuid.png",
    "width": 1024,
    "height": 1024,
    "format": "png"
  }
}
```

**Errors**:
- `422` - prompt 길이 초과 (max 200자)
- `500` - 이미지 생성 실패

---

### 10. GET /aidols/{id} - AIdol 그룹 조회

AIdol 그룹 정보를 조회합니다.

**Sprint**: Sprint 1

**Response** (200 OK):
```json
{
  "id": "aidol-uuid",
  "name": "스타라이트",
  "profileImageUrl": "https://..."
}
```

**Errors**:
- `404` - AIdol 그룹 없음

---

### 11. POST /leads - email 수집

**Sprint**: Sprint 1

**Headers:** `aioia_anonymous_id`: Optional

**Request**:
```json
{
  "email": "123@gmail.com"
}
```

**Response** (201 Created):
```json
{
  "email": "123@gmail.com"
}
```

> **Note**: 헤더의 `aioia_anonymous_id`이 유효하고 생성된 그룹이 있다면 해당 그룹의 이메일로 저장되며, 그렇지 않은 경우 잠재 고객(Leads)으로 저장됩니다.

---

## 데이터 모델

### AIdol

```typescript
{
  id: string                        // UUID
  name: string | null               // 그룹명
  email: string | null              // 사용자 Email
  concept: string | null            // 그룹 컨셉
  greeting: string | null           // 인사 문구
  profileImageUrl: string | null    // 엠블럼 이미지 URL
  anonymousId: string | null        // 익명 사용자 식별자 (쿠키: aioia_anonymous_id, 응답에 미포함)
  createdAt: string                 // ISO 8601 datetime
  updatedAt: string
}
```

### Companion

```typescript
{
  id: string                   // UUID (Primary Key)
  aidolId: string | null       // 소속 그룹 ID (Foreign Key)
  name: string | null          // 멤버 이름
  gender: string | null        // 성별 (male / female)
  grade: string | null         // 등급 (A, B, C, F 등)
  biography: string | null     // 멤버 성격 및 서사 설명
  profilePictureUrl: string | null  // 프로필 이미지 URL
  systemPrompt: string | null       // LLM 시스템 프롬프트
  mbti: string | null               // MBTI

  // 능력치 (Stats)
  stats: {
    vocal: number | null
    dance: number | null
    rap: number | null
    visual: number | null
    stamina: number | null
    charm: number | null
  }

  position: string | null      // 포지션 (leader, main_vocal 등)
  createdAt: string            // ISO 8601 datetime
  updatedAt: string            // ISO 8601 datetime
}
```

### Chatroom

```typescript
{
  id: string                        // UUID
  companionProfileId: string        // Companion FK
  name: string                      // 채팅방 이름
  language: string                  // 언어 코드 (기본: "ko")
  createdAt: string                 // ISO 8601 datetime
  updatedAt: string
}
```

### Message

```typescript
{
  id: string                        // UUID
  chatroomId: string                // Chatroom FK
  senderType: "user" | "companion"  // 발신자 유형
  content: string                   // 메시지 내용
  createdAt: string                 // ISO 8601 datetime
}
```

### ImageGenerationData

```typescript
{
  imageUrl: string                  // 생성된 이미지 URL
  width: number                     // 이미지 너비 (1024)
  height: number                    // 이미지 높이 (1024)
  format: string                    // 이미지 포맷 ("png")
}
```

---

## Query Parameters

### Pagination

- `current`: 페이지 번호 (기본: 1, >= 1)
- `pageSize`: 페이지당 항목 수 (기본: 10, 1-100)

### Sort

```
?sort=[["createdAt","desc"]]
```

### Filters

```
?filters=[{"field":"aidolId","operator":"eq","value":"uuid"}]
```

| 연산자 | 설명 |
|-------|------|
| `eq`, `ne` | 같음 / 같지 않음 |
| `in` | 배열 포함 |
| `contains` | 문자열 포함 |
| `gt`, `gte`, `lt`, `lte` | 비교 |
| `or`, `and` | 조건 결합 |

---

## 에러 응답

모든 에러는 다음 형식을 따릅니다:

```json
{
  "status": 422,
  "detail": "사용자 친화적 메시지",
  "code": "ERROR_CODE"
}
```

### Error Codes

| Code | HTTP Status | 설명 |
|------|-------------|------|
| `VALIDATION_ERROR` | 422 | 입력 필드 검증 실패 |
| `MISSING_REQUIRED_FIELD` | 422 | 필수 필드 누락 |
| `RESOURCE_NOT_FOUND` | 404 | 요청한 리소스 없음 |
| `IMAGE_GENERATION_FAILED` | 500 | 이미지 생성 실패 |
| `LLM_RESPONSE_FAILED` | 500 | LLM 응답 생성 실패 |
| `EXTERNAL_SERVICE_ERROR` | 500 | 외부 서비스 오류 |
| `INTERNAL_SERVER_ERROR` | 500 | 예상치 못한 서버 오류 |

---

## API 문서 링크

- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI Spec**: `/openapi.json`
