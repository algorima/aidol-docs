# aidol 모노레포 전환 가이드

## 개요

aidol을 buppy 모노레포로 통합합니다. 개발 워크플로우 및 배포 전략이 변경되며, **독립 패키지 분리 유지 비용을 없애고 타입 안전성을 확보**합니다.

---

## 왜 모노레포로 전환하는가?

### 현황: 멀티레포의 한계

aidol은 독립 레포지토리(`~/aidol`)에서 npm 패키지(`aidol`) 및 PyPI 패키지(`py-aidol`)로 배포되어 왔습니다. 기능 개발이 안정화된 Sprint 3 이후, 두 레포지토리를 분리해서 유지하는 비용이 높아집니다:

- **배포 지연**: aidol 변경 → 패키지 빌드/배포 → 버전 업그레이드 → 재배포 (최소 2단계)
- **타입 불안정**: npm 패키지(`ApiService` - standalone용)와 buppy(`ClientApiService` - monorepo용)의 메서드 시그니처가 맞지 않아도 런타임까지 숨겨짐
- **개발 체험 저하**: 기능 히스토리를 이해하려면 `~/aidol` ↔ `~/buppy` 두 레포를 오가야 함

### 선택: 모노레포 통합

**경로 변환 + 히스토리 보존 병합**
```
git filter-repo로 경로 변환 (backend/aidol/ → backend/aidol/, frontend/src/ → frontend/src/aidol/)
  ↓
원본 PR 번호 보존 (#N → aioiahq/aidol#N)
  ↓
최종 구조에 없는 파일은 히스토리에서도 제거 (models/, repositories/, containers/)
  ↓
--allow-unrelated-histories로 buppy에 병합
```

**모듈 경계 자동화**
- Backend: `tach check` (make 타겟)
- Frontend: `npm run lint` (eslint-plugin-boundaries)

### 효과

| 항목 | Before | After |
|------|--------|-------|
| **배포** | 2단계 (패키지 빌드 → 버전 업) | 1단계 (PR merge = 배포) |
| **타입 안전성** | 런타임 충돌 가능 | TS 빌드 시점에 감지 |
| **의존성 버전** | semantic version (v1.5.0) | commit hash (자동) |
| **출시 제어** | 패키지 버전 선택 | Feature Flag (PostHog) |
| **히스토리** | 두 레포 분산 | 단일 레포에서 추적 가능 |

**주의**: `aidol` npm 패키지 / `py-aidol` PyPI 패키지는 더 이상 관리되지 않습니다. buppy 내부 모듈로 대체되었습니다.

---

## Phase 2: 워크플로우 변경

### Before (멀티레포)
```
Backend PR #64 → algorima/aidol merge
    ↓ (며칠 후)
Frontend PR #65 → algorima/aidol merge
    ↓
(buppy 팀이 버전 업그레이드 필요)
```

### After (모노레포)
```
Backend + Frontend (같은 PR) → algorima/buppy merge → CI/CD 검증 → 배포
```

---

## aidol 개발자 변화

| 구분 | Before | After |
|------|--------|-------|
| **작업 레포** | algorima/aidol | algorima/buppy |
| **작업 폴더** | 프로젝트 루트 | 아래 상세 참조 |
| **import 경로** | `from "@/components"` | `from "@/aidol/components"` |
| **배포** | buppy 팀 버전 업그레이드 기다림 | PR merge = CI/CD 검증 후 배포 |
| **버전 관리** | semantic version (v1.5.0) | buppy commit hash만 (버전 없음) |
| **출시 제어** | 버전 선택 | Feature Flag |

### 작업 위치 상세

**Backend (4개 위치):**
- `backend/aidol/` - services, schemas, context, providers, protocols
- `backend/fastapi_app/routers/aidol/` - API 라우터
- `backend/managers/` - repositories (database_aidol_repository.py 등)
- `backend/models/db/` - DB 모델 (aidol.py 등)

**Frontend (3개 위치):**
- `frontend/src/aidol/` - components, hooks, utils, stories, repositories
- `frontend/src/containers/aidol/` - containers (Layer-First)
- `frontend/src/app/[lang]/(public)/aidol/` - pages

---

## Trunk-Based Development

### 원칙
> "In trunk-based development the main branch is assumed to always be stable, without issues, and ready to deploy."
>
> (Trunk-based development에서는 main 브랜치가 항상 안정적이고, 문제가 없으며, 배포할 준비가 되어있다고 가정합니다.)
>
> — Atlassian

