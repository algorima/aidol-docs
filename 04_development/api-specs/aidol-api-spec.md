# AIdol API Specification

- 원본: [Notion](https://www.notion.so/2f046f965504805ca766fd5d0850b3e7)
- Base URL: `http://localhost:8000` (로컬)

---

## 전체 엔드포인트

| 엔드포인트                        | 메서드 | 설명                     | 인증   | Sprint |
| --------------------------------- | ------ | ------------------------ | ------ | ------ |
| `/aidols`                         | POST   | AIdol 그룹 생성          | Public | 1      |
| `/companions`                     | GET    | Companion 목록 조회      | Public | 1      |
| `/companions`                     | POST   | Companion 멤버 생성      | Public | 1      |
| `/companions/{id}`                | PATCH  | Companion 멤버 수정      | Public | 1      |
| `/companions/images`              | POST   | 이미지 생성 (GEMINI PRO) | Public | 1      |
| `/companions/{id}`                | DELETE | Companion 멤버 삭제      | Public | 1      |
| `/companions/{id}`                | GET    | Companion 멤버 조회      | Public | -      |
| `/aidols/images`                  | POST   | 이미지 생성 (GEMINI PRO) | Public | 1      |
| `/aidols/{id}`                    | GET    | AIdol 그룹 조회          | Public | 1      |
| `/aidols/{id}`                    | PATCH  | AIdol 그룹 수정          | Public | 1      |
| `/leads`                          | POST   | email 수집               | Public | 1      |
| `/aidols`                         | GET    | 사용자 아이돌 그룹 조회  | Public | 2      |
| `/aidol-highlights`               | GET    | 아이돌 하이라이트 조회   | Public | 2      |
| `/aidol-highlights/{id}/messages` | GET    | 하이라이트 메세지 조회   | Public | 2      |
| `/companion-relationships/{id}`   | GET    | 아이돌 관계 조회         | Public | 2      |
| `/companion-relationships`        | GET    | 아이돌 관계 조회         | Public | 2      |
| `/companion-relationships`        | POST   | 아이돌 관계성 생성       | Public | 2      |
| `/companion-relationships/{id}`   | DELETE | 아이돌 관계 삭제         | Public | 2      |
| `/chatrooms`                      | POST   | 채팅방 생성              | Public | 3      |
| `/chatrooms/{id}`                 | GET    | 채팅방 조회              | Public | 3      |
| `/chatrooms/{id}/messages`        | GET    | 메시지 목록 조회         | Public | 3      |
| `/chatrooms/{id}/messages`        | POST   | 메시지 전송              | Public | 3      |
| `/chatrooms/{id}/response`        | POST   | AI 응답 생성             | Public | 3      |

---

## 세부 명세

### POST /aidols - AIdol 그룹 생성

새로운 AIdol 그룹을 생성합니다.

빈 그룹을 생성하고 토큰을 발급합니다.

**Headers:** 

**Request**:

```json
{
  "name": "string (선택)",
  "email": "string (선택)",
  "greeting": "string (선택)",
  "concept": "string (선택)",
  "profileImageUrl": "string (선택)",
  "claimToken": "string (필수, 클라이언트 생성 UUID)"
}
```

**Response** (201 Created):

```json
Headers: ClaimToken

{
  "data": {
    "id": "string"
  }
}
```

---

### GET /companions - Companion 목록 조회

AIdol 그룹에 속한 멤버 목록을 조회합니다.

**Sprint**: Sprint 1

**Query Parameters**:

| 파라미터  | 타입   | 기본값 | 설명                  |
| --------- | ------ | ------ | --------------------- |
| `gender`  | str    | -      | male                  | female |
| `isCast`  | bool   | -      | 캐스팅 여부           |
| `aidolId` | string | -      | 특정 그룹 ID로 필터링 |

**예시** (남성 연습생 조회):

```
GET /companions?gender=male&isCast=false
```

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "string",
      "aidolId": "string",
      "name": "string",
      "gender": "male|female",
      "grade": "A|B|C|F",
      "biography": "string",
      "profilePictureUrl": "string",
      "position": "leader|mainVocal|subVocal|...",
      "mbti": "string",
      "stats": {
        "vocal": 0,
        "dance": 0,
        "rap": 0,
        "visual": 0,
        "stamina": 0,
        "charm": 0
      },
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "total": 0
}
```

**Errors**:

- `400` - 잘못된 쿼리 파라미터 형식

---

### POST /companions - Companion 멤버 생성

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
  "data": {
    "id": "comp_1",
    "name": "Updated Name",
    "aidolId": "aidol_123",
    "gender": "female",
    "grade": "S",
    "mbti": "ENTP",
    "stats": { "vocal": 100, "dance": 90, "rap": 80, "visual": 100, "stamina": 80, "charm": 95 }
  },
  "createdAt": "2024-01-28T12:00:00Z",
  "updatedAt": "2024-01-29T15:00:00Z"
}
```

---

### PATCH /companions - Companion 멤버 수정

연습생을 생성 과정에서 정보를 업데이트 합니다.

**Sprint**: Sprint 1

**Request**:

