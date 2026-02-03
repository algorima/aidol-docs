# AIdol Documentation

AIdol 프로젝트의 제품 문서 저장소입니다.

## 📁 폴더 구조

```
aidol-docs/
├── README.md                    # 이 파일
├── 20260115__aidol-prd__*.md   # PRD (Product Requirements Document)
├── aidol-feature-spec.md        # 기능명세서
├── aidol-api-spec.md            # API Spec
├── aidol-erd.md                 # ERD (데이터베이스 설계)
└── ir-master/                   # IR/지원서 마스터 문서
    ├── README.md
    ├── 00-company-overview.md   # 회사 개요
    ├── 01-problem.md            # 문제 정의
    ├── 02-solution.md           # 솔루션
    ├── 03-traction.md           # 트랙션/성과
    ├── 04-market.md             # 시장 분석
    ├── 05-business-model.md     # 비즈니스 모델
    ├── 06-team.md               # 팀 소개
    ├── 07-financials.md         # 재무 계획
    ├── 08-ask.md                # 투자 요청
    └── mappings/                # 지원서별 매핑 가이드
        ├── yc-mapping.md        # YC 지원서
        └── 초창패-mapping.md    # 초기창업패키지
```

---

## 🚀 빠른 시작 (기획자/디자이너용)

Git이 처음이라면 이 가이드를 따라주세요!

### 1. 필수 준비

```bash
# Git 설치 확인
git --version

# GitHub CLI 설치 (Mac)
brew install gh

# GitHub 로그인
gh auth login
```

### 2. 레포 클론 (최초 1회)

```bash
cd ~/Documents  # 원하는 폴더로 이동
git clone https://github.com/algorima/aidol-docs.git
cd aidol-docs
```

### 3. 문서 수정하기

**⚠️ 중요: 절대 main 브랜치에서 직접 수정하지 마세요!**

```bash
# 1) 최신 상태 받기
git checkout main
git pull origin main

# 2) 새 브랜치 만들기 (이름 규칙: docs/작업내용)
git checkout -b docs/update-prd

# 3) 파일 수정 (VS Code, Typora 등 아무 에디터로)

# 4) 수정한 파일 확인
git status

# 5) 변경사항 저장 (커밋)
git add .
git commit -m "docs(prd): Sprint 3 범위 업데이트"

# 6) GitHub에 올리기
git push origin docs/update-prd

# 7) PR 생성
gh pr create --title "docs(prd): Sprint 3 범위 업데이트" --body "## 변경 내용
- PRD Sprint 3 범위 추가
- 일정 업데이트"
```

### 4. PR 리뷰 후 머지

- GitHub에서 PR 확인
- 팀원 리뷰 받기
- Approve 후 Merge

---

## 📝 커밋 메시지 규칙

[aidol 메인 레포](https://github.com/algorima/aidol)와 동일한 형식을 사용합니다.

```
type(scope): 설명
```

### Type (타입)

| 타입 | 설명 | 예시 |
|------|------|------|
| `docs` | 문서 수정 | 대부분의 경우 이걸 사용 |
| `feat` | 새 기능/문서 추가 | 새 문서 파일 생성 |
| `fix` | 오류 수정 | 오타, 잘못된 정보 수정 |
| `chore` | 기타 작업 | 파일 정리, 폴더 구조 변경 |

### Scope (범위)

| 스코프 | 설명 |
|--------|------|
| `prd` | PRD 문서 |
| `spec` | 기능명세서, API Spec |
| `ir` | IR/지원서 관련 |
| `readme` | README 파일 |

### 예시

```bash
# PRD 업데이트
git commit -m "docs(prd): Phase 2 범위 추가"

# IR 문서 수정
git commit -m "docs(ir): 팀 소개 업데이트"

# 새 문서 추가
git commit -m "feat(spec): Sprint 3 기능명세서 추가"

# 오타 수정
git commit -m "fix(prd): 오타 수정"
```

---

## 🔀 PR 제목 규칙

커밋 메시지와 동일한 형식:

```
docs(prd): Sprint 3 범위 업데이트
feat(ir): 사업계획서 초안 작성
fix(spec): API 엔드포인트 수정
```

### PR 본문 템플릿

```markdown
## 변경 내용
- 변경사항 1
- 변경사항 2

## 관련 이슈
- 노션 링크 또는 관련 문서

## 체크리스트
- [ ] 맞춤법 검사 완료
- [ ] 팀원 리뷰 요청
```

---

## 📚 문서별 안내

### PRD (Product Requirements Document)
- 파일: `20260115__aidol-prd__*.md`
- 제품 요구사항 정의
- Phase별 기능 범위

### 기능명세서
- 파일: `aidol-feature-spec.md`
- 화면별 상세 기능
- Sprint별 구현 범위

### IR 마스터 문서
- 폴더: `ir-master/`
- 투자/지원서용 콘텐츠 원본
- 각 지원서는 매핑 파일 참고해서 복붙

---

## 🔗 관련 링크

| 구분 | 링크 |
|------|------|
| 메인 코드 | [algorima/aidol](https://github.com/algorima/aidol) |
| 노션 (프로젝트) | [AGENT](https://www.notion.so/AGENT-2e846f9655048074920ee749d5cccb85) |
| 서비스 | [aioia.ai](https://aioia.ai) |

---

## ❓ 자주 묻는 질문

### Q: Git 명령어가 어려워요
A: VS Code의 Source Control 탭이나 GitHub Desktop 앱을 사용해도 됩니다!

### Q: 브랜치 이름을 잘못 만들었어요
```bash
git branch -m 새이름  # 현재 브랜치 이름 변경
```

### Q: 커밋을 잘못했어요
```bash
git commit --amend -m "새 메시지"  # 직전 커밋 메시지 수정
```

### Q: main에서 실수로 커밋했어요
```bash
# 커밋을 새 브랜치로 옮기기
git branch 새브랜치이름
git reset --hard origin/main
git checkout 새브랜치이름
```

### Q: 충돌(conflict)이 났어요
1. 충돌 파일 열기
2. `<<<<<<<`, `=======`, `>>>>>>>` 부분 찾기
3. 원하는 내용으로 수정
4. `git add .` → `git commit`

도움이 필요하면 개발팀에 문의하세요! 🙌

---

## 📅 업데이트 이력

| 날짜 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-03 | README 가이드 작성, IR 마스터 문서 추가 | AI Assistant |
| 2026-01-15 | 초기 문서 구조 생성 | 김영욱 |
