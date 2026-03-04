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

**Backend (7개 위치):**
- `backend/aidol/` - services, schemas, context, providers, protocols
- `backend/fastapi_app/routers/aidol/` - API 라우터
- `backend/managers/` - repositories (database_aidol_repository.py 등)
- `backend/models/db/` - DB 모델 (aidol.py 등)

**Frontend (3개 위치):**
- `frontend/src/aidol/` - components, hooks, utils, stories
- `frontend/src/repositories/aidol/` - repositories
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

### 예시: 이미 배포된 Sprint 2 기능

**모노레포 전환 전 (현재):**
- 코드 위치: npm 패키지 `aidol@2.9.0`
- import: `from "aidol"`
- Feature Flag: `aidol_sprint2` (PostHog에서 ON/OFF)

**모노레포 전환 후:**
- 코드 위치: `backend/aidol/`, `frontend/src/aidol/`
- import: `from "@/aidol"`
- Feature Flag: 변경 없음 (`aidol_sprint2` 그대로)
- 사용자 경험: 동일

```typescript
// frontend/src/app/[lang]/(public)/aidol/aidols/[aidolId]/casting/page.tsx

import { useFeatureFlag } from "@/hooks/useFeatureFlag";

export default function CastingPage() {
  const isSprint2Enabled = useFeatureFlag("aidol_sprint2");

  return (
    <div>
      {/* 기존 UI */}
      <CastingContent />

      {/* Sprint 2 UI: Flag로 제어 (모노레포 전환 후에도 동일) */}
      {isSprint2Enabled && <BottomNavigationContainer />}
    </div>
  );
}
```

**새 기능 추가 시:**
- Flag name: `aidol_new_feature`
- 초기 상태: `false` (배포되지만 사용자에게 숨김)
- 활성화: PostHog 콘솔에서 `true`로 변경 (Sprint Review 후)

---

## 코드 마이그레이션 체크리스트

### Backend

**1. Import 경로**
```python
# Before (algorima/aidol)
from aidol.api.chatroom import create_chatroom_router
from aidol.repositories import ChatroomRepository

# After (algorima/buppy)
from fastapi_app.routers.aidol.chatroom import ...
from managers.database_chatroom_manager import DatabaseChatroomManager
```

**2. Repository → Adapter 패턴**

aidol standalone은 Repository가 DB를 직접 조작합니다. buppy에서는 데이터 모델이 다르기 때문에 **Adapter**가 aidol의 Protocol 인터페이스를 buppy의 Manager로 연결합니다.

```
aidol Protocol ←→ Adapter ←→ buppy Manager
  (인터페이스)      (브릿지)     (실제 구현)
```

```python
# Before: Repository 직접 사용
class ChatroomRepository:
    def get_my_chatrooms(self, anonymous_id):
        return db.query(DBChatroom).filter(
            DBChatroom.anonymous_id == anonymous_id  # 직접 저장된 컬럼
        ).all()

# After: Adapter가 Protocol ↔ Manager 연결
class ChatroomRepositoryAdapter(ChatroomRepositoryProtocol):
    def __init__(self, manager: DatabaseChatroomManager):
        self._manager = manager

    def get_my_chatrooms_with_last_message(self, anonymous_id):
        # buppy는 anonymous_id를 chatroom에 저장하지 않음
        # → 참여 이벤트 테이블에서 역추적
        return self._manager.get_chatrooms_by_anonymous_id_with_last_message(
            anonymous_id
        )
```

**왜 Adapter가 필요한가?**

| 항목 | aidol (standalone) | buppy (모노레포) |
|------|-------------------|-----------------|
| 참여자 모델 | 1:1 (익명 사용자 1명 + Companion 1명) | 다대다 (여러 사용자/Companion) |
| Chatroom 테이블 | `companion_id`, `anonymous_id` 직접 저장 | 저장하지 않음 |
| 조회 방식 | 테이블 직접 필터링 | 참여 이벤트(Event Sourcing) 역추적 |

Adapter는 이 차이를 숨겨서, aidol의 API 라우터가 buppy에서도 동일하게 동작하도록 합니다.

**3. DB 모델**
```python
# Before: aidol 독립 모델
from aidol.models import DBChatroom, DBAIdol, DBCompanion

# After: buppy 통합 모델
from models.db.aidol import DBAIdol, DBCompanion
from models.db.chatroom import DBChatroom  # buppy 기존 모델 재사용
```

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
// Before
const { t } = useTranslation("aidol");
t("inbox.header")

// After
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
