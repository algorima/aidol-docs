# AIdol 기능 명세서 - Sprint 3

> **작성일**: 2026-02-04  
> **상태**: draft  
> **버전**: v0.1  
> **작성자**: soyeon  
> **출처**: [Notion 전체 기능 명세서](https://www.notion.so/2ec46f965504805a94fbed8c0109cd91)

---

## 개요

Sprint 3는 **AI 아이돌과의 채팅 기능**을 구현합니다.  
사용자가 생성하거나 팔로우한 AI 아이돌과 1:1 대화를 나눌 수 있는 핵심 인터랙션 기능입니다.

---

## 1. 내 그룹 페이지 (MyGroup)

사용자가 생성한 AI 아이돌 그룹을 확인하고 그룹의 데뷔일 및 주요 소식을 확인한 뒤 개별 또는 그룹 채팅 화면으로 진입하는 중간 허브 페이지입니다.

### 1-1. 채팅 화면 진입

| 항목 | 내용 |
|------|------|
| **Page** | MyGroup |
| **설명** | 채팅 아이콘 + 노티 "멤버들이 할 말이 있대요!" |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=46%3A3987) |

---

## 2. 타 그룹 상세 페이지 (Home_OtherGroup)

프리셋 AI 아이돌 그룹의 정보와 소식을 확인하고, 팔로우를 통해 관계를 시작한 뒤 채팅으로 이어지는 상세 페이지입니다.

### 2-1. 채팅 화면 진입 (Follow 상태)

| 항목 | 내용 |
|------|------|
| **Page** | Home_OtherGroup, Follow |
| **설명** | 채팅 아이콘 + 노티 "멤버들이 할 말이 있대요!" |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=46%3A4150) |

### 2-2. 팔로우 (NotFollow 상태)

| 항목 | 내용 |
|------|------|
| **Page** | Home_OtherGroup, NotFollow |
| **설명** | 팔로우로 Switch |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=46%3A4102) |

---

## 3. 수신함 페이지 (Inbox)

팔로우하거나 사용자가 생성한 AI 아이돌로부터 수신된 메시지 목록을 표시하고, 각 항목을 통해 개별 채팅 화면으로 진입하는 수신함 페이지입니다.

### 3-1. 채팅 목록 확인

| 항목 | 내용 |
|------|------|
| **Page** | Inbox |
| **설명** | 첫 채팅 멤버는 랜덤하게 설정 |
| **lastMessage 표시** | 여러 줄 메시지(`\n`, `\n\n`)는 줄바꿈을 공백으로 대체하여 한 줄로 연결 표시 (예: "안녕 오늘 뭐 해? 나 심심한데") |
| **텍스트 넘침 처리** | 목록 아이템에서 lastMessage 텍스트가 영역을 초과할 경우 말줄임표(`...`)로 잘라서 표시 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A1664) |

### 3-2. 대화 제한 안내 모달

아직 대화가 열리지 않은 아이돌에 대해, 현재는 제한 상태임을 알리고 '곧 대화가 가능해질 것'이라는 기대를 전달하는 안내 모달입니다.

| 항목 | 내용 |
|------|------|
| **Page** | Inbox, Modal |
| **설명** | - 아직 채팅이 열리지 않은 아이돌을 탭했을 때 노출되는 안내 모달<br>- 제목: "이 멤버와의 대화는 곧 열릴 예정이에요"<br>- 본문: 현재는 대화가 제한되어 있으나, 추후 업데이트로 대화가 가능해질 것이라는 메시지 전달<br>- 버튼: `확인` 1개로 모달 닫기 |
| **기능 명세** | - 트리거: Inbox에서 `대화 제한 상태`로 표시된 멤버/카드를 탭할 경우 모달 표시<br>- 사용자가 `확인` 버튼을 누르면 모달이 닫히고, 채팅 화면으로는 이동하지 않음<br>- 모달 바깥 영역(배경)을 탭해도 닫힘(채팅 화면 진입 없음)<br>- 동일 멤버에 대해 제한 상태가 유지되는 동안은 매번 동일 모달 노출 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A1802) |

---

## 4. 채팅 화면 (Chat)

AI 아이돌과의 1:1 채팅을 통해 메시지를 주고받는 대화 화면입니다.

### 4-1. 채팅 진입

| 항목 | 내용 |
|------|------|
| **Page** | Chat |
| **설명** | - 단일 멤버 대화<br>- 한 명의 멤버와만 대화 가능 (멤버 간 맥락 공유 없음)<br>- 한국 시간 기준<br>- 멤버들은 같은 시간대를 살고 있음 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A2110) |

### 4-2. 첫 메시지 발신자에 따른 UI

| 항목 | 내용 |
|------|------|
| **Chat_First_Member** | 멤버(AI 아이돌)가 먼저 메시지를 보낸 상태의 화면 |
| **Chat_First_User** | 사용자가 먼저 메시지를 보낸 상태의 화면 |
| **Figma 링크** | [Chat_First_Member](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=46%3A3907), [Chat_First_User](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A1927) |

### 4-3. 로딩 상태 (Chat_Roading)

| 항목 | 내용 |
|------|------|
| **설명** | AI 아이돌이 응답을 생성하는 동안 표시되는 로딩 상태 |
| **기능 명세** | - 로딩 인디케이터 또는 "입력 중..." 표시<br>- 사용자는 로딩 중에도 추가 메시지 입력 가능 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A2190) |

### 4-4. 작성 중 상태 (Chat_Writing)

| 항목 | 내용 |
|------|------|
| **설명** | 사용자가 메시지를 입력하고 있는 상태 |
| **기능 명세** | - 텍스트 입력 필드 활성화<br>- 전송 버튼 활성화 조건: 텍스트 입력 시 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A2113) |

### 4-5. 에러 처리

| 항목 | 내용 |
|------|------|
| **Chat_Error_User** | 사용자 측 에러 (네트워크 오류, 메시지 전송 실패 등) |
| **Chat_Error_Member** | 멤버(AI) 측 에러 (응답 생성 실패 등) |
| **기능 명세** | - 에러 발생 시 사용자에게 안내 메시지 표시<br>- "다시 시도" 버튼 제공<br>- 에러 유형에 따른 적절한 안내 문구 |
| **Figma 링크** | [Chat_Error_User](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A2044), [Chat_Error_Member](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A1980) |

### 4-6. 메시지 렌더링 규칙

| 항목 | 내용 |
|------|------|
| **UX 의도** | 인간 채팅처럼 자연스러운 대화 흐름 구현 |
| **줄바꿈 처리** | - `\n`: 말풍선 내부 줄바꿈으로 렌더링<br>- `\n\n`: 별도 말풍선(단락)으로 분리 렌더링 |
| **단락 수 제한** | - `\n\n` 기준 단락이 3개 초과 시, 3번째 단락에 이후 내용을 공백으로 연결하여 합쳐서 표시<br>- AI 응답 1회당 최대 3개 말풍선까지만 분리 노출 |
| **채팅 목록 lastMessage** | 여러 줄 메시지는 줄바꿈(`\n`, `\n\n`)을 공백으로 대체하여 한 줄로 연결 표시 |
