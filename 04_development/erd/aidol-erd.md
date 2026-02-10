# AIdol ERD

- 원본: [Notion](https://www.notion.so/2f046f96550480168a53f9f6a9f79d0b)

---

## Entity Relationship Diagram

```mermaid
erDiagram
    aidols ||--o{ companions : "has members (casted)"
    aidols ||--o{ aidol_highlights : "owns"
    aidols ||--o{ aidol_leads : "has leads"

    aidol_highlights ||--|{ highlight_messages : "contains"
    
    companions ||--o{ highlight_messages : "sends"
    
    companions ||--o{ chatrooms : "has chatrooms"
    chatrooms ||--o{ messages : "has messages"
   
    companions ||--o{ companion_relationships : "forms (from)"
    companions ||--o{ companion_relationships : "forms (to)"


    aidols {
        string id PK
        string name
        string email "Optional"
        string greeting "인사 문구"
        string concept
        string profile_image_url
        string anonymous_id "쿠키: aioia_anonymous_id"
        datetime created_at
        datetime updated_at
    }

    companions {
        string id PK
        string aidol_id FK "NULL: 연습생 / NOT NULL: 캐스팅됨"
        string name
        string gender "Enum: male, female"
        string grade "Enum: A, B, C, F"
        string position "Enum: leader, mainVocal, etc."
        text biography
        string profile_picture_url
        text system_prompt
        int mbti_energy "1-10 (E - I)"
        int mbti_perception "1-10 (N - S)"
        int mbti_judgment "1-10 (T - F)"
        int mbti_lifestyle "1-10 (P - J)"
        int vocal "0-100"
        int dance "0-100"
        int rap "0-100"
        int visual "0-100"
        int stamina "0-100"
        int charm "0-100"
        string status "Enum: PUBLISHED, DRAFT"
        datetime created_at
        datetime updated_at
    }

    chatrooms {
        string id PK
        string companion_id FK "NOT NULL"
        string name "NOT NULL"
        string language "default: ko"
        datetime created_at
        datetime updated_at
    }

    messages {
        string id PK
        string chatroom_id FK "NOT NULL"
        string sender_type "Enum: user, companion"
        text content "NOT NULL"
        datetime created_at
        datetime updated_at
    }

    aidol_leads {
        string id PK
        string aidol_id
        string email "NOT NULL"
        datetime created_at
        datetime updated_at
    }
```

---

## 테이블 요약

| 테이블                    | 설명              | Sprint |
| ------------------------- | ----------------- | ------ |
| `aidols`                  | 아이돌 그룹       | 1      |
| `companions`              | 그룹 멤버         | 1      |
| `aidol_leads`             | Viewer 정보       | 1      |
| `idol_highlights`         | 아이돌 하이라이트 | 2      |
| `highlight_messages`      | 하이라이트 메세지 | 2      |
| `companion_relationships` | 멤버 관계 설정    | 2      |
| `chatrooms`               | 채팅방            | 3      |
| `messages`                | 메시지            | 3      |

---

## 관계

| 관계                   | 설명                       |
| ---------------------- | -------------------------- |
| aidols → companions    | 1:N (그룹당 여러 멤버)     |
| companions → chatrooms | 1:N (멤버당 여러 채팅방)   |
| chatrooms → messages   | 1:N (채팅방당 여러 메시지) |

---

## 필드 상세

### aidols

| 필드              | 타입    | 제약 | 설명                                          |
| ----------------- | ------- | ---- | --------------------------------------------- |
| id                | UUID    | PK   | 자동 생성                                     |
| name              | str     | -    | 그룹명                                        |
| email             | str     | -    | Creator 이메일                                |
| greeting          | str     | -    | 인사 문구                                     |
| concept           | str     | -    | 그룹 컨셉                                     |
| profile_image_url | str     | -    | 엠블럼 이미지                                 |
| anonymous_id      | str(36) | -    | 익명 사용자 식별자 (쿠키: aioia_anonymous_id) |

### aidol_leads

| 필드     | 타입 | 제약 | 설명          |
| -------- | ---- | ---- | ------------- |
| id       | UUID | PK   | 자동 생성     |
| aidol_id | UUID | -    | 그룹 ID       |
| email    | str  | -    | Viewer 이메일 |

### companions

| 필드                | 타입 | 제약   | 설명                |
| ------------------- | ---- | ------ | ------------------- |
| id                  | UUID | PK     | 자동 생성           |
| aidol_id            | UUID | FK, IX | aidols 참조         |
| name                | str  |        | 멤버 이름           |
| gender              | str  |        | 성별                |
| grade               | str  |        | 등급                |
| biography           | text |        | 성격 설명           |
| profile_picture_url | str  |        | 프로필 이미지       |
| system_prompt       | text |        | LLM 시스템 프롬프트 |
| mbti_energy         | int  | 1-10   | E ↔ I               |
| mbti_perception     | int  | 1-10   | S ↔ N               |
| mbti_judgment       | int  | 1-10   | T ↔ F               |
| mbti_lifestyle      | int  | 1-10   | J ↔ P               |
| vocal               | int  | 0-100  | 가창력              |
| dance               | int  | 0-100  | 댄스 실력           |
| rap                 | int  | 0-100  | 랩 실력             |
| visual              | int  | 0-100  | 비주얼              |
| stamina             | int  | 0-100  | 체력                |
| charm               | int  | 0-100  | 매력도              |
| position            | str  |        | 포지션              |

### chatrooms (Sprint 2)

| 필드         | 타입 | 제약             | 설명              |
| ------------ | ---- | ---------------- | ----------------- |
| id           | UUID | PK               | 자동 생성         |
| companion_id | UUID | FK, IX, NOT NULL | companions 참조   |
| name         | str  | NOT NULL         | 채팅방 이름       |
| language     | str  | NOT NULL         | 언어 (기본: "ko") |

### messages (Sprint 2)

| 필드        | 타입 | 제약             | 설명                  |
| ----------- | ---- | ---------------- | --------------------- |
| id          | UUID | PK               | 자동 생성             |
| chatroom_id | UUID | FK, IX, NOT NULL | chatrooms 참조        |
| sender_type | str  | NOT NULL         | "user" \| "companion" |
| content     | text | NOT NULL         | 메시지 내용           |
