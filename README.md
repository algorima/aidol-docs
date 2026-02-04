# AIdol Docs

AIdol 프로젝트 문서 저장소입니다.

## 📁 폴더 구조

```
aidol-docs/
├── 01_research/          # 사용자 리서치, 시장 분석
├── 02_planning/          # PRD, 기능 명세서
├── 03_design/            # 브랜딩, UI 컴포넌트
├── 04_development/       # API 스펙, ERD, 아키텍처
├── 05_ai-llm/            # 프롬프트, 실험 결과
├── 06_ir-master/         # IR 자료 (투자 관련)
└── templates/            # 문서 템플릿
```

## 📝 파일명 규칙

```
YYYYMMDD__주제__상태__vX.Y__소유자.md
```

### 구성 요소

| 요소 | 설명 | 예시 |
|------|------|------|
| `YYYYMMDD` | 생성일 | `20260204` |
| `주제` | 문서 주제 (kebab-case) | `user-interview-kpop-fans` |
| `상태` | draft → review → final | `draft` |
| `vX.Y` | 버전 | `v0.1`, `v1.0` |
| `소유자` | 작성자 이니셜 | `sy`, `yw`, `je`, `jh`, `jp` |

### 예시

- `20260204__user-interview-kpop-fans__final__v1.0__sy.md`
- `20260130__chat-api-spec__review__v0.3__yw.md`
- `20260201__brand-guidelines__draft__v0.1__je.md`

## 👥 소유자 코드

| 코드 | 이름 |
|------|------|
| `sy` | 소연 (Soyeon) |
| `yw` | 영욱 (Youngwook) |
| `je` | 은재 (Eunjae) |
| `jh` | 제형 (Jehyung) |
| `jp` | 지윤 (JYP) |
| `jy` | 지영 (Jiyoung) |

## 🔗 관련 저장소

- [algorima/aidol](https://github.com/algorima/aidol) - 메인 코드
- [algorima/docs](https://github.com/algorima/docs) - Company Handbook (비공개)
