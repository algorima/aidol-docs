# Claude Code 에이전트

Claude Code에서 사용할 수 있는 커스텀 에이전트 모음입니다.

## 설치 방법

1. 원하는 에이전트 파일(`.md`)을 복사
2. `~/.claude/agents/` 폴더에 붙여넣기 (폴더가 없으면 생성)

```bash
# agents 폴더 생성 (레포지토리 루트에서 실행)
mkdir -p ~/.claude/agents

# 에이전트 파일 복사
cp 07_tools/claude-agents/stt-analyzer.md ~/.claude/agents/
```

3. Claude Code 재시작 또는 새 세션 시작

## 사용 방법

프롬프트에서 에이전트를 명시하면 자동으로 호출됩니다.

**예시:**
```
stt-analyzer 에이전트로 "회의록.txt"에서 결정 사항과 Action Items를 추출해 주세요.
```

## 에이전트 목록

| 에이전트 | 설명 | 모델 |
|----------|------|------|
| stt-analyzer | STT 녹취록 분석 (오류 식별, 회의 구조화) | haiku |

## 에이전트 파일 형식

```markdown
---
name: agent-name
description: 에이전트 설명
tools: Bash, Grep, Glob
model: haiku
---

# 역할
에이전트의 역할과 지침...
```

### 필드 설명

- `name`: 에이전트 호출 시 사용하는 이름
- `description`: 에이전트 설명 (Task tool에서 표시)
- `tools`: 사용 가능한 도구 목록
- `model`: 사용할 모델 (haiku, sonnet, opus)
