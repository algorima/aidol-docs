# MCP 서버 (Buppy)

Claude Code에서 Buppy 데이터에 직접 접근할 수 있게 해주는 연결 기능입니다.

## 할 수 있는 작업

| 작업 | 설명 |
|------|------|
| Companion 조회 | 전체 목록 또는 특정 Companion 정보 확인 |
| Companion 분석 | 조회한 데이터를 기반으로 통계, 패턴 분석 |
| Companion 생성 | 새로운 Companion 프로필 만들기 |

## 설정 방법

### 1단계: MCP 서버 등록

터미널에서 다음 명령어 실행:

```bash
claude mcp add --transport http buppy https://mcp.aioia.ai/api/v2/mcp
```

### 2단계: 로그인

명령어 실행 후 자동으로 브라우저가 열립니다.
Buppy 계정으로 로그인하면 연결 완료됩니다.

### 3단계: 연결 확인

Claude Code를 시작하고 다음과 같이 질문:

```
buppy MCP 서버에 연결되어 있나요?
```

연결되었다고 응답하면 사용 가능합니다.

## 사용 예시

### Companion 전체 목록 조회

```
buppy에 등록된 Companion 목록을 5개만 보여주세요.
```

**결과 예시:**
- 총 371개의 Companion이 등록되어 있습니다.
- 최근 등록된 5개: 로나, 예나, 김 등

### 특정 Companion 상세 정보

```
Companion "세별"의 상세 정보를 보여주세요.
```

**결과 예시:**
- ID: 230b6077-da76-4780-b178-4f988e9d7415
- 이름: 세별
- 소개: 안녕하세요! 저는 18살, 빛나는 별 세별입니다! ...
- 성별: FEMALE
- 포지션: MAIN_DANCER
- 상태: PUBLISHED
- 스탯: 보컬 86, 댄스 34, 랩 99, 비주얼 75

### Companion 상태별 통계

```
현재 등록된 Companion의 상태를 분석해주세요.
전체 목록을 조회해서 published와 draft 개수를 세어주세요.
```

**결과 예시:**
- 총 371개 Companion 중 published: 300개, draft: 71개
- 발행률: 80.9%

### 새 Companion 생성

```
다음 정보로 새 Companion을 생성해주세요:
- 이름: 테스트 아이돌
- 성별: FEMALE
- 상태: DRAFT
```

**결과 예시:**
- Companion '테스트 아이돌'이 생성되었습니다.
- ID: df71d08e-980a-41f3-80c2-e67990fb93d5
- 상태: DRAFT (draft 상태로 시작하며, 필요할 때 발행할 수 있습니다)

**참고:** 생성 시 필수 입력 항목은 이름입니다. 나머지는 선택사항입니다.

## 권한 및 보안

- **사용자 권한**: 기본적으로 본인이 생성한 Companion만 수정/삭제할 수 있습니다.
- **관리자(ADMIN) 권한**: ADMIN 권한이 있는 사용자는 모든 Companion에 접근하고 관리할 수 있습니다.
  - 자신의 권한 등급이 궁금하거나 ADMIN 권한이 필요한 경우, DevOps 팀에 문의해주세요.
- **감사 로그**: 보안 및 추적을 위해 모든 사용자의 Companion 조회, 생성, 수정, 삭제 활동이 기록됩니다.