### 구현
1. **main에서 short-lived 브랜치 (2일 이내)**
2. **작은 커밋, 자주 merge (일일)**
3. **Feature Flag로 코드/출시 분리**
   - 배포: 즉시 (Flag OFF)
   - 출시: 비즈니스 결정 (Flag ON)
4. **문제 시: Flag OFF로 즉시 복구**

### 이미 출시된 기능 (Flag ON) 수정: Frontend/Backend 함께 배포

API 계약이 변경되면 Frontend/Backend를 같은 시점에 배포해야 불일치가 없습니다.

```
Backend 브랜치에서 API 변경
    ↓
Frontend 브랜치는 Backend 브랜치를 base로 설정하여 생성
    ↓
둘 다 같은 commit으로 main에 merge → 배포
```

### 새 기능 (Flag OFF): Frontend/Backend 분리 가능

main에서 직접 PR (브랜치 체인 불필요)

---

## Feature Flag 설정

새 기능은 항상 Flag OFF로 배포하고, Sprint Review 후 PostHog 콘솔에서 ON합니다.

- Flag name: `aidol_<feature_name>`
- 초기 상태: `false` (배포되지만 사용자에게 숨김)
- 활성화: PostHog 콘솔에서 `true`로 변경

```typescript
// frontend/src/app/[lang]/(public)/aidol/.../page.tsx

import { useFeatureFlagEnabled } from "posthog-js/react";

export default function SomePage() {
  const isEnabled = useFeatureFlagEnabled("aidol_<feature_name>");

  return (
    <div>
      {isEnabled && <NewFeatureComponent />}
    </div>
  );
}
```

---

## 코드 마이그레이션 체크리스트

### Backend

**Adapter 패턴**

aidol과 buppy는 데이터 모델이 다릅니다. Protocol이 모듈 경계를 정의하고, Adapter가 그 경계를 넘는 브릿지 역할을 합니다.

```
aidol Protocol ←→ Adapter ←→ buppy Manager
  (모듈 경계)      (브릿지)     (실제 구현)
```

**데이터 모델 차이:**

| 항목 | aidol (standalone) | buppy |
|------|-------------------|-------|
| 참여자 모델 | 1:1 (익명 사용자 1명 + Companion 1명) | 다대다 (여러 사용자/Companion) |
| Chatroom 테이블 | `companion_id`, `anonymous_id` 직접 저장 | 저장하지 않음 |
| 조회 방식 | 테이블 직접 필터링 | 참여 이벤트(Event Sourcing) 역추적 |

### Frontend

**1. Import 경로**
```tsx
// Before (algorima/aidol)
import { Header } from "@/components/Header";
import type { Companion } from "@/schemas/companion";

// After (algorima/buppy)
import { Header } from "@/aidol/components/Header";
import type { Companion } from "@/aidol/schemas/companion";
```

**2. API Service 초기화**
```tsx
// Before: 전역 싱글톤
const repo = useMemo(() => new Repository(getApiService()), []);

// After: Hook + prefix
const apiService = useApiService({ apiPrefix: "/api/v2/aidol" });
const repo = useMemo(() => new Repository(apiService), [apiService]);
```

**3. 라우팅**
```tsx
// Before
router.push(`/${lang}/aidols/${id}/detail`);

// After: /aidol/ prefix 추가
router.push(`/${lang}/aidol/aidols/${id}/detail`);
```

**4. i18n**
```tsx
// Before: useTranslation("aidol")이 기본 namespace를 설정
const { t } = useTranslation("aidol");
t("inbox.header")

// After: 모든 키에 명시적 prefix
const { t } = useTranslation();
t("aidol:inbox.header")
```

---

## 모듈 경계

### aidol은 독립된 모듈

```
금지: aidol이 buppy 코드 import
❌ import { UserRepository } from "@/repositories/user";
❌ import { ChatService } from "@/services/chat";

허용: aidol 내부 코드만
✅ import { HighlightService } from "@/aidol/services/highlight";
✅ import { CompanionRepository } from "@/aidol/repositories/companion";
```

---

## 핵심

모노레포 = Trunk-Based Development + Feature Flags + 모듈 경계

작은 배포, 빠른 피드백, 독립된 아키텍처

---

**References:**
- [Atlassian: Trunk-based Development](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development)
- [DORA: Trunk-based development](https://dora.dev/capabilities/trunk-based-development/)
- [Google Cloud: Accelerate State of DevOps](https://cloud.google.com/resources/state-of-devops)
- [Graphite: Stop Using Feature Branches](https://graphite.com/blog/stop-using-feature-branches)
