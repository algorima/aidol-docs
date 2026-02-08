# AIdol 기능 명세서

> **출처**: [Notion 전체 기능 명세서](https://www.notion.so/2ec46f965504805a94fbed8c0109cd91)
> **코드베이스**: [GitHub algorima/aidol](https://github.com/algorima/aidol)

## 목차

- [공통](#공통)
- [Phase 1: AI 아이돌 그룹 생성](#phase-1-ai-아이돌-그룹-생성)
- [Phase 2: 관계 설정 및 세계관 구축](#phase-2-관계-설정-및-세계관-구축)
- [Phase 3: AI 아이돌 채팅](#phase-3-ai-아이돌-채팅)
- [데이터 스키마](#데이터-스키마)
- [미구현 / 제외 항목](#미구현--제외-항목)

## 공통

모든 Phase에 걸쳐 적용되는 공통 기능 및 가이드라인입니다.

### 1. AI 생성 이미지 윤리 가이드라인

| 항목 | 내용 |
|------|------|
| **기능** | AI 생성 고지 |
| **설명** | 모든 AI 생성 이미지에 "AI로 생성된 이미지입니다" 문구 표시 |

### 2. 투표/반응 시스템

| 항목 | 내용 |
|------|------|
| **기능** | 사용자 창작 콘텐츠에 대한 반응 시스템 |
| **설명** | 관계 설정, 서사 등 사용자가 만든 콘텐츠에 다른 사용자가 댓글, 좋아요 등 반응 가능 |
| **기능 명세** | - 좋아요/투표 기능<br>- 조회수 표시<br>- 인기 콘텐츠 랭킹<br>- 창작자에게 반응 알림 발송 (리텐션 핵심) |

### 3. 로고 삽입

| 항목 | 내용 |
|------|------|
| **기능** | 로고 삽입 |
| **설명** | 이미지 우측 하단에 서비스 로고 워터마크 삽입 |

### 4. Vertex AI 사용

| 항목 | 내용 |
|------|------|
| **기능** | Vertex AI 사용 |
| **설명** | Google Vertex AI 활용 |
| **면책 조항** | - 서비스 하단 또는 설정 페이지에 "본 서비스는 Google Vertex AI를 활용합니다" 문구 표시<br>- AI 생성 콘텐츠에 대한 책임 고지: "AI가 생성한 콘텐츠는 정확하지 않을 수 있으며, 서비스 제공자는 이에 대한 책임을 지지 않습니다"<br>- Google AI 이용약관 링크 제공 |

### 5. 미성년자 보호

| 항목 | 내용 |
|------|------|
| **기능** | 미성년자 보호 |
| **설명** | 미성년 캐릭터 대상 부적절 콘텐츠 생성 차단 |
| **판단 기준** | **TBD** - 현재 Phase 1 캐릭터 생성에 나이/생년월일 필드가 없음. 미성년자 판단 기준 정의 필요:<br>- 옵션 1: 캐릭터 생성 시 나이 또는 생년월일 필드 추가<br>- 옵션 2: 이미지 분석을 통한 자동 판단 (Vertex AI Safety Filter)<br>- 옵션 3: 모든 캐릭터를 성인으로 간주 (서비스 정책으로 명시) |
| **기능 명세** | - 미성년자로 판단되는 캐릭터에 대해 선정적/폭력적 콘텐츠 생성 차단<br>- Vertex AI Safety Filter 활용<br>- 사용자에게 차단 사유 안내 |

## Phase 1: AI 아이돌 그룹 생성

서비스의 핵심 플로우인 AI 아이돌 그룹 생성을 구현합니다.
사용자가 연습생을 캐스팅하고, 신규 멤버를 생성하고, 포지션을 배정하여 그룹을 완성하는 전체 여정을 포함합니다.

### 1. 랜딩 페이지 (HeroSection)

서비스 첫 진입 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `frontend/src/components/landing/HeroSection.tsx` |
| **구성 요소** | - 로고 이미지<br>- 타이틀 (i18n: `landing.hero.title.line1`, `line2`)<br>- 서브 텍스트 4줄 (i18n: `landing.hero.line1~4`)<br>- 간판 아이돌 영상 (autoPlay, loop, muted)<br>- CTA 버튼 (i18n: `landing.hero.cta`) |
| **동작** | CTA 버튼 클릭 → `onGetStarted` 콜백 실행 → 캐스팅 페이지 이동 |

### 2. 캐스팅 페이지 (casting)

연습생을 선발하는 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `frontend/src/app/[lang]/aidols/[aidolId]/casting/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/casting` |

#### 2-1. 헤더

| 항목 | 내용 |
|------|------|
| **구성** | - 타이틀 (i18n: `casting.title`)<br>- 우측: "멤버 추가" 버튼 + 아이콘 |

#### 2-2. 성별 필터 탭

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `GenderFilterTabs` |
| **탭 종류** | `boy` (남성) / `girl` (여성) / `mixed` (전체) |
| **기본값** | `boy` |
| **동작** | 탭 선택 시 해당 성별 연습생만 API 필터링하여 표시 |

#### 2-3. 연습생 카드 그리드

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `CastingCardGrid` |
| **API 호출** | `CompanionRepository.getList({ filters: [gender], pagination: { pageSize: 100 } })` |
| **표시 정보** | 프로필 사진, 이름, 등급 (A/B/C/F) |

#### 2-4. 연습생 상세 프로필 팝업

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `Modal` + `ProfileContent` |
| **트리거** | 연습생 카드 클릭 |
| **표시 정보** | 프로필 사진, 이름, 등급, MBTI, 능력치 차트, 서사(biography) |
| **능력치 항목** | vocal, dance, rap, visual, stamina, charm (6개) |
| **CTA 버튼** | i18n: `casting.castButton` → 캐스팅 완료 페이지 이동 |

### 3. 신규 멤버 추가 (companions)

5단계로 구성된 멤버 생성 플로우입니다.

| 항목 | 내용 |
|------|------|
| **URL 패턴** | `/{lang}/aidols/{aidolId}/companions/{companionId}/{step}` |
| **레이아웃** | `CompanionCreateLayout` (진행 바 표시) |

#### Step 1: 성별 선택 (gender)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `companions/[companionId]/gender/page.tsx` |
| **컴포넌트** | `GenderSelector` |
| **선택지** | `male` / `female` |
| **저장** | `CompanionRepository.update({ gender })` |

#### Step 2: 성격 설정 - MBTI (personality)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `companions/[companionId]/personality/page.tsx` |
| **컴포넌트** | `MbtiForm` + `MbtiSlider` |
| **슬라이더 4개** | - energy: I ↔ E<br>- perception: S ↔ N<br>- judgment: T ↔ F<br>- lifestyle: J ↔ P |
| **범위** | 1 ~ 10 (step=1) |
| **기본값** | 5 |
| **저장** | `CompanionRepository.update({ mbtiEnergy, mbtiPerception, mbtiJudgment, mbtiLifestyle })` |

#### Step 3: 프로필 이미지 생성 (image)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `companions/[companionId]/image/page.tsx` |
| **컴포넌트** | `ProfileImageGenerator` |
| **입력** | 프롬프트 텍스트 |
| **동작** | "이미지 생성" 버튼 → `CompanionRepository.generateImage({ prompt })` → 이미지 표시 |
| **저장** | `CompanionRepository.update({ profilePictureUrl })` |

#### Step 4-5: 이름 + 서사 입력 (complete)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `companions/[companionId]/complete/page.tsx` |
| **Step 4** | 이름 입력 (`CompanionNameInput`) |
| **Step 5** | 서사/Biography 입력 (`BiographyInput`) |
| **저장** | `CompanionRepository.update({ name, biography })` |
| **완료** | 캐스팅 완료 페이지 이동 |

### 4. 캐스팅 완료 (casting-complete)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `aidols/[aidolId]/casting-complete/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/casting-complete` |
| **역할** | 캐스팅 완료 확인 → 다음 연습생 찾기 or 캐스팅 보드 이동 |

### 5. 캐스팅 보드 (casting-board)

캐스팅된 멤버를 관리하고 데뷔조를 확정하는 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `aidols/[aidolId]/casting-board/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/casting-board` |

#### 5-1. 멤버 목록

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `CastingBoard` |
| **API 호출** | `CompanionRepository.getList({ filters: [aidolId] })` |
| **표시** | 캐스팅된 멤버 카드 목록 |

#### 5-2. 멤버 삭제

| 항목 | 내용 |
|------|------|
| **트리거** | 멤버 카드 클릭 → 프로필 모달 |
| **동작** | "삭제" 버튼 → `CompanionRepository.deleteOne({ id })` → 목록에서 제거 |

#### 5-3. 데뷔조 확정

| 항목 | 내용 |
|------|------|
| **버튼** | `onConfirm` → 포지션 배정 페이지 이동 |
| **조건** | 최소 2명 이상 (구현 확인 필요) |

### 6. 포지션 배정 (position-assignment)

각 멤버에게 포지션을 배정하는 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `aidols/[aidolId]/position-assignment/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/position-assignment` |

#### 6-1. 포지션 종류

| 항목 | 내용 |
|------|------|
| **정의** | `frontend/src/schemas/companion.ts` → `POSITIONS` |
| **목록** | `mainVocal`, `subVocal`, `mainDancer`, `subDancer`, `mainRapper`, `subRapper` |
| **참고** | 리더, 비주얼, 막내는 현재 미구현 |

#### 6-2. 포지션 배정 동작

| 항목 | 내용 |
|------|------|
| **컴포넌트** | `PositionSelector` |
| **동작** | 멤버 카드 클릭 → 드롭다운에서 포지션 선택 |
| **제약** | 모든 포지션은 1명에게만 배정 가능 (이미 배정된 포지션은 disabled + "(배정됨)" 표시) |
| **저장** | `CompanionRepository.update({ position })` |

### 7. 그룹 기획 (group)

2단계로 구성된 그룹 설정 플로우입니다.

| 항목 | 내용 |
|------|------|
| **URL 패턴** | `/{lang}/aidols/{aidolId}/group/{step}` |
| **레이아웃** | `GroupPlanningLayout` (진행 바: 1/2, 2/2) |

#### Step 1: 그룹 이름 (name)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `group/name/page.tsx` |
| **컴포넌트** | `TextInput` |
| **제약** | 최대 20자, 빈 값 불가 |
| **저장** | `AIdolRepository.update({ name })` |

#### Step 2: 그룹 엠블럼 (emblem)

| 항목 | 내용 |
|------|------|
| **구현 파일** | `group/emblem/page.tsx` |
| **동작** | 프롬프트 입력 → 이미지 생성 → 저장 |
| **저장** | `AIdolRepository.update({ profileImageUrl })` |

### 8. 뉴스레터 (newsletter)

Phase 2 리텐션을 위한 연락처 수집 화면입니다.

| 항목 | 내용 |
|------|------|
| **구현 파일** | `aidols/[aidolId]/newsletter/page.tsx` |
| **URL** | `/{lang}/aidols/{aidolId}/newsletter` |
| **컴포넌트** | `NewsletterForm` |
| **입력** | 이메일 (유효성 검사: 이메일 형식) |
| **저장** | `LeadsRepository.create({ aidolId, email })` |

### 9. 결과 페이지

그룹 생성 완료 후 결과를 표시하는 화면입니다.

| 항목 | 내용 |
|------|------|
| **URL** | `/{lang}/aidols/{aidolId}` |
| **표시** | 그룹 엠블럼, 그룹명, 멤버 목록 + 포지션 |

## Phase 2: 관계 설정 및 세계관 구축

Phase 1에서 생성한 그룹의 멤버들 간 관계를 설정하고, 캐릭터 서사를 추가하여 더 풍부한 스토리를 만들어갑니다.

### 1. 관계 지도 도착 이메일 (이메일 템플릿)

Phase 2 진입점으로, Phase 1에서 생성한 그룹의 관계 지도 도착을 알리는 이메일 마케팅입니다.

| 항목 | 내용 |
|------|------|
| **설명** | Phase 1 완료 후 약 1주일 경과 시, 콘텐츠 형태의 이메일 제공 |
| **기능 명세** | - 헤더: 서비스 로고<br>- 타이틀: 숙소생활 1주일 후 이벤트 후킹 문구<br>- 프리뷰: 멤버 대화 미리보기, 상황 이미지, 멤버 간 갈등/케미 암시하는 대화 스니펫<br>- CTA: 숙소 생활 후기 보러가기, 딥링크 → 내 그룹(MyGroup) |

### 2. DM 예고 영역 (내 그룹(MyGroup) 페이지)

Phase 3 DM 기능 티저입니다.

| 항목 | 내용 |
|------|------|
| **설명** | Phase 3 DM 기능 티저 |
| **기능 명세** | - "멤버들과 채팅 준비중" 문구 표시<br>- 비활성 상태로 노출 |

### 3. 멤버별 후기 (숙소 생활 썰)

Phase 2 인트로 콘텐츠로, 멤버들이 1주일간 함께 생활하며 느낀 서로에 대한 후기 코멘트입니다.

| 항목 | 내용 |
|------|------|
| **설명** | - 각 멤버가 다른 멤버에 대해 짧은 코멘트를 남긴 형태로 제공<br>- 예: "원빈이는 춤을 너무 잘 춰서 기가 죽었어요", "쟤는 코를 너무 골아요" |
| **기능 명세** | - 그룹별 2개의 후기 콘텐츠 수동으로 제작<br>- 포지션, 성격, 스탯을 참고 |

### 4. 관계 지도 프리셋

자동 생성된 기본 관계 설정으로, 포지션 및 캐릭터 속성 기반으로 자동 생성된 관계 맵을 제공합니다.

| 항목 | 내용 |
|------|------|
| **설명** | - 리더↔막내 관계, 메인보컬↔서브보컬 관계, 동갑 멤버 관계 등 기본적인 관계가 이미 설정되어 있는 상태로 제공 |
| **기능 명세** | - 포지션 기반 자동 관계 생성: 리더↔막내, 메인댄서↔리드댄서 등<br>- 나이 기반 자동 관계: 동갑, 형/동생 라인<br>- 관계 카테고리: 동료, 라이벌, 사제, 동갑친구 등<br>- **프리셋 관계 설정은 양방향** (시스템이 자동 생성하므로 A↔B 양쪽 모두에게 표시) |

### 5. 캐릭터 서사 설정

개별 멤버 프로필 확장으로, 각 멤버의 배경 스토리, 성격 특성, 습관 등 상세 설정입니다.

| 항목 | 내용 |
|------|------|
| **설명** | - 포스타입 캐릭터 설정 방식 참고<br>- 프롬프트 형식이 아닌 자유로운 텍스트로 작성 → 시스템이 프롬프트화 |
| **기능 명세** | - 서사 입력 필드: 자유 텍스트 (최대 500자)<br>- 예시 제공: "대형 기획사에서 데뷔 직전 엎어진 후 재도전", "연습생 중, 가장 늦게 들어왔지만 보컬 실력은 최고" 등<br>- AI가 자유 텍스트를 캐릭터 프롬프트로 변환<br>- 서사가 채팅 및 관계 설정에 반영됨<br>- 프리셋 멤버는 기본 서사 제공, 신규 생성 멤버는 사용자 작성 |

### 6. 관계 디테일 설정

사용자 커스텀 관계 추가로, 프리셋 관계 외에 사용자가 원하는 관계 디테일을 추가합니다.

| 항목 | 내용 |
|------|------|
| **설명** | - 두 멤버를 선택하여 관계 유형 지정 및 CP명(커플링명) 부여<br>- 예: 소꿉친구, 같은 학교 출신, 멍멍즈(둘 다 강아지상) |
| **기능 명세** | - 멤버 2명 선택 → 관계 유형 선택/입력<br>- 관계 유형 프리셋: 소꿉친구, 라이벌, 같은 학교, 같은 기획사 출신, 룸메이트 등<br>- 커스텀 관계 유형 입력 가능<br>- 관계 별칭 입력 필드: 예) "멍멍즈", "동갑즈", "자석즈"<br>- **커스텀 관계 설정은 단방향** (사용자가 A→B 관계만 설정, B의 프로필에는 "A가 나를 라이벌로 지정"처럼 수동태로 표시) |
| **Figma 링크** | [Figma](https://www.figma.com/design/UAYebrdbyKuZ76pwBN5UuV/UI?node-id=987-6600) |

### 7. 관계 보드 (최종 결과)

Phase 2 결과 화면으로, 완성된 그룹 관계 맵을 시각화합니다.

| 항목 | 내용 |
|------|------|
| **설명** | - 모든 멤버의 관계가 노드와 엣지로 표현된 관계 보드<br>- 각 관계선에 관계 유형과 CP명 표시 |
| **기능 명세** | - 멤버 노드 클릭 시 해당 멤버의 모든 관계 하이라이트<br>- 관계선 클릭 시 상세 정보 팝업 (관계 유형, CP명, 케해)<br>- 관계 보드 이미지 저장/공유 기능<br>- "관계 더 설정하기" 버튼으로 수정 가능 |

### 8. Phase 3 예고

Phase 2 엔딩 / Phase 3 연결로, 멤버와 직접 대화할 수 있다는 예고입니다.

| 항목 | 내용 |
|------|------|
| **설명** | - "멤버들이 할 말이 있대요" 형태로 Phase 3(채팅) 예고<br>- 알림 수신 동의 유도 |
| **기능 명세** | - 특정 멤버 노드에 "할 말 있어요" 뱃지 표시<br>- 뱃지 클릭 시 "곧 대화할 수 있어요" 안내<br>- 알림 수신 동의 수집: 이메일(필수, Phase 3 출시 안내 메일 발송용) + 휴대폰 번호(선택, 문자 알림용), 각 채널별 수신 동의 체크박스 제공<br>- Phase 3 출시 시 이메일/문자 발송 |

## Phase 3: AI 아이돌 채팅

사용자가 생성하거나 팔로우한 AI 아이돌과 1:1 대화를 나눌 수 있는 핵심 인터랙션 기능입니다.

### 1. 내 그룹 페이지 (MyGroup)

사용자가 생성한 AI 아이돌 그룹을 확인하고 그룹의 데뷔일 및 주요 소식을 확인한 뒤 개별 또는 그룹 채팅 화면으로 진입하는 중간 허브 페이지입니다.

#### 1-1. 채팅 화면 진입

| 항목 | 내용 |
|------|------|
| **Page** | MyGroup |
| **설명** | 채팅 아이콘 + 노티 "멤버들이 할 말이 있대요!" |
| **트리거 조건** | - 사용자가 아직 읽지 않은 메시지가 있을 경우<br>- 멤버가 새로운 메시지를 보낸 경우 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=46%3A3987) |

### 2. 타 그룹 상세 페이지 (Home_OtherGroup)

프리셋 AI 아이돌 그룹의 정보와 소식을 확인하고, 팔로우를 통해 관계를 시작한 뒤 채팅으로 이어지는 상세 페이지입니다.

#### 2-1. 채팅 화면 진입 (Follow 상태)

| 항목 | 내용 |
|------|------|
| **Page** | Home_OtherGroup, Follow |
| **설명** | 채팅 아이콘 + 노티 "멤버들이 할 말이 있대요!" |
| **트리거 조건** | - 사용자가 아직 읽지 않은 메시지가 있을 경우<br>- 멤버가 새로운 메시지를 보낸 경우 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=46%3A4150) |

#### 2-2. 팔로우 (NotFollow 상태)

| 항목 | 내용 |
|------|------|
| **Page** | Home_OtherGroup, NotFollow |
| **설명** | 팔로우로 Switch |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=46%3A4102) |

### 3. 수신함 페이지 (Inbox)

팔로우하거나 사용자가 생성한 AI 아이돌로부터 수신된 메시지 목록을 표시하고, 각 항목을 통해 개별 채팅 화면으로 진입하는 수신함 페이지입니다.

#### 3-1. 채팅 목록 확인

| 항목 | 내용 |
|------|------|
| **Page** | Inbox |
| **설명** | 첫 채팅 멤버는 랜덤하게 설정 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A1664) |

#### 3-2. 대화 제한 안내 모달

아직 대화가 열리지 않은 아이돌에 대해, 현재는 제한 상태임을 알리고 '곧 대화가 가능해질 것'이라는 기대를 전달하는 안내 모달입니다.

| 항목 | 내용 |
|------|------|
| **Page** | Inbox, Modal |
| **설명** | - 아직 채팅이 열리지 않은 아이돌을 탭했을 때 노출되는 안내 모달<br>- 제목: "이 멤버와의 대화는 곧 열릴 예정이에요"<br>- 본문: 현재는 대화가 제한되어 있으나, 추후 업데이트로 대화가 가능해질 것이라는 메시지 전달<br>- 버튼: `확인` 1개로 모달 닫기 |
| **기능 명세** | - 트리거: Inbox에서 `대화 제한 상태`로 표시된 멤버/카드를 탭할 경우 모달 표시<br>- 사용자가 `확인` 버튼을 누르면 모달이 닫히고, 채팅 화면으로는 이동하지 않음<br>- 모달 바깥 영역(배경)을 탭해도 닫힘(채팅 화면 진입 없음)<br>- 동일 멤버에 대해 제한 상태가 유지되는 동안은 매번 동일 모달 노출 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A1802) |

### 4. 채팅 화면 (Chat)

AI 아이돌과의 1:1 채팅을 통해 메시지를 주고받는 대화 화면입니다.

#### 4-1. 채팅 진입

| 항목 | 내용 |
|------|------|
| **Page** | Chat |
| **설명** | - 단일 멤버 대화<br>- 한 명의 멤버와만 대화 가능 (멤버 간 맥락 공유 없음)<br>- 한국 시간 기준<br>- 멤버들은 같은 시간대를 살고 있음 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A2110) |

#### 4-2. 첫 메시지 발신자에 따른 UI

| 항목 | 내용 |
|------|------|
| **Chat_First_Member** | 멤버(AI 아이돌)가 먼저 메시지를 보낸 상태의 화면 |
| **Chat_First_User** | 사용자가 먼저 메시지를 보낸 상태의 화면 |
| **Figma 링크** | [Chat_First_Member](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=46%3A3907), [Chat_First_User](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A1927) |

#### 4-3. 로딩 상태 (Chat_Loading)

| 항목 | 내용 |
|------|------|
| **설명** | AI 아이돌이 응답을 생성하는 동안 표시되는 로딩 상태 |
| **기능 명세** | - 로딩 인디케이터 또는 "입력 중..." 표시<br>- 사용자는 로딩 중에도 추가 메시지 입력 가능 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A2190) |

#### 4-4. 작성 중 상태 (Chat_Writing)

| 항목 | 내용 |
|------|------|
| **설명** | 사용자가 메시지를 입력하고 있는 상태 |
| **기능 명세** | - 텍스트 입력 필드 활성화<br>- 전송 버튼 활성화 조건: 텍스트 입력 시 |
| **Figma 링크** | [Figma](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A2113) |

#### 4-5. 에러 처리

| 항목 | 내용 |
|------|------|
| **Chat_Error_User** | 사용자 측 에러 (네트워크 오류, 메시지 전송 실패 등) |
| **Chat_Error_Member** | 멤버(AI) 측 에러 (응답 생성 실패 등) |
| **기능 명세** | - 에러 발생 시 사용자에게 안내 메시지 표시<br>- "다시 시도" 버튼 제공<br>- 에러 유형에 따른 적절한 안내 문구 |
| **Figma 링크** | [Chat_Error_User](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A2044), [Chat_Error_Member](https://www.figma.com/file/YKX5YVvaGFjSsTWXTDD7DT/UI?node-id=295%3A1980) |

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

## 미구현 / 제외 항목

기존 기능명세서 대비 현재 미구현된 항목:

1. **포지션**: 리더, 비주얼, 막내 (POSITIONS에 미포함)
2. **연습생 등급 기준**: 능력치 평균 계산 로직 (프론트엔드에서 미확인)
3. **캐스팅 슬롯 제한**: 최대 25명 제한 (구현 확인 필요)
4. **MBTI 중립 불가**: 현재 기본값 5로 중립 가능
5. **이름 특수문자 제한**: 프론트엔드에서 제한 로직 미확인
