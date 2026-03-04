# AIdol API Specification

- 원본: [Notion](https://www.notion.so/2f046f965504805ca766fd5d0850b3e7)
- Base URL: `http://localhost:8000` (로컬)

---

## 전체 엔드포인트

| 엔드포인트                                          | 메서드 | 설명                     | 인증   | Sprint |
| --------------------------------------------------- | ------ | ------------------------ | ------ | ------ |
| `/aidols`                                           | POST   | AIdol 그룹 생성          | Cookie | 1      |
| `/aidols`                                           | GET    | 아이돌 그룹 전체 조회    | Public | 2      |
| `/me/aidols`                                        | GET    | 사용자 아이돌 그룹 조회  | Cookie | 2      |
| `/aidols/{id}`                                      | GET    | AIdol 그룹 조회          | Public | 1      |
| `/aidols/{id}`                                      | PATCH  | AIdol 그룹 수정          | Public | 1      |
| `/aidols/images`                                    | POST   | 이미지 생성 (GEMINI PRO) | Public | 1      |
| `/companions`                                       | GET    | Companion 목록 조회      | Public | 1      |
| `/companions`                                       | POST   | Companion 멤버 생성      | Public | 1      |
| `/companions/{id}`                                  | GET    | Companion 멤버 조회      | Public | 2      |
| `/companions/{id}`                                  | PATCH  | Companion 멤버 수정      | Public | 1      |
| `/companions/{id}`                                  | DELETE | Companion 멤버 삭제      | Public | 1      |
| `/companions/images`                                | POST   | 이미지 생성 (GEMINI PRO) | Public | 1      |
| `/leads`                                            | POST   | email 수집               | Public | 1      |
| `/aidol-highlights`                                 | GET    | 아이돌 하이라이트 조회   | Public | 2      |
| `/aidol-highlights/{id}/messages`                   | GET    | 하이라이트 메세지 조회   | Public | 2      |
| `/companion-relationships`                          | GET    | 아이돌 관계 조회         | Public | 2      |
| `/companion-relationships/{id}`                     | GET    | 아이돌 관계 조회         | Public | 2      |
| `/companion-relationships`                          | POST   | 아이돌 관계성 생성       | Public | 2      |
| `/companion-relationships/{id}`                     | DELETE | 아이돌 관계 삭제         | Public | 2      |
| `/chatrooms`                                        | POST   | 채팅방 생성              | Cookie | 3      |
| `/me/chatrooms`                                     | GET    | 채팅방 목록 조회         | Cookie | 3      |
| `/chatrooms/{id}`                                   | GET    | 채팅방 조회              | Public | 3      |
| `/chatrooms/{id}/messages`                          | GET    | 메시지 목록 조회         | Public | 3      |
| `/chatrooms/{id}/messages`                          | POST   | 메시지 전송              | Cookie | 3      |
| `/chatrooms/{id}/companions/{cid}/response`         | POST   | AI 응답 생성             | Public | 3      |
| `/chatrooms/{id}/companions/{cid}/initial-response` | POST   | 선 발화 AI 응답 생성     | Public | 3      |

---

## 세부 명세

List 조회 API의 `current`, `pageSize`, `sort`, `filters` 규칙은 문서 하단 `## 🔧 List Query Parameters`를 공통으로 따릅니다.

### POST /aidols - AIdol 그룹 생성

새로운 아이돌 그룹을 생성합니다. 생성된 그룹은 요청자의 쿠키 ID (anonymousId)와 연결됩니다.

- URL: POST /aidols
- Auth: 쿠키 필수 (anonymousId)

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

**Response** (201 Created):

```json
Headers: anonymousId

{
  "data": {
    "id": "string"
  }
}
```

---

### GET /aidols - 아이돌 그룹 전체 조회

생성된 모든 아이돌 그룹을 조회합니다. 페이지네이션과 필터링을 지원합니다.

Query Parameters (공통 List 규칙)

- `current`, `pageSize`, `sort`, `filters`
- 예시: `?current=1&pageSize=10&sort=[["createdAt","desc"]]&filters=[{"field":"name","operator":"contains","value":"aidol"}]`

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
      "status": "DRAFT | PUBLISHED",
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
      "status": "DRAFT | PUBLISHED",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
  ],
  "total": 2
}
```

---

### GET /me/aidols - 사용자가 만든 그룹 전체 조회

현재 사용자(쿠키 ID 기준)가 생성한 그룹만 필터링하여 조회합니다.

- URL: GET /me/aidols
- Auth: 쿠키 필수 (`aioia_anonymous_id`)

Query Parameters (공통 List 규칙)

- `current`, `pageSize`, `sort`, `filters`
- 추가 조건: 현재 사용자 소유 데이터만 조회되도록 서버에서 자동 필터링

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
      "status": "DRAFT | PUBLISHED",
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
      "status": "DRAFT | PUBLISHED",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
  ],
  "total": 2
}

```

