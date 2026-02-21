# AIdol 기능 명세서 - Sprint 1

> **작성일**: 2026-02-04  
> **상태**: draft  
> **버전**: v0.2  
> **작성자**: soyeon  
> **출처**: [GitHub algorima/aidol](https://github.com/algorima/aidol) 코드 기반

---

## 개요

Sprint 1은 서비스의 핵심 플로우인 **AI 아이돌 그룹 생성**을 구현합니다.  
사용자가 연습생을 캐스팅하고, 신규 멤버를 생성하고, 포지션을 배정하여 그룹을 완성하는 전체 여정을 포함합니다.

---

## 1. 랜딩 페이지 (HeroSection)

서비스 첫 진입 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `frontend/src/components/landing/HeroSection.tsx` |
| **구성 요소** | - 로고 이미지<br>- 타이틀 (i18n: `landing.hero.title.line1`, `line2`)<br>- 서브 텍스트 4줄 (i18n: `landing.hero.line1~4`)<br>- 간판 아이돌 영상 (autoPlay, loop, muted)<br>- CTA 버튼 (i18n: `landing.hero.cta`) |
| **동작** | CTA 버튼 클릭 → `onGetStarted` 콜백 실행 → 캐스팅 페이지 이동 |

---

## 2. 캐스팅 페이지 (casting)

연습생을 선발하는 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `frontend/src/app/[lang]/aidols/[aidolId]/casting/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/casting` |

### 2-1. 헤더

| 항목 | 내용 |
|------|------|
| **구성** | - 타이틀 (i18n: `casting.title`)<br>- 우측: "멤버 추가" 버튼 + 아이콘 |

### 2-2. 성별 필터 탭

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `GenderFilterTabs` |
| **탭 종류** | `boy` (남성) / `girl` (여성) / `mixed` (전체) |
| **기본값** | `boy` |
| **동작** | 탭 선택 시 해당 성별 연습생만 API 필터링하여 표시 |

### 2-3. 연습생 카드 그리드

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `CastingCardGrid` |
| **API 호출** | `CompanionRepository.getList({ filters: [gender], pagination: { pageSize: 100 } })` |
| **표시 정보** | 프로필 사진, 이름, 등급 (A/B/C/F) |

### 2-4. 연습생 상세 프로필 팝업

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `Modal` + `ProfileContent` |
| **트리거** | 연습생 카드 클릭 |
| **표시 정보** | 프로필 사진, 이름, 등급, MBTI, 능력치 차트, 서사(biography) |
| **능력치 항목** | vocal, dance, rap, visual, stamina, charm (6개) |
| **CTA 버튼** | i18n: `casting.castButton` → 캐스팅 완료 페이지 이동 |

---

## 3. 신규 멤버 추가 (companions)

5단계로 구성된 멤버 생성 플로우입니다.

| 항목 | 내용 |
|------|------|
| **URL 패턴** | `/{lang}/aidols/{aidolId}/companions/{companionId}/{step}` |
| **레이아웃** | `CompanionCreateLayout` (진행 바 표시) |

### Step 1: 성별 선택 (gender)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `companions/[companionId]/gender/page.tsx` |
| **컴포넌트** | `GenderSelector` |
| **선택지** | `male` / `female` |
| **저장** | `CompanionRepository.update({ gender })` |

### Step 2: 성격 설정 - MBTI (personality)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `companions/[companionId]/personality/page.tsx` |
| **컴포넌트** | `MbtiForm` + `MbtiSlider` |
| **슬라이더 4개** | - energy: I ↔ E<br>- perception: S ↔ N<br>- judgment: T ↔ F<br>- lifestyle: J ↔ P |
| **범위** | 1 ~ 10 (step=1) |
| **기본값** | 5 |
| **저장** | `CompanionRepository.update({ mbtiEnergy, mbtiPerception, mbtiJudgment, mbtiLifestyle })` |

### Step 3: 프로필 이미지 생성 (image)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `companions/[companionId]/image/page.tsx` |
| **컴포넌트** | `ProfileImageGenerator` |
| **입력** | 프롬프트 텍스트 |
| **동작** | "이미지 생성" 버튼 → `CompanionRepository.generateImage({ prompt })` → 이미지 표시 |
| **저장** | `CompanionRepository.update({ profilePictureUrl })` |

### Step 4-5: 이름 + 서사 입력 (complete)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `companions/[companionId]/complete/page.tsx` |
| **Step 4** | 이름 입력 (`CompanionNameInput`) |
| **Step 5** | 서사/Biography 입력 (`BiographyInput`) |
| **저장** | `CompanionRepository.update({ name, biography })` |
| **완료** | 캐스팅 완료 페이지 이동 |

---

## 4. 캐스팅 완료 (casting-complete)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `aidols/[aidolId]/casting-complete/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/casting-complete` |
| **역할** | 캐스팅 완료 확인 → 다음 연습생 찾기 or 캐스팅 보드 이동 |

---

## 5. 캐스팅 보드 (casting-board)

캐스팅된 멤버를 관리하고 데뷔조를 확정하는 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `aidols/[aidolId]/casting-board/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/casting-board` |

### 5-1. 멤버 목록

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `CastingBoard` |
| **API 호출** | `CompanionRepository.getList({ filters: [aidolId] })` |
| **표시** | 캐스팅된 멤버 카드 목록 |

### 5-2. 멤버 삭제

| 항목 | 내용 |
|------|------|
| **트리거** | 멤버 카드 클릭 → 프로필 모달 |
| **동작** | "삭제" 버튼 → `CompanionRepository.deleteOne({ id })` → 목록에서 제거 |

### 5-3. 데뷔조 확정

| 항목 | 내용 |
|------|------|
| **버튼** | `onConfirm` → 포지션 배정 페이지 이동 |
| **조건** | 최소 2명 이상 (구현 확인 필요) |

---

## 6. 포지션 배정 (position-assignment)

각 멤버에게 포지션을 배정하는 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `aidols/[aidolId]/position-assignment/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/position-assignment` |

### 6-1. 포지션 종류

| 항목 | 내용 |
|------|------|
| **정의** | `frontend/src/schemas/companion.ts` → `POSITIONS` |
| **목록** | `mainVocal`, `subVocal`, `mainDancer`, `subDancer`, `mainRapper`, `subRapper` |
| **참고** | 리더, 비주얼, 막내는 현재 미구현 |

### 6-2. 포지션 배정 동작

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `PositionSelector` |
| **동작** | 멤버 카드 클릭 → 드롭다운에서 포지션 선택 |
| **제약** | 모든 포지션은 1명에게만 배정 가능 (이미 배정된 포지션은 disabled + "(배정됨)" 표시) |
| **저장** | `CompanionRepository.update({ position })` |

---

## 7. 그룹 기획 (group)

2단계로 구성된 그룹 설정 플로우입니다.

| 항목 | 내용 |
|------|------|
| **URL 패턴** | `/{lang}/aidols/{aidolId}/group/{step}` |
| **레이아웃** | `GroupPlanningLayout` (진행 바: 1/2, 2/2) |

### Step 1: 그룹 이름 (name)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `group/name/page.tsx` |
| **컴포넌트** | `TextInput` |
| **제약** | 최대 20자, 빈 값 불가 |
| **저장** | `AIdolRepository.update({ name })` |

### Step 2: 그룹 엠블럼 (emblem)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `group/emblem/page.tsx` |
| **동작** | 프롬프트 입력 → 이미지 생성 → 저장 |
| **저장** | `AIdolRepository.update({ profileImageUrl })` |

---

## 8. 뉴스레터 (newsletter)

Sprint 2 리텐션을 위한 연락처 수집 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `aidols/[aidolId]/newsletter/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/newsletter` |
| **컴포넌트** | `NewsletterForm` |
| **입력** | 이메일 (유효성 검사: 이메일 형식) |
| **저장** | `LeadsRepository.create({ aidolId, email })` |

---

## 9. 결과 페이지

그룹 생성 완료 후 결과를 표시하는 화면입니다.

| 항목 | 내용 |
|------|------|
| **URL** | `/{lang}/aidols/{aidolId}` |
| **표시** | 그룹 엠블럼, 그룹명, 멤버 목록 + 포지션 |

---

## 데이터 스키마

### Companion (멤버)

```typescript
interface Companion {
  id: string;
  aidolId?: string | null;
  name?: string | null;
  biography?: string | null;
  profilePictureUrl?: string | null;
  grade?: 'A' | 'B' | 'C' | 'F' | null;
  position?: 'mainVocal' | 'subVocal' | 'mainDancer' | 'subDancer' | 'mainRapper' | 'subRapper' | null;
  mbti?: string | null;
  gender?: 'male' | 'female' | null;
  stats?: {
    vocal: number;
    dance: number;
    rap: number;
    visual: number;
    stamina: number;
    charm: number;
  };
}
```

### AIdol (그룹)

```typescript
interface AIdol {
  id: string;
  name: string | null;
  email?: string | null;
  greeting?: string | null;
  concept?: string | null;
  profileImageUrl: string | null;
  companions?: Companion[];
}
```

---

## 미구현 / 제외 항목

기존 기능명세서 대비 현재 미구현된 항목:

1. **포지션**: 리더, 비주얼, 막내 (POSITIONS에 미포함)
2. **연습생 등급 기준**: 능력치 평균 계산 로직 (프론트엔드에서 미확인)
3. **캐스팅 슬롯 제한**: 최대 25명 제한 (구현 확인 필요)
4. **MBTI 중립 불가**: 현재 기본값 5로 중립 가능
5. **이름 특수문자 제한**: 프론트엔드에서 제한 로직 미확인