```json
{
  "aidolId": "string (선택)",
  "name": "string (선택)",
  "gender": "male|female (선택)",
  "grade": "A|B|C|F (선택)",
  "biography": "string (선택)",
  "profilePictureUrl": "string (선택)",
  "position": "leader|mainVocal|... (선택)",
  "mbtiEnergy": 1-10 (선택)",
  "mbtiPerception": 1-10 (선택)",
  "mbtiJudgment": 1-10 (선택)",
  "mbtiLifestyle": 1-10 (선택)",
  "stats": {
    "vocal": 0,
    "dance": 0,
    "rap": 0,
    "visual": 0,
    "stamina": 0,
    "charm": 0
  },
  "systemPrompt": "string (선택, 민감 정보)"
}
```

**Response** (200 OK):

```json
{
  "data": {
    "id": "comp_1",
    "name": "Updated Name",
    "aidolId": "aidol_123",
    "gender": "female",
    "grade": "S",
    "mbti": "ENTP",
    "stats": { "vocal": 100, "dance": 90, "rap": 80, "visual": 100, "stamina": 80, "charm": 95 }
  },
  "createdAt": "2024-01-28T12:00:00Z",
  "updatedAt": "2024-01-29T15:00:00Z"
}
```

---

### POST /companions/images - 이미지 생성

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
    "imageUrl": "string",
    "width": 1024,
    "height": 1024,
    "format": "png"
  }
}
```

**Errors**:

- `422` - prompt 길이 초과 (max 200자)
- `500` - 이미지 생성 실패
- 

---

### GET /companions/{id} - Companion 멤버 조회

**Sprint**: Sprint 1

**Request:** `id`

**Response** (200 OK): 

```json
{
  "data": {
    "id": "comp_1",
    "aidolId": "aidol_123",
    "name": "Minji",
    "gender": "female",
    "grade": "S",
    "biography": "...",
    "profilePictureUrl": "...",
    "position": "leader",
    "mbti": "ENTP",
    "stats": { "vocal": 100, "dance": 90, "rap": 80, "visual": 100, "stamina": 80, "charm": 95 }
  },
  "createdAt": "2024-01-28T12:00:00Z",
  "updatedAt": "2024-01-28T12:00:00Z"
}
```

**Errors**:

- `404` - Companion 없음

---

### DELETE /companions/{id} - Companion 멤버 삭제

• **설명:** 컴패니언을 그룹에서 제거합니다 (`aidolId`를 null로 설정). 컴패니언 데이터 자체가 삭제되지는 않습니다.

**Sprint**: Sprint 1

**Request:** `id`

**Response** (200 OK): 

```json
{
  "data": {
    "id": "comp_1",
    "aidolId": null,
    "name": "Minji",
    "gender": "female",
    "grade": "S",
    "mbti": "ENTP",
    "stats": { "vocal": 100, "dance": 90, "rap": 80, "visual": 100, "stamina": 80, "charm": 95 }
  },
  "createdAt": "2024-01-28T12:00:00Z",
  "updatedAt": "2024-01-29T15:00:00Z"
}
```

**Errors**:

- `404` - Companion 없음

---

### PATCH /aidols- Aidols 그룹 수정

그룹 생성 과정에서 정보를 업데이트 합니다.

**Sprint**: Sprint 1

**Request**:

```json
{
  "name": "string (선택)",
  "email": "string (선택)",
  "greeting": "string (선택)",
  "concept": "string (선택)",
  "profileImageUrl": "string (선택)"
}