---

### GET /aidols/{id} - AIdol 그룹 조회

특정 그룹의 상세 정보를 조회합니다.

- URL: GET /aidols/{id}
- Auth: Public

**Response** (200 OK):

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "greeting": "string",
    "concept": "string",
    "profileImageUrl": "string",
    "status": "DRAFT | PUBLISHED",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Errors**:

- `404` - AIdol 그룹 없음

---

### PATCH /aidols/{id} - AIdols 그룹 수정

그룹 생성 과정에서 정보를 업데이트 합니다.

- URL: PATCH /aidols/{id}
- Auth: 공개 (추후 소유권 검증 로직 추가 예정)

**Request**:

```json
{
  "name": "string (선택)",
  "email": "string (선택)",
  "greeting": "string (선택)",
  "concept": "string (선택)",
  "profileImageUrl": "string (선택)",
  "status": "DRAFT | PUBLISHED (선택)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}

```

**Response** (200 OK):

```json
{
  "name": "string",
  "email": "string",
  "greeting": "string",
  "concept": "string",
  "profileImageUrl": "string",
  "status": "DRAFT | PUBLISHED"
}
```

**Errors**:

- `404` - AIdol 그룹 없음

---

### POST /aidols/images - 이미지 생성

aidols 엠블럼 이미지를 생성합니다.

- URL: POST /aidols/images
- Auth: 공개

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

### GET /companions - Companion 목록 조회

멤버 목록을 조회합니다. 보통 aidolId 필터와 함께 사용하여 특정 그룹의 멤버를 조회합니다.

- URL: GET /companions
- Auth: 공개

Query Parameters (공통 List 규칙)

- `current`, `pageSize`, `sort`, `filters`
- 대표 `filters` 예시:
  - `[{"field":"aidolId","operator":"eq","value":"aidol-uuid..."}]`
  - `[{"field":"status","operator":"eq","value":"PUBLISHED"}]`

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "string",
      "aidolId": "string",
      "name": "string",
      "gender": "MALE|FEMALE",
      "grade": "A|B|C|F",
      "biography": "string",
      "profilePictureUrl": "string",
      "position": "LEADER|MAIN_VOCAL|SUB_VOCAL|...",
      "mbti": "string",
      "status": "PUBLISHED",
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

특정 그룹(aidolId)에 소속될 멤버를 생성합니다.
POST /companions는 기존 id를 받아 attach하지 않으며,
attach는 PATCH /companions/{id}로 수행됩니다.
- URL: POST /companions
- Auth: 공개

**Request**:

```json
 {
   "aidolId": "aidol-uuid"
 }
```

**Response** (201 Created):

- system_prompt는 보안상 응답에서 제외됩니다.
  
```json
{
  "data": {
    "id": "comp_1",
    "name": "Updated Name",
    "aidolId": "aidol_123",
    "gender": "FEMALE",
    "grade": "A",
    "mbti": "ENTP",
    "stats": { "vocal": 100, "dance": 90, "rap": 80, "visual": 100, "stamina": 80, "charm": 95 }
  },
  "createdAt": "2024-01-28T12:00:00Z",
  "updatedAt": "2024-01-29T15:00:00Z"
}
```

---

### GET /companions/{id} - Companion 멤버 조회

- URL: GET /companions/{id}
- Auth: 공개

**Response** (200 OK): 

