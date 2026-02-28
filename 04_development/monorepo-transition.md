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
| **버전 관리** | semantic version (v1.5.0) | 없음 (commit hash) |
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

### 이미 출시된 기능 (Flag ON) 수정

**시나리오:** API 변경이 필요한 경우

```
1. Backend PR #64: main에서 브랜치 생성, API 변경
2. Frontend PR #65: #64 브랜치를 base로 생성 (API 사용)
    ↓
3. #65를 #64로 merge (Frontend + Backend 함께 테스트 가능)
4. #64를 main으로 merge → 배포 (API 변경 원자적 반영)
```

**이유:** Frontend/Backend API 계약 변경을 같은 시점에 배포하여 불일치 방지

**Flag OFF 기능:** main에서 직접 PR (브랜치 체인 불필요)

---

## 업계 표준

**Trunk-Based Development 채택률 및 효과:**

- **채택률 (2023):** "Almost 80% of PRs merged in 2023 were based on 'main' or 'master' rather than a feature branch" — [Graphite](https://graphite.com/blog/stop-using-feature-branches)

- **고성능 팀 상관관계 (2021):** "Elite performers who meet their reliability targets are 2.3 times more likely to use trunk-based development" — [Google Cloud DORA Report](https://cloud.google.com/blog/products/devops-sre/the-2021-accelerate-state-of-devops-dora-report-is-here)

- **배포 시간 개선:** "PRs based on trunk branches see a nearly 10-hour reduction in PR open-to-merge time" — [Graphite](https://graphite.com/blog/stop-using-feature-branches)

---

## 핵심

Trunk-Based Development + Feature Flags = 빠른 배포 + 안정적인 출시

모노레포의 진정한 이점은 작은 배포와 빠른 피드백입니다.

---

**References:**
- [Atlassian: Trunk-based Development](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development)
- [DORA: Trunk-based development](https://dora.dev/capabilities/trunk-based-development/)
- [Google Cloud: 2021 DORA Report](https://cloud.google.com/blog/products/devops-sre/the-2021-accelerate-state-of-devops-dora-report-is-here)
- [Graphite: Stop Using Feature Branches](https://graphite.com/blog/stop-using-feature-branches)
