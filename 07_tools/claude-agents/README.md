# Claude Code 에이전트

Claude Code에서 사용할 수 있는 커스텀 에이전트 모음입니다.

## 설치 방법

1. 원하는 에이전트 파일(`.md`)을 복사
2. `~/.claude/agents/` 폴더에 붙여넣기 (폴더가 없으면 생성)

```bash
# agents 폴더 생성 (최초 1회)
mkdir -p ~/.claude/agents

# 에이전트 파일 복사
cp stt-analyzer.md ~/.claude/agents/
```

3. Claude Code 재시작 또는 새 세션 시작

## 사용 방법

Task tool에서 `subagent_type`으로 에이전트 이름을 지정하면 자동으로 호출됩니다.

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
