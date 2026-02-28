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

## 권장 패턴: Trunk-Based Development

### 원칙
> "Main 브랜치는 항상 배포 가능 상태"

### 구현
1. **main에서 short-lived 브랜치 (2일 이내)**
2. **작은 커밋, 자주 merge (일일)**
3. **Feature Flag로 코드/출시 분리**
   - 배포: 즉시 (Flag OFF)
   - 출시: 비즈니스 결정 (Flag ON)
4. **문제 시: Flag OFF로 즉시 복구**

### 모니터링된 기능 수정 예시
```
Backend PR #64 (main에서, API 변경)
    ↓
Frontend PR #65 (→ #64 브랜치)
    ↓
#65 → #64 merge (Atomic)
    ↓
#64 → main merge → 배포 (Flag OFF)
    ↓
Sprint Review → Flag ON (출시)
```

---

## develop 브랜치 (미권장)

### 문제점
- **불일치 해결 못함**: Backend/Frontend 따로 merge → 불일치 발생
- **배포 지연**: 2주 축적 → 한 번에 배포 (큰 배포)
- **복잡한 롤백**: Feature A~J 전체 또는 부분 롤백 필요
- **DB 마이그레이션 순서 불명확**: 데이터 손상 위험
- **버그 수정 비용**: 2주 뒤 배포 → 코드 분석 필요 (2배 이상 시간)

---

## 업계 표준

**Trunk-Based Development 채택률:**
- 2023: 80% of PRs
- 고성능 팀: 2.3배 더 많이 사용
- 배포 시간: trunk 기반 10시간 빠름

**주요 기업:** Google, Meta, Netflix, Amazon, Shopify

---

## 핵심

Trunk-Based Development + Feature Flags = 빠른 배포 + 안정적인 출시

**모노레포의 진정한 이점은 develop이 아니라 작은 배포와 빠른 피드백입니다.**

---

**References:**
- [Atlassian: Trunk-based Development](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development)
- [DORA: Trunk-based development](https://dora.dev/capabilities/trunk-based-development/)
