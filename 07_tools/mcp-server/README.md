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

Claude Code에서 다음 명령어 실행:

```
/mcp add buppy https://buppy-mcp-220027313772.us-central1.run.app/api/v2/mcp --oauth2 dynamic
```

### 2단계: 로그인

처음 사용 시 브라우저가 열리고 Buppy 로그인 화면이 나타납니다.
로그인하면 자동으로 연결됩니다.

### 3단계: 연결 확인

```
/mcp
```

`buppy: connected` 상태면 사용 준비 완료입니다.

## 사용 예시

### Companion 전체 목록 조회

```
buppy에 등록된 모든 Companion 목록을 보여주세요.
```

### 특정 Companion 상세 정보

```
Companion ID가 "abc123"인 프로필의 상세 정보를 보여주세요.
```

### Companion 현황 분석

```
현재 등록된 Companion의 상태별 통계를 분석해주세요.
- 총 개수
- published/draft 비율
- 최근 일주일 생성된 수
```

### 새 Companion 생성

```
다음 정보로 새 Companion을 생성해주세요:
- 이름: 테스트 아이돌
- 상태: draft
```

## 권한

- 본인이 생성한 Companion만 수정/삭제 가능
- ADMIN 권한이 있으면 모든 Companion 접근 가능
- 모든 작업은 기록됩니다