```

**Response** (200 OK):

```json
{
  "name": "string (선택)",
  "email": "string (선택)",
  "greeting": "string (선택)",
  "concept": "string (선택)",
  "profileImageUrl": "string (선택)"
}
```

**Errors**:

- `404` - AIdol 그룹 없음

---

### POST /aidols/images - 이미지 생성

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
    "imageUrl": "string",
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

### GET /aidols/{id} - AIdol 그룹 조회

AIdol 그룹 정보를 조회합니다.

**Sprint**: Sprint 1

**Response** (200 OK):

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "greeting": "string",
    "concept": "string",
    "profileImageUrl": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Errors**:

- `404` - AIdol 그룹 없음

---

### POST /leads - email 수집

**Sprint**: Sprint 1
• **설명:** 사용자의 이메일을 수집합니다.

**Headers:**

`claimToken` : `string` (선택 - 유효한 토큰일 경우, 해당 아이돌 그룹과 이메일을 연동합니다)

**Request**:

```json
{
	"aidolId": "string",
  "email": "123@gmail.com" 
}
```

**Response** (201 Created):

```json
{
  "data": {
    "email": "string"
  }
}
```

Note: 
헤더의 `claimToken`이 유효하고 생성된 그룹이 있다면 해당 그룹의 이메일로 저장되며, 그렇지 않은 경우 잠재 고객(Leads) 으로 저장됩니다.

---

### 12-1. GET /aidols -사용자가 만든 그룹 전체 조회

그룹 전체 조회

필터 파라미터

**Sprint**: Sprint 2

**Response** (200 OK):

```json
{
  "data": [
    {
	    "id": "string",
	    "name": "string",
	    "email": "string",
	    "concept": "string",
	    "greeting": "string",
	    "profileImageUrl": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
    {
	    "id": "string",
	    "name": "string",
	    "email": "string",
	    "concept": "string",
	    "greeting": "string",
	    "profileImageUrl": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
  ],
  "total": 2
}
```

---

### GET /aidols/my -사용자가 만든 그룹 전체 조회

사용자가 만든 그룹 전체 조회

쿠키 기반 조회

**Sprint**: Sprint 2

**Response** (200 OK):

```json
{
  "data": [
    {
	    "id": "string",
	    "name": "string",
	    "email": "string",
	    "concept": "string",
	    "greeting": "string",
	    "profileImageUrl": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
    {
	    "id": "string",
	    "name": "string",
	    "email": "string",
	    "concept": "string",
	    "greeting": "string",
	    "profileImageUrl": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
  ],
  "total": 2
}

```

---

### GET /aidol-highlights - AIdol 하이라이트 목록 조회

AIdol 하이라이트를 조회합니다.

필터 파라미터

**Sprint**: Sprint 2

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "string",
      "aidolId": "string",
      "title": "string",
      "thumbnailUrl": "string",
      "subtitle": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
     },
    {
      "id": "string",
      "aidolId": "string",
      "title": "string",
      "thumbnailUrl": "string",
      "subtitle": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
     }
  ],
  "total": 2
}
```

---

### GET /aidol-highlights/{id}/messages - 하이라이트 메세지 조회

하이라이트 ID로 하이라이트 메세지를 조회합니다.

**Sprint**: Sprint 2

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "string",
      "highlightId": "string",
      "companionId": "string",
      "sequence": "1",
      "content": "안녕하세요",
      "createdAt": "datetime",
      "updatedAt": "datetime"
     },
	   {
		  "id": "string",
		  "highlightId": "string",
		  "companionId": "string",
		  "sequence": "2",
		  "content": "안녕",
		  "createdAt": "datetime",
		  "updatedAt": "datetime"
     }
  ],
  "total": 2
}
```

---

### GET /companion-relationships/{id} -멤버 관계 조회

멤버 관계 정보를 조회합니다.

**Sprint**: Sprint 2

**Response** (200 OK):

```json
{
  "data": {
    "id": "string",
    "from_companion_id": "string",
    "to_companion_id": "string",
    "type": "string",
    "intimacy": "number",
    "nickname": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### GET /companion-relationships -멤버 관계 조회

멤버 관계 정보를 조회합니다.

필터 파라미터 

**Sprint**: Sprint 2

**Response** (200 OK):

```json
{
  "data": [
    {
	    "id": "string",
	    "from_companion_id": "string",
	    "to_companion_id": "string",
	    "type": "string",
	    "intimacy": "number",
	    "nickname": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
    {
	    "id": "string",
	    "from_companion_id": "string",
	    "to_companion_id": "string",
	    "type": "string",
	    "intimacy": "number",
	    "nickname": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
  ],
  "total": 2
}

```

---

### POST /companion-relationships -멤버 관계 생성

멤버 관계를 생성 합니다.

**Sprint**: Sprint 2

**Request**:

```json
{
  "from_companion_id": "string",
  "to_companion_id": "string",
  "type": "string",
  "intimacy": "int",
  "nickname": "string" //선택
}
```

**Response** (201 Created):

```json
{
  "data": {
	  "id": "string" 
    "from_companion_id": "string",
    "to_companion_id": "string",
    "type": "string",
    "intimacy": "int",
    "nickname": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### DELETE /companion-relationships/{id} -멤버 관계 삭제

멤버 관계를 삭제 합니다.

**Sprint**: Sprint 2

**Response** (200 OK):

```json
{
  "data": {
  	"id": "string" 
    "from_companion_id": "string",
    "to_companion_id": "string",
    "email": "string",
    "type": "string",
    "intimacy": "string",
    "nickname": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

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

| 연산자                   | 설명             |
| ------------------------ | ---------------- |
| `eq`, `ne`               | 같음 / 같지 않음 |
| `in`                     | 배열 포함        |
| `contains`               | 문자열 포함      |
| `gt`, `gte`, `lt`, `lte` | 비교             |
| `or`, `and`              | 조건 결합        |

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

| Code                      | HTTP Status | 설명                  |
| ------------------------- | ----------- | --------------------- |
| `VALIDATION_ERROR`        | 422         | 입력 필드 검증 실패   |
| `MISSING_REQUIRED_FIELD`  | 422         | 필수 필드 누락        |
| `RESOURCE_NOT_FOUND`      | 404         | 요청한 리소스 없음    |
| `IMAGE_GENERATION_FAILED` | 500         | 이미지 생성 실패      |
| `LLM_RESPONSE_FAILED`     | 500         | LLM 응답 생성 실패    |
| `EXTERNAL_SERVICE_ERROR`  | 500         | 외부 서비스 오류      |
| `INTERNAL_SERVER_ERROR`   | 500         | 예상치 못한 서버 오류 |

---

## API 문서 링크

- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI Spec**: `/openapi.json`