```json
{
  "data": {
    "id": "comp_1",
    "aidolId": "aidol_123",
    "name": "Minji",
    "gender": "FEMALE",
    "grade": "A",
    "biography": "...",
    "profilePictureUrl": "...",
    "position": "MAIN_VOCAL",
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

### PATCH /companions/{id} - Companion 멤버 수정

연습생을 생성 과정에서 정보를 업데이트 합니다.

**Request**:

```json
{
  "aidolId": "aidol-uuid...",
  "name": "멤버 이름",
  "gender": "FEMALE",
  "grade": "A",
  "biography": "어릴 때부터...",
  "profilePictureUrl": "...",
  "position": "MAIN_VOCAL",
  "status": "PUBLISHED", // 선택사항 (기본값: DRAFT)
  "mbtiEnergy": 8,
  "mbtiPerception": 3,
  "mbtiJudgment": 7,
  "mbtiLifestyle": 2,
  "stats": {
    "vocal": 90,
    "dance": 80,
    "rap": 20,
    "visual": 85,
    "stamina": 70,
    "charm": 95
  }
}
```

**Response** (200 OK):

```json
{
  "data": {
    "id": "companion-uuid...",
    "aidolId": "...",
    "name": "멤버 이름",
    "mbti": "ESTP",
    "stats": { "vocal": 90, ... },
    "status": "PUBLISHED",
    "createdAt": "..."
  }
}
```

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
    "gender": "FEMALE",
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

### POST /companions/images - 이미지 생성

Companion 프로필 이미지를 생성합니다.

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

### POST /leads - email 수집

이메일을 입력받아 저장합니다. 만약 쿠키(anonymousId)가 있고, 해당 쿠키로 생성된 아이돌 그룹(aidol_id)이 있다면, 해당 아이돌 그룹 정보에 이메일을 연동하여 업데이트합니다.

- URL: POST /leads
- Auth: 공개 (하지만 쿠키가 있으면 연동 로직 수행)

**Request**:

```json
{
  "aidolId": "aidol-uuid-optional",  
  "email": "user@example.com"
}
```

동작 로직:
1. 요청에 aidolId가 있고, 클라이언트가 anonymousId 쿠키를 가지고 있는지 확인.
2. 해당 aidolId 그룹의 소유자(anonymousId)가 쿠키 값과 일치하는지 확인.
3. 일치한다면 -> aidols 테이블의 해당 그룹 레코드에 email 컬럼을 업데이트.
4. 일치하지 않거나 aidolId가 없다면 -> aidol_leads 테이블에 단순히 이메일 정보 저장.

**Response** (201 Created):

```json
{
  "data": {
    "email": "user@example.com"
  }
}
```

---

### GET /aidol-highlights - AIdol 하이라이트 목록 조회

AIdol 하이라이트를 조회합니다.

- URL: GET /aidol-highlights
- Auth: 공개

Query Parameters (공통 List 규칙)

- `current`, `pageSize`, `sort`, `filters`
- 대표 `filters` 예시: `[{"field":"aidolId","operator":"eq","value":"aidol-uuid..."}]`

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
      "isPremium": true,
      "createdAt": "datetime",
      "updatedAt": "datetime"
     },
    {
      "id": "string",
      "aidolId": "string",
      "title": "string",
      "thumbnailUrl": "string",
      "subtitle": "string",
      "isPremium": true,
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

**Response** (200 OK):

```json
{
  {
    "id": "string",
    "highlightId": "string",
    "companionId": "string",
    "sequence": 1,
    "content": "안녕하세요",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  {
    "id": "string",
    "highlightId": "string",
    "companionId": "string",
    "sequence": 2,
    "content": "안녕",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

### GET /companion-relationships -멤버 관계 조회

멤버 관계 정보를 조회합니다.

- URL: GET /companion-relationships

Query Parameters (공통 List 규칙)

- `current`, `pageSize`, `sort`, `filters`
- 대표 `filters` 예시:
  - A가 생각하는 관계들: `[{"field":"fromCompanionId","operator":"eq","value":"member-A-uuid"}]`
  - A를 생각하는 관계들: `[{"field":"toCompanionId","operator":"eq","value":"member-A-uuid"}]`

**Response** (200 OK):

```json
{
  "data": [
    {
	    "id": "string",
	    "fromCompanionId": "string",
	    "toCompanionId": "string",
	    "type": "string",
	    "intimacy": "number",
	    "nickname": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
		 },
    {
	    "id": "string",
	    "fromCompanionId": "string",
	    "toCompanionId": "string",
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

### GET /companion-relationships/{id} -멤버 관계 조회

멤버 관계 정보를 조회합니다.

**Response** (200 OK):

```json
{
  "data": {
    "id": "string",
    "fromCompanionId": "string",
    "toCompanionId": "string",
    "type": "string",
    "intimacy": "number",
    "nickname": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### POST /companion-relationships -멤버 관계 생성

멤버 관계를 생성 합니다.

**Sprint**: Sprint 2

**Request**:

```json
{
  "fromCompanionId": "string",
  "toCompanionId": "string",
  "intimacy": "int",
  "nickname": "string" //선택
}
```

**Response** (201 Created):

```json
{
  "data": {
	  "id": "string", 
    "fromCompanionId": "string",
    "toCompanionId": "string",
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

**Response** (204 No Content):
---

### GET /me/chatrooms - 채팅방 목록 조회

현재 참여 중인 채팅방 목록을 조회합니다.

- URL: GET /me/chatrooms
- Auth: Cookie 필수 (`aioia_anonymous_id`)

Query Parameters

- `aidolId` (optional): 그룹 필터
- `filters` (optional, JSON string): 채팅방 조건 필터
- `aioia_anonymous_id` (required, cookie): 사용자 식별자
- `current`, `pageSize`, `sort`는 지원하지 않음

- 동작 분기
  1. 항상 chatrooms.anonymous_id = cookie로 기본 범위 제한
  2. aidolId가 있으면 companions 조인 후 companions.aidol_id = aidolId 적용
  3. filters가 있으면 chatrooms 컬럼 조건을 추가 적용
  4. aidolId가 없으면 기존 동작(조인 없음)과 동일

- 주의사항
  - aidolId는 전용 파라미터입니다. filters에서 aidolId 필드로 처리하지 않습니다.
  - filters는 JSON 문자열이어야 하며, camelCase/snake_case 필드 모두 허용됩니다(내부에서 snake_case로 변환).

**Response** (200 OK):

```json
{
  "data": [
    {
      "id": "chatroom-uuid-1",
      "companionId": "companion-uuid-1",
      "lastMessage": {
        "content": "안녕하세요!",
        "createdAt": "2024-02-13T12:00:00Z"
      }
    },
    {
      "id": "chatroom-uuid-2",
      "companionId": "companion-uuid-2",
      "lastMessage": null
    }
  ]
}
```

---

### POST /chatrooms - 채팅방 생성

채팅방을 생성 합니다.

- URL: POST /chatrooms
- Auth: Cookie 필수 (anonymousId)

**Request**:

```json
{
  "companionId": "companion-uuid",
  "name": "나의 시크릿 챗",
  "language": "ko"
}
```

**Response** (201 Created):

```json
{
  "data": {
    "id": "chatroom-uuid-1234",
    "companionId": "companion-uuid",
    "name": "나의 시크릿 챗",
    "language": "ko",
    "anonymousId": "anonymous-id-from-cookie",
    "createdAt": "2024-02-09T10:00:00Z",
    "updatedAt": "2024-02-09T10:00:00Z"
  }
}
```

### GET /chatrooms/{id} - 채팅방 상세 조회

특정 채팅방 조회합니다.

- URL: GET /chatrooms/{id}
- Auth: 공개

**Response** (200 OK):

```json
{
  "data": {
    "id": "chatroom-uuid-1234",
    "name": "나의 시크릿 챗",
    ...
  }
}

```
---

### GET /chatrooms/{id}/messages - 채팅방 메시지 조회

특정 채팅방의 메시지를 조회합니다.

- URL: GET /chatrooms/{id}/messages
- Auth: 공개

Input Parameters (Query)

- limit: 한 번에 가져올 메시지 수 (기본: 100)
- offset: 건너뛸 메시지 수 (기본: 0)
- `current`, `pageSize`, `sort`, `filters`는 지원하지 않음

**Response** (200 OK):
- 시간 순서대로 정렬된 메시지 배열 반환(내림차순)
```json
[
  {
    "id": "msg-124",
    "chatroomId": "chatroom-uuid-1234",
    "senderType": "COMPANION",
    "content": "오늘 날씨가 좋아서 정말 상쾌해요! ",
    "companionId": "companion-uuid-5678", // 보낸 멤버 ID
    "createdAt": "2024-02-09T10:01:05Z"
  },
  {
    "id": "msg-123",
    "chatroomId": "chatroom-uuid-1234",
    "senderType": "USER",
    "content": "안녕, 오늘 기분 어때?",
    "createdAt": "2024-02-09T10:01:00Z"
  },
]

```

---

### POST /chatrooms/{id}/messages - 채팅방 메시지 전송

특정 채팅방에 메시지를 전송합니다.

- URL: POST /chatrooms/{id}/messages
- Auth: 쿠키 기반 인증 - 메시지를 보낸 사람을 익명 ID로 기록하기 위해 필요합니다.

**Request**:

```json
{
  "content": "안녕, 오늘 기분 어때?"
}
```

**Response** (201 Created):
```json
{
  "id": "msg-125",
  "chatroomId": "chatroom-uuid-1234",
  "senderType": "USER",
  "content": "나 오늘 좀 우울해...",
  "createdAt": "2024-02-09T10:02:00Z"
}
```
---

### POST /chatrooms/{id}/companions/{cid}/response - AI 멤버 응답 생성

채팅방(id)에 있는 사용자 메시지에 대해 특정 멤버(cid)가 대답하도록 요청합니다. 이 API는 비동기적으로 동작하지 않고, 응답이 생성될 때까지 기다렸다가(Sync) 생성된 메시지를 반환합니다.

URL: POST /chatrooms/{id}/companions/{cid}/response
- id: Chatroom ID (대화가 일어나는 방)
- cid: Companion ID (대답을 해야 하는 멤버)
- Auth: 공개

동작 원리:

1. 백엔드는 cid에 해당하는 멤버 정보를 DB에서 조회합니다.
2. 멤버의 system_prompt와 채팅방의 최근 대화 내역(History)을 조합하여 LLM에 보낼 프롬프트를 구성합니다.
3. 현재 시간(KST) 정보도 프롬프트에 포함하여 시간 감각을 부여합니다.
4. LLM(OpenAI)을 통해 답변을 생성합니다.
5. 생성된 답변을 companion 타입의 메시지로 DB에 저장합니다

**Request**:

```json
{
  body 없음
}
```

**Response** (201 Created):
```json
{
  "messageId": "msg-126",
  "content": "저런, 무슨 일 있으셨어요? 제가 옆에서 이야기 들어드릴게요. "
}
```
---
### POST /chatrooms/{id}/companions/{cid}/initial-response - 선 발화 AI 멤버 응답 생성

선 발화 메세지를 위한 API 입니다.

URL: POST /chatrooms/{id}/companions/{cid}/initial-response
- id: Chatroom ID (대화가 일어나는 방)
- cid: Companion ID (대답을 해야 하는 멤버)
- Auth: 공개

**Request**:

```json
{
  body 없음
}
```

**Response** (201 Created):
```json
{
  "messageId": "msg-126",
  "content": "안녕하세요 ..."
}
```

---

## 데이터 모델

### AIdol

```tsx
{
  id: string                        // UUID
  name: string | null               // 그룹명
  email: string | null              // 사용자 Email
  concept: string | null            // 그룹 컨셉
  greeting: string | null           // 인사 문구
  profileImageUrl: string | null    // 엠블럼 이미지 URL
  status: "DRAFT" | "PUBLISHED"     // 상태
  anonymousId: string | null         // 소유권 토큰 (응답에 미포함)
  createdAt: string                 // ISO 8601 datetime
  updatedAt: string                 // ISO 8601 datetime
}

```

### Companion

```tsx
{
  id: string                        // UUID
  aidolId: string | null            // 소속된 AIdol 그룹 ID (없으면 null)
  name: string | null               // 이름
  gender: string | null             // 성별 (Gender Enum 참고)
  grade: string | null              // 등급 (Grade Enum 참고)
  biography: string | null          // 자기소개/설정
  profilePictureUrl: string | null  // 프로필 이미지 URL
  position: string | null           // 포지션 (Position Enum 참고)
  status: string | null             // DRAFT | PUBLISHED
  mbti: string | null               // 계산된 MBTI (예: "ENTP")
  stats: {                          // 능력치 객체
    vocal: number     // 0~100 (보컬)
    dance: number     // 0~100 (댄스)
    rap: number       // 0~100 (랩)
    visual: number    // 0~100 (비주얼)
    stamina: number   // 0~100 (체력)
    charm: number     // 0~100 (매력)
  }
  createdAt: string                 // ISO 8601 datetime
  updatedAt: string                 // ISO 8601 datetime
}
```

### AIdolHighlights

```tsx
{
  id: string                       // UUID
  aidolId: string                  // 그룹 ID
  title: string                    // 제목
	thumbnailUrl: string             // 썸네일 이미지
	subtitle: string
  isPremium: boolean               // 프리미엄 여부
}
```

### HighlightMessages

```tsx
{
  id: string                        // UUID
  highlightId: string               // 하이라이트
  companionId: string               // 멤버
  sequence: number                  // 메세지 순서
  content: string                   // 메세지 내용
}

```

### CompanionRelationships

```tsx
{
  id: string                         // UUID
  fromCompanionId: string           // 멤버 1
  toCompanionId: string            // 멤버 2
  type: string                       // 관계 유형
  intimacy: number                   // 친밀도
  nickname: string | null            // 관계 별명
}
```

### Chatroom 

```tsx
{
  id: string                        // UUID
  companionId: string               // 채팅 대상 companion ID
  name: string                      // 채팅방 이름
  language: string                  // 언어 코드 (기본: "ko")
  anonymousId: string | null        // 익명 사용자 식별자
  lastMessage: {                    // 가장 최근 메시지
    content: string
    createdAt: string
  } | null
  createdAt: string                 // ISO 8601 datetime
  updatedAt: string
}

```

### Message

```tsx
{
  id: string                        // UUID
  chatroomId: string                // Chatroom FK
  senderType: "USER" | "COMPANION"  // 발신자 유형
  content: string                   // 메시지 내용
  createdAt: string                 // ISO 8601 datetime
  companionId: string | null        // 발신 멤버 ID
  anonymousId: string | null        // 사용자 ID
}

```

### ImageGenerationData

```tsx
{
  imageUrl: string                  // 생성된 이미지 URL
  width: number                     // 이미지 너비 (1024)
  height: number                    // 이미지 높이 (1024)
  format: string                    // 이미지 포맷 ("png")
}

```

---

## 🔧 List Query Parameters

적용 endpoint:

- `GET /aidols`
- `GET /me/aidols`
- `GET /companions`
- `GET /aidol-highlights`
- `GET /companion-relationships`

비적용 endpoint:

- `GET /me/chatrooms` (전용 파라미터: `aidolId`, `filters`)
- `GET /chatrooms/{id}/messages` (전용 파라미터: `limit`, `offset`)

### Pagination

- `current`: 페이지 번호 (기본: 1, ≥ 1)
- `pageSize`: 페이지당 항목 수 (기본: 10, 1-100)

### Sort

```
?sort=[["createdAt","desc"]]

```

### Filters

```
?filters=[{"field":"aidolId","operator":"eq","value":"uuid"}]

```

- `field`는 camelCase/snake_case 모두 허용되며 서버에서 내부 snake_case로 정규화됩니다.

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

### Error Codes (현재 구현 기준)

| Code                            | HTTP Status | 설명                                                          |
| ------------------------------- | ----------- | ------------------------------------------------------------- |
| `VALIDATION_ERROR`              | 422         | 요청 바디/필드 검증 실패                                      |
| `INVALID_QUERY_PARAMS`          | 400         | `sort`, `filters` 쿼리 파라미터 JSON 형식 오류                |
| `RESOURCE_NOT_FOUND`            | 404         | 요청한 리소스 없음                                            |
| `FIRST_RESPONSE_ALREADY_EXISTS` | 409         | `initial-response` API에서 이미 메시지가 존재하는 채팅방 요청 |
| `BadRequestError`               | 400         | LLM 공급자 요청 오류                                          |
| `RateLimitError`                | 429         | LLM 공급자 호출 한도 초과                                     |
| `ServiceUnavailableError`       | 503         | LLM 공급자 서비스 일시 장애                                   |
| `EXTERNAL_SERVICE_ERROR`        | 500         | 외부 서비스 연동 오류(공통 코드)                              |
| `INTERNAL_SERVER_ERROR`         | 500         | 예상치 못한 서버 오류                                         |


---

## API 문서 링크

- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI Spec**: `/openapi.json`
