# aidol 모노레포 전환 가이드

## 개요

aidol을 buppy 모노레포로 통합. 개발 워크플로우 및 배포 전략이 변경됩니다.

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
Backend + Frontend (같은 PR) → algorima/buppy merge → 즉시 배포
```

---

## aidol 개발자 변화

| 구분 | Before | After |
|------|--------|-------|
| **작업 레포** | algorima/aidol | algorima/buppy |
| **작업 폴더** | 프로젝트 루트 | frontend/src/aidol/, backend/aidol/ |
| **배포** | buppy 팀 버전 업그레이드 기다림 | PR merge = 즉시 배포 |
| **버전 관리** | semantic version (v1.5.0) | buppy commit hash만 (버전 없음) |
| **출시 제어** | 버전 선택 | Feature Flag |

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

### API 변경이 필요한 경우 (Frontend/Backend 함께 배포)

Frontend/Backend API 계약 변경을 같은 시점에 배포해야 불일치가 없습니다.

```
Backend 브랜치에서 API 변경
    ↓
Frontend 브랜치는 해당 Backend 브랜치를 기반으로 생성
    ↓
둘 다 같은 commit으로 main에 merge → 배포
```

**Flag OFF 기능:** main에서 직접 PR (Frontend/Backend 분리 가능)

---

## Feature Flag 설정

### 예시: Sprint 2 기능

```typescript
// frontend/src/app/[lang]/(public)/aidol/aidols/[aidolId]/casting/page.tsx

import { useFeatureFlag } from "@/hooks/useFeatureFlag";

export default function CastingPage() {
  const isSprint2Enabled = useFeatureFlag("aidol_sprint2");

  return (
    <div>
      {/* 기존 UI */}
      <CastingContent />

      {/* Sprint 2 UI: Flag로 제어 */}
      {isSprint2Enabled && <BottomNavigationContainer />}
    </div>
  );
}
```

**설정:**
- Flag name: `aidol_sprint2`
- 초기 상태: `false` (배포되지만 사용자에게 숨김)
- 활성화: PostHog 콘솔에서 `true`로 변경 (Sprint Review 후)

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
