# 이미지 생성 프롬프트 정리

## 1. 개요

AIdol 서비스에서 사용되는 AI 이미지 생성 프롬프트를 스크립트별로 정리한 문서입니다.
모든 이미지는 Gemini 3 Pro Image Preview 모델(`gemini-3-pro-image-preview`)을 사용하여 생성합니다.

생성 대상:
- 20개 그룹 엠블럼/로고
- 132명 그룹 소속 멤버 프로필 사진 (v3)
- 20명 남자 / 16명 여자 프로필 사진 (v1, 초기 버전)
- 신규 연습생 10명 캐릭터별 맞춤 프로필 사진
- 단일 프로필 사진 재생성 (레퍼런스 기반 동일 인물 front-facing 변환)

## 2. 그룹 엠블럼/로고 생성

### 2.1 사용 스크립트

`scripts/generate_group_emblems.py`

### 2.2 공통 프롬프트 (COMMON_PROMPT)

```
Design a custom wordmark logo for a K-pop idol group.

CRITICAL — THE WORDMARK IS THE LOGO:
- The group name rendered in CUSTOM LETTERING is the entire logo
- No separate icon or symbol placed next to or above the text
- The letterforms themselves ARE the design — through ligatures, modified strokes,
  removed crossbars, connected letters, or clever negative space
- Reference: BTS (two trapezoids), BLACKPINK (mirrored C and N, removed A crossbar),
  aespa (interlocked a+e forming butterfly), LE SSERAFIM (custom Ringside modification)

TYPOGRAPHY:
- Custom-designed letterforms, NOT a stock font used as-is
- Every letter should feel intentionally crafted
- Geometric precision: mathematically exact spacing, consistent stroke widths
- All-caps (unless the concept specifically calls for mixed case)

STYLE:
- Pure white lettering on solid black background
- NO color, NO gradients, NO metallic effects, NO chrome, NO shadows, NO 3D, NO glow
- NO decorative elements around the text (no stars, notes, crowns, borders, shields)
- Clean vector-art quality with sharp crisp edges
- Must be legible and recognizable even at small sizes (like a favicon)

COMPOSITION:
- The wordmark is centered on the canvas
- Generous negative space around the letters — let it breathe
- The logo should feel like it was designed by a top Korean design agency
  (HuskyFox, Studio XXX) for a major entertainment company debut

ABSOLUTELY NOT:
- No icon or symbol separate from the letters
- No realistic imagery, no illustrations, no people
- No extra text, taglines, subtitles, dates
- No busy or cluttered composition
```

### 2.3 그룹별 레터링 방향 (lettering hint)

공통 프롬프트에 그룹명과 레터링 힌트를 추가하여 최종 프롬프트를 구성합니다.

```
[공통 프롬프트]

GROUP NAME: {name}
CUSTOM LETTERING DIRECTION: {lettering_hint}

Generate ONLY the wordmark logo — white on black, nothing else.
```

20개 그룹 레터링 방향 상세:

| 그룹명 | 한글명 | 타입 | 레터링 방향 |
|--------|--------|------|-------------|
| CREED | 크리드 | 보이그룹 | Extra-bold condensed all-caps. The two E letters share a connected vertical stroke in the middle, forming a unified ligature. Sharp angular terminals on C and D. Aggressive, authoritative. |
| ARDOR | 아더 | 보이그룹 | Heavy italic sans-serif, all letters leaning forward with urgency. The A has no crossbar — just two diagonal strokes meeting at a sharp peak. Bold, passionate energy. |
| KLAV | 클라브 | 보이그룹 | Clean geometric sans-serif with precise mathematical spacing. The K and V mirror each other's diagonal strokes. The A has a flat top like a piano key shape. Refined, classical-modern. |
| PLUME | 플룸 | 걸그룹 | Elegant thin-weight extended sans-serif with generous letter-spacing. The tail of the E extends into a delicate upward flick like a feather tip. Light, airy, sophisticated. |
| CIEL | 시엘 | 걸그룹 | Rounded geometric sans-serif, medium weight. The C curves almost into a full circle. The I has no serifs, just a clean vertical stroke. The dot of the I is replaced by a tiny circle. Soft, open, dreamy. |
| DAZE | 데이즈 | 걸그룹 | The letters have slightly rounded edges and the Z is rotated 2-3 degrees, creating a subtle off-balance feeling. Medium-weight sans-serif. Hypnotic, slightly surreal. |
| AXIS | 악시스 | 혼성 | Geometric sans-serif where the X is perfectly centered and enlarged slightly, becoming the visual anchor. The A and S mirror each other in weight. Symmetrical, balanced, precise. |
| NODE | 노드 | 혼성 | Monospaced geometric letterforms where the O is a perfect circle and the D echoes it. Small dots at the terminals of N and E, like connection nodes. Clean, technical. |
| CLEF | 클레프 | 혼성 | The C and L flow together in a continuous connected stroke, resembling a treble clef curve. Elegant medium-weight sans-serif. The ligature IS the identity. Musical, harmonious. |
| NEXO | 넥소 | 보이그룹 | Bold geometric all-caps where the X is formed by two overlapping V shapes, creating an interlocking effect. The O is hexagonal rather than round. Futuristic, connected. |
| VERVE | 버브 | 보이그룹 | Black-weight italic sans-serif with extreme forward lean. Each letter slightly overlaps the next, creating kinetic energy. The two V letters bookend the word with sharp diagonals. Dynamic, vital. |
| AURA | 오라 | 걸그룹 | Thin-to-medium weight with elegant contrast. The two A letters are identical but the U between them has an unusually wide bowl, creating a soft glow-like open space. Luminous, warm. |
| BIJOU | 비쥬 | 걸그룹 | Geometric sans-serif where the O is a diamond/rhombus shape instead of a circle. The J descends below the baseline with a precise angular turn. Faceted, crystalline, precious. |
| TROVE | 트로브 | 혼성 | Bold condensed all-caps with the O split into two halves with a hairline gap — like a chest opening. Sturdy, weighty letterforms. Rich, substantial. |
| HELIX | 헬릭스 | 혼성 | The H and X share mirrored diagonal strokes. Medium-weight sans-serif with subtle rounded terminals. The I is slightly rotated, creating a spiral suggestion. Interconnected, evolving. |
| NOVA | 노바 | 보이그룹 | Extra-bold geometric all-caps. The O has four tiny notches at cardinal points, making it a subtle four-pointed star. Clean, explosive energy in heavy simple forms. |
| FLORA | 플로라 | 걸그룹 | Light-weight extended sans-serif with rounded terminals on every letter. The O has a tiny stem descending from it like a flower bud. Organic, delicate, botanical. |
| TRACE | 트레이스 | 혼성 | Medium sans-serif where the letters gradually decrease in opacity from T (100%) to E (60%), creating a fading trail effect. The baseline curves gently upward. Journey, path. |
| CREST | 크레스트 | 보이그룹 | Heavy extended all-caps with strong horizontal emphasis. The T at the end has an extra-wide crossbar that extends over the adjacent letters like a protective roof. Regal, commanding. |
| FLEUR | 플뢰르 | 걸그룹 | Elegant transitional serif with high contrast between thick and thin strokes. The F has a decorative terminal that curves like a petal. The R's leg extends with a graceful kick. Refined, French-inspired. |

### 2.4 이미지 설정

- 모델: `gemini-3-pro-image-preview`
- 종횡비: `1:1`
- 출력 형식: PNG

## 3. 아이돌 프로필 사진 생성 (v3 — 132명 멤버)

### 3.1 사용 스크립트

`scripts/generate_profile_photos_v3.py`

132명 전체 멤버를 대상으로 아키타입 + 변형 풀 조합 방식으로 고유한 프로필 사진을 생성합니다.

### 3.2 비주얼 품질 공통 프롬프트

**남성 (VISUAL_QUALITY_MALE)**

```
CRITICAL: This person MUST look like Cha Eunwoo or Song Kang level — the TOP 0.001% of male beauty on Earth.
This is NOT a regular handsome person. This must be a GODLIKE, BREATHTAKING, UNREAL level of male beauty.
The kind of face that makes everyone in the room stop and stare. A face that belongs on Vogue Korea covers.
The face in the FACE REFERENCE IMAGES shows the EXACT level of beauty required — match or EXCEED it.

ABSOLUTE REQUIREMENTS:
- Skin: FLAWLESS luminous glass skin, absolutely ZERO imperfections, NO moles, NO marks, NO spots, NO blemishes of any kind
- Skin must be perfectly clear, smooth, porcelain-like with dewy glow
- Bone structure: perfectly sculpted jawline, high cheekbones, golden-ratio facial proportions
- Eyes: bright, clear, captivating — the kind of eyes you can't look away from
- Nose: perfectly shaped, refined, elegant
- Lips: well-defined, naturally colored
- Overall impression: "this person looks like a god" — NOT "this person is okay-looking"
- Quality: Vogue Korea editorial, ultra-realistic, 8K resolution, professional studio photo
- ABSOLUTELY NO moles, beauty marks, spots, freckles, or any skin imperfections
```

**여성 (VISUAL_QUALITY_FEMALE)**

```
CRITICAL: This person MUST look like Jang Wonyoung or Jisoo level — the TOP 0.001% of female beauty on Earth.
This is NOT a regular pretty person. This must be a GODLIKE, BREATHTAKING, UNREAL level of female beauty.
The kind of face that makes everyone in the room stop and stare. A face that belongs on Vogue Korea covers.
The face in the FACE REFERENCE IMAGES shows the EXACT level of beauty required — match or EXCEED it.

ABSOLUTE REQUIREMENTS:
- Skin: FLAWLESS luminous glass skin, absolutely ZERO imperfections, NO moles, NO marks, NO spots, NO blemishes of any kind
- Skin must be perfectly clear, smooth, porcelain-like with dewy glow
- Bone structure: delicate refined jawline, high sculpted cheekbones, small perfectly shaped face
- Eyes: bright, sparkling, captivating — the kind of eyes you can't look away from
- Nose: small, perfectly shaped, refined, elegant
- Lips: perfectly shaped, naturally pink-tinted
- Overall impression: "this person looks like a goddess" — NOT "this person is okay-looking"
- Quality: Vogue Korea editorial, ultra-realistic, 8K resolution, professional studio photo
- ABSOLUTELY NO moles, beauty marks, spots, freckles, or any skin imperfections
```

### 3.3 최종 프롬프트 구조 (build_prompt)

멤버별 인덱스를 기반으로 아키타입·변형 풀에서 요소를 조합하여 고유한 프롬프트를 생성합니다.

```
Generate a portrait photo of a K-pop idol.

{VISUAL_QUALITY_MALE 또는 VISUAL_QUALITY_FEMALE}

FACE: {얼굴 아키타입}, {얼굴형}, {코 타입}, {민족 외모}
EYES: {눈꺼풀 타입}
HAIR: {머리색} hair, {헤어스타일}
AGE: {나이} years old
EXPRESSION: {표정}

The last 2 images are FACE BEAUTY REFERENCES — generate a NEW face at the SAME godlike level of attractiveness.
Do NOT copy the reference faces. Create an entirely new person who is EQUALLY stunning.

OUTFIT: Copy the EXACT outfit from the first 2-3 reference images (K-pop audition uniform).
BACKGROUND: solid light grayish-blue (cool muted pastel blue-gray, NOT pink, NOT white) — MANDATORY.
Soft flattering studio lighting.
- 1:1 square aspect ratio, upper body framing (chest up)
- Face centered, slightly above middle
- Shallow depth of field, subject in sharp focus

CRITICAL REQUIREMENTS:
- SKIN MUST BE 100% CLEAN AND CLEAR: absolutely NO moles, NO beauty marks, NO spots, NO freckles,
  NO blemishes, NO dots of any kind on the face or neck
- The skin must be perfectly smooth, flawless, porcelain-like with zero imperfections
- Generate a completely NEW unique face — do NOT copy any face from any reference image
- Use outfit references for clothing ONLY
- Use face references for beauty/attractiveness level ONLY — match or EXCEED their beauty
- The face must look like a TOP K-POP IDOL VISUAL (Cha Eunwoo / Song Kang level)
- Expression must be WARM, SOFT, and APPROACHABLE — never fierce, intense, or intimidating
- Background MUST be light grayish-blue
- ABSOLUTELY NO TEXT, no watermarks, no logos
- This must look like an ACTUAL top-tier K-pop idol's official profile photo, NOT AI-generated
```

### 3.4 변형 풀 (조합 요소)

**남성 얼굴 아키타입 (15종)**

| 인덱스 | 타입명 | 설명 |
|--------|--------|------|
| 0 | 시크 비주얼 (차은우 타입) | perfectly sculpted sharp jawline, intense magnetic eyes, high defined cheekbones, strong elegant brow bone, strikingly handsome |
| 1 | 꽃미남 비주얼 (뷔 타입) | elegant oval face with refined jawline, large captivating doe eyes, perfectly straight nose, impossibly handsome flower-boy beauty |
| 2 | 차가운 비주얼 (원빈 타입) | angular high cheekbones, narrow fox-like eyes with magnetic upward tilt, mysterious cold aura, razor-thin sharp jaw, breathtakingly handsome cold beauty |
| 3 | 클린 비주얼 (민현 타입) | small refined face with clean jawline, large clear eyes, delicate straight nose, natural lips, clean-cut impossibly handsome visual |
| 4 | 중성적 비주얼 (태용 타입) | long sculpted face, deep intense eyes, perfectly straight slim nose, androgynous ethereal godlike beauty |
| 5 | 정통 비주얼 (수호 타입) | classic balanced oval face, flawlessly harmonious features, clear piercing eyes, dignified regal visual, classically handsome |
| 6 | 강렬한 비주얼 (재범 타입) | strong defined jawline, thick dark eyebrows, deep-set intense eyes that command attention, prominent tall nose bridge, powerfully handsome |
| 7 | 인형 비주얼 (산 타입) | small perfectly proportioned face, extremely large doll-like eyes, tiny perfect nose, sculpted full lips, unreal doll-like beauty |
| 8 | 날카로운 비주얼 (현진 타입) | diamond face with razor-sharp jawline, narrow intense eyes with piercing gaze, high straight nose, devastatingly sharp handsome features |
| 9 | 성숙 비주얼 (진 타입) | broad handsome face with clean strong jaw, calm confident eyes, perfectly groomed eyebrows, mature reliable idol leader visual |
| 10 | 슬림 비주얼 (성찬 타입) | narrow elegant face with delicate bone structure, large luminous doe eyes, perfectly straight slim nose, ethereally beautiful slim visual |
| 11 | 세련된 비주얼 (민규 타입) | clean-cut sculpted jaw, confident elegant eyes, arched perfect eyebrows, high cheekbones, sophisticatedly handsome model visual |
| 12 | 청량 비주얼 (수빈 타입) | refined oval face with clean jawline, clear bright eyes, straight nose, fresh clean impossibly handsome visual, youthful but striking |
| 13 | 야성적 비주얼 (방찬 타입) | strong angular face with powerful jaw, slightly hooded intense magnetic eyes, thick dark brows, deeply handsome with raw charisma |
| 14 | 요정 비주얼 (연준 타입) | small delicate face with pointed chin, extremely large luminous eyes, tiny delicate nose, impossibly beautiful ethereal fairy-like male beauty |

**여성 얼굴 아키타입 (15종)**

| 인덱스 | 타입명 | 설명 |
|--------|--------|------|
| 0 | 청순 비주얼 (수지 타입) | soft elegant oval face, large captivating doe eyes, perfectly straight small nose, breathtakingly beautiful innocent visual |
| 1 | 걸크러시 비주얼 (제니 타입) | sharp sculpted jawline, fierce magnetic cat eyes with elegant upturn, strong defined brows, stunningly beautiful with powerful charisma |
| 2 | 인형 비주얼 (장원영 타입) | small perfectly proportioned doll-like face, extremely large round sparkling eyes, tiny upturned nose, rosebud lips, impossibly beautiful living doll |
| 3 | 글래머러스 비주얼 (지수 타입) | refined sculpted cheekbones, alluring elegant eyes, full defined lips, sharp chin, glamorously stunning idol beauty |
| 4 | 상큼 비주얼 (안유진 타입) | bright radiant face with perfect proportions, sparkling crescent eyes with irresistible charm, flawless rosy skin, dazzlingly beautiful sunny visual |
| 5 | 차가운 비주얼 (크리스탈 타입) | angular high cheekbones, narrow elegant fox eyes with cool magnetic gaze, straight slim nose, breathtakingly beautiful icy elegant queen visual |
| 6 | 청초 비주얼 (윤아 타입) | long delicate elegant face, gentle almond eyes, thin arched brows, stunningly beautiful classical Korean beauty |
| 7 | 러블리 비주얼 (카즈하 타입) | perfect heart-shaped face, large luminous puppy eyes, small cute nose, naturally pink lips, impossibly adorable yet stunningly beautiful |
| 8 | 몽환적 비주얼 (아이린 타입) | perfectly symmetrical ethereal features, large dreamy captivating eyes, flawless pale luminous skin, otherworldly stunning fairy-like beauty |
| 9 | 성숙 비주얼 (서현 타입) | elegant elongated face, sophisticated deep captivating eyes, refined jawline, stunningly beautiful mature model-like proportions, graceful beauty |
| 10 | 동양적 비주얼 (김고은 타입) | classic refined East Asian beauty, high sculpted cheekbones, delicate jawline, uniquely stunning natural beauty |
| 11 | 웨스턴 비주얼 (리사 타입) | deep-set large sparkling eyes, high nose bridge, defined striking facial contours, breathtakingly beautiful exotic visual |
| 12 | 청량 소녀 비주얼 (미연 타입) | small refined face with delicate features, wide clear luminous eyes, straight small nose, stunningly beautiful pure fresh-faced visual |
| 13 | 카리스마 비주얼 (화사 타입) | sculpted powerful face, piercing confident magnetic eyes, dramatically arched brows, commanding stunning beauty with fierce presence |
| 14 | 요정 비주얼 (카리나 타입) | petite perfectly proportioned face, extremely large luminous doe eyes, pointed delicate chin, impossibly beautiful magical fairy-tale visual |

**눈꺼풀 타입 (12종, 한국인 실제 비율 반영)**

- 약 40%: 무쌍/속쌍
- 약 30%: 얇은 쌍커풀
- 약 30%: 또렷한 쌍커풀

**표정 (8종)**

모두 따뜻하고 친근한 표정으로, 인상 쓰는 표정은 제외합니다.

- warm gentle smile, friendly soft eye contact, approachable
- natural relaxed expression with soft eyes, calm and pleasant
- bright cheerful smile showing warmth, sparkling kind eyes
- gentle closed-mouth smile, soft warm gaze, friendly demeanor
- natural expression with very subtle sweet smile, inviting
- serene peaceful expression, gentle warm eyes, comforting presence
- soft natural smile, relaxed and easygoing, bright eyes
- light playful smile, youthful and fresh energy, bright expression

**민족 외모 (16종)**

대부분 한국인 순수 외모, 16개 중 3개만 혼혈 느낌 적용:
- 한국-일본 혼혈 (softer refined features with subtle exotic charm)
- 한국-호주 혼혈 (slightly deeper-set eyes with warm skin undertone, subtle Western features)
- 한국-유럽 혼혈 (higher nose bridge, slightly deeper facial contours, striking visual)

**의상 스타일 (남성 10종 / 여성 8종)**

의상별 레퍼런스 이미지를 2-3장 함께 전달하여 동일한 오디션 프로그램 스타일을 유지합니다.

남성 의상:
`white_shirt`, `shirt_tie`, `black_vest`, `gray_vest`, `charcoal_blazer`,
`gray_blazer`, `black_blazer`, `gray_cardigan`, `check_vest`, `blazer_vest`

여성 의상:
`white_shirt`, `shirt_tie`, `black_vest`, `gray_blazer`, `black_blazer`,
`gray_cardigan`, `check_vest`, `blazer_vest`

### 3.5 레퍼런스 이미지 전달 방식

```
[의상 레퍼런스 2-3장 (outfit refs)] + [얼굴 퀄리티 레퍼런스 2장 (face refs)]
= 총 4-5장을 API contents에 함께 전달
```

- 의상 레퍼런스: 해당 의상 스타일의 기존 생성 이미지
- 얼굴 퀄리티 레퍼런스: 탑 비주얼 아이돌 실제 사진
  - 남성: 차은우, 송강, V(BTS), 원빈(라이즈), 현진, 펠릭스, 정국, 민규, 진
  - 여성: 장원영, 지수, 제니, 카리나

## 4. 아이돌 프로필 사진 생성 (v1 — 초기 버전, 36명)

### 4.1 사용 스크립트

`scripts/generate_profile_photos.py`

각 캐릭터를 수작업으로 묘사한 상세 프롬프트를 사용합니다.

### 4.2 프롬프트 구조

레퍼런스 이미지와 함께 전달합니다.

```
Korean {male/female} idol trainee, age {나이},
{얼굴형 및 이목구비 상세 묘사},
{헤어스타일 묘사},
{표정 묘사},
use the reference images for photographic style, lighting, background, outfit, and composition only,
do not copy any face from reference images, generate a completely new unique face
```

### 4.3 남성 프로필 20종 (v1)

캐릭터 유형별 요약:

| 번호 | 참고 스타일 | 특징 | 의상 |
|------|-------------|------|------|
| M01 | 부드러운 이목구비, 큰 눈 | soft oval face, large double-lidded eyes, comma bangs | white_shirt |
| M02 | 각진 턱, 날카로운 눈매 | angular jawline, narrow monolid eyes, straight thick eyebrows | white_shirt |
| M03 | 강렬한 이목구비, 풍성한 입술 | diamond face, hooded eyes, full plush lips, swept-back hair | black_blazer |
| M04 | 둥근 베이비페이스, 밝은 미소 | round face, cheerful eyes, dimples implied by wide smile | gray_blazer |
| M05 | 긴 얼굴, 중성적 차가운 비주얼 | long rectangular face, deep-set eyes, cold expression | blazer_vest |
| M06 | 정통 비주얼, 깔끔한 사이드 파트 | balanced oval face, sleek side-part, dignified smile | charcoal_blazer |
| M07 | 중간 얼굴, 부드러운 분위기 | medium oval face, natural double lid, soft neutral expression | black_vest |
| M08 | 슬림한 얼굴, 큰 둥근 눈, 곱슬머리 | narrow slim face, large round eyes, black curly hair | gray_vest |
| M09 | 부드러운 둥근 얼굴, 도톰한 입술 | soft round face, full plush lips, very curly fluffy hair | shirt_tie |
| M10 | 성숙한 시크 비주얼 | angular defined jawline, confident expression, upward-styled hair | black_blazer |
| M11 | 여리여리한 꽃미남 | heart-shaped face, cat-like upturned eyes, long curtain bangs | gray_cardigan |
| M12 | 든든한 맏형 리더 비주얼 | broad face, warm leader expression, neatly side-parted hair | blazer_vest |
| M13 | 밝은 장난기 | round face with dimples, warm brown layered perm, playful grin | check_vest |
| M14 | 날카로운 여우상 | V-line jaw, fox-like upturned eyes, silver wolf-cut, mysterious smirk | charcoal_blazer |
| M15 | 건강한 스포티 비주얼 | broad face, friendly gaze, short-medium textured crop | shirt_tie |
| M16 | 클래식 왕자님 | perfectly proportioned oval face, curtain bangs, princely expression | gray_blazer |
| M17 | 몽환적 감성형 | heart-shaped face, large round eyes with aegyo-sal, rose-brown wavy hair | gray_cardigan |
| M18 | 무심한 쿨가이 | oblong face, downturned eyes, messy bedhead hair | black_vest |
| M19 | 이국적 혼혈 느낌 | inverted triangle face, deep-set eyes, prominent nose | check_vest |
| M20 | 애교 만점 막내 | very small baby face, extremely large eyes, fluffy bangs | gray_vest |

### 4.4 여성 프로필 16종 (v1)

| 번호 | 참고 스타일 | 특징 | 의상 |
|------|-------------|------|------|
| F01 | 시크한 직모 흑발 청순미 | elegant oval face, long straight jet black hair, cool serene expression | black_vest |
| F02 | 금발 글래머러스 비주얼 | small V-line face, doll-like eyes, platinum blonde low side ponytail | blazer_vest |
| F03 | 갈색머리, 각진 광대, 시크 | angular cheekbones, fox-like eyes, warm brown half-up style | blazer_vest |
| F04 | 밝은 미소, 친근한 분위기 | soft round face, dark brown wavy hair, bright genuine smile | white_shirt |
| F05 | 긴 갈색머리, 따뜻한 미소 | balanced oval face, long brown S-wave hair, graceful smile | gray_blazer |
| F06 | 청순 흑발, 좁은 긴 얼굴 | narrow elongated face, very long straight black hair, ethereal expression | white_shirt |
| F07 | 큰 눈 인형상 | very small round face, extremely large eyes, dark brown twin tails | check_vest |
| F08 | 강한 걸크러시 | sharp V-line jaw, fierce upturned eyes, sleek low ponytail | black_blazer |
| F09 | 밝은 에너지 비타민 | compact oval face with dimples, high messy ponytail, energetic grin | gray_cardigan |
| F10 | 차가운 아이스 비주얼 | petite face, upturned eyes with cold gaze, ash brown straight hair | black_vest |
| F11 | 자연스러운 소녀미 | medium square-ish face, shoulder-length natural waves, casual smile | gray_blazer |
| F12 | 고혹적 성숙미 | diamond face, fox-like single-lid eyes, dark wine hair wavy lob | shirt_tie |
| F13 | 인형같은 블랙핑크 비주얼 | classic oval face, blunt-cut bangs, full rose lips, doll-like expression | gray_cardigan |
| F14 | 건강미 넘치는 운동 소녀 | broad features, warm complexion, neat high ponytail, determined smile | black_blazer |
| F15 | 청량한 여신 비주얼 | heart-shaped face, wide-set eyes, light ash brown waves, goddess elegance | check_vest |
| F16 | 보이시한 숏컷 매력 | compact angular face, very short black pixie cut, bold direct stare | black_vest |

## 5. 신규 연습생 프로필 사진 생성 (캐릭터별 맞춤)

### 5.1 사용 스크립트

`scripts/generate_new_trainee_photos.py`

### 5.2 비주얼 품질 공통 프롬프트 (간략 버전)

v3의 품질 프롬프트를 간략화한 버전입니다.

**남성**
```
CRITICAL: This person MUST look like a TOP K-POP IDOL VISUAL — the TOP 0.001% of male beauty.
The face in the FACE REFERENCE IMAGES shows the EXACT level of beauty required — match or EXCEED it.

ABSOLUTE REQUIREMENTS:
- Skin: FLAWLESS luminous glass skin, ZERO imperfections, NO moles, NO marks, NO spots
- Bone structure: perfectly sculpted jawline, golden-ratio facial proportions
- Quality: Vogue Korea editorial, ultra-realistic, 8K resolution, professional studio photo
- ABSOLUTELY NO moles, beauty marks, spots, freckles, or any skin imperfections
```

**여성**
```
CRITICAL: This person MUST look like a TOP K-POP IDOL VISUAL — the TOP 0.001% of female beauty.
The face in the FACE REFERENCE IMAGES shows the EXACT level of beauty required — match or EXCEED it.

ABSOLUTE REQUIREMENTS:
- Skin: FLAWLESS luminous glass skin, ZERO imperfections, NO moles, NO marks, NO spots
- Bone structure: delicate refined jawline, small perfectly shaped face
- Quality: Vogue Korea editorial, ultra-realistic, 8K resolution, professional studio photo
- ABSOLUTELY NO moles, beauty marks, spots, freckles, or any skin imperfections
```

### 5.3 최종 프롬프트 구조 (build_full_prompt)

```
Generate a portrait photo of a K-pop idol trainee.

{VISUAL_QUALITY_MALE 또는 VISUAL_QUALITY_FEMALE}

{캐릭터별 맞춤 프롬프트}

The last 2 images are FACE BEAUTY REFERENCES — generate a NEW face at the SAME level of attractiveness.
Do NOT copy the reference faces. Create an entirely new person who is EQUALLY stunning.

OUTFIT: Copy the EXACT outfit from the first 2-3 reference images (K-pop audition uniform).
BACKGROUND: solid light grayish-blue (cool muted pastel blue-gray) — MANDATORY.
Soft flattering studio lighting.
- 1:1 square aspect ratio, upper body framing (chest up)
- Face centered, slightly above middle
- Shallow depth of field, subject in sharp focus

CRITICAL:
- SKIN MUST BE 100% CLEAN: NO moles, NO beauty marks, NO spots, NO freckles
- Generate a completely NEW unique face
- Use outfit references for clothing ONLY
- Use face references for beauty level ONLY
- Background MUST be light grayish-blue
- ABSOLUTELY NO TEXT, no watermarks, no logos
```

### 5.4 캐릭터별 맞춤 프롬프트 (10명)

각 캐릭터의 서사와 개성을 반영한 프롬프트입니다.

**김준호 (남, 20세) — 브로드웨이 차일드 액터 출신**
```
Korean-American male idol trainee, age 20.
FACE: elegant oval face with theatrical expressiveness, large warm expressive double-lidded eyes that convey deep emotion,
naturally arched dramatic eyebrows, straight refined nose, full expressive lips with natural warmth.
HAIR: dark brown hair with soft natural wave, medium length, side-swept with volume, Broadway-actor charm.
EXPRESSION: warm charismatic stage-presence smile, eyes sparkling with theatrical energy, approachable and magnetic.
DISTINCTIVE: slight Western influence in bone structure (Korean-American), naturally dramatic eyebrows,
the kind of face that commands attention on a stage — born performer energy.
```

**이민혁 (남, 22세) — 런던 음대 중퇴 작곡 천재**
```
Korean male idol trainee, age 22, artist/musician aura.
FACE: narrow long face with sharp V-line jaw, slightly hollow cheeks giving artistic intensity,
deep-set monolid eyes with melancholic distant gaze, thin defined eyebrows, high straight nose bridge, thin pressed lips.
HAIR: jet black messy hair, long enough to fall over eyes, unkempt but stylishly disheveled —
the kind of hair that says "I was composing music at 3am and forgot to brush it." Slightly covering one eye.
EXPRESSION: pensive introspective look, no smile, gazing slightly off-camera as if hearing music in his head,
beautiful in a haunting, tortured-artist way. Pale luminous skin suggesting late nights in studios.
DISTINCTIVE: the most beautiful sad boy you've ever seen — like a young Chopin reborn as a K-pop trainee.
```

**박태양 (남, 20세) — 베트남-한국 혼혈, S급 괴물 신인**
```
Korean-Vietnamese mixed heritage male idol trainee, age 20, athletic build.
FACE: striking mixed features — Korean mother's refined bone structure with Vietnamese father's deeper-set warm eyes,
slightly broader nose bridge than pure Korean, warm golden-tan undertone to skin, sharp defined jawline,
prominent cheekbones, double-lidded eyes with intense focused gaze.
HAIR: jet black hair, short textured wolfcut with volume on top, face-framing pieces, effortlessly cool.
EXPRESSION: quiet confidence bordering on intensity, direct unwavering eye contact, slight tension in jaw
suggesting perfectionism, strikingly handsome in an exotic way that stops people in their tracks.
DISTINCTIVE: the kind of face that makes casting directors say "that's the one" — unmistakable star quality,
athletic build visible even in upper body, mixed heritage giving unique visual that stands out in any lineup.
```

**최서준 (남, 21세) — 인도네시아 체조 국가대표 출신**
```
Indonesian-Korean male idol trainee, age 21, former national gymnast.
FACE: slightly broader face with strong jawline, Indonesian heritage showing in warm deep skin tone
and slightly wider facial features, clear double-lidded eyes with determined focused gaze,
thick natural eyebrows, strong nose with slightly wider base, full natural lips.
HAIR: dark brown short clean-cut hair, neatly styled with forehead exposed, athletic clean look.
EXPRESSION: warm genuine smile with determined eyes — the face of someone who has overcome serious injury
and found a second dream. Bright positive energy despite the hardship behind him.
DISTINCTIVE: noticeably athletic build visible in broader shoulders and neck, healthy glowing skin
from years of physical training, Southeast Asian warmth in his features.
```

**정도영 (남, 19세) — 영재고 자퇴 래퍼, 건방진 천재**
```
Korean male idol trainee, age 19, genius dropout turned rapper.
FACE: sharp angular face with high cheekbones, narrow fox-like monolid eyes with a knowing, almost arrogant gaze,
thin sharp eyebrows with natural arch, straight prominent nose, defined lips with a perpetual slight smirk.
HAIR: jet black hair, trendy two-block cut with longer messy top, slightly pushed back on one side,
a hairstyle that says "I'm too smart to care but I look good anyway."
EXPRESSION: confident asymmetric smirk, one eyebrow slightly raised, looking directly at camera
with an air of intellectual superiority that somehow comes across as charismatic rather than annoying.
Cool detached energy, like he's already calculated the odds and knows he'll win.
DISTINCTIVE: intelligence visible in his sharp eyes, the kind of face that's equal parts punchable and magnetic.
```

**최지유 (여, 22세) — 판소리 명창 손녀, 전통 x 현대 보컬**
```
Korean female idol trainee, age 22, granddaughter of a pansori master.
FACE: classic refined Korean beauty — long elegant oval face with delicate jawline,
calm deep monolid eyes with inner double fold (sok-ssang) that hold centuries of Korean artistic tradition,
naturally thin arched eyebrows, straight delicate nose, medium lips with natural pale pink.
HAIR: jet black very long straight hair reaching mid-back, precise center part, glass-like traditional sheen —
the kind of traditional Korean beauty hair that pansori performers are known for.
EXPRESSION: serene composed expression with quiet inner strength, no smile, calm direct gaze —
the face of someone who has trained in discipline since age 5. Elegant and timeless, not trendy.
DISTINCTIVE: unmistakably classical Korean beauty, the kind of face you'd see in a Joseon dynasty painting
but with a modern K-pop idol's flawless skin. An old soul in a young face.
```

**정서현 (여, 18세) — 3일차 완전 신입, 비주얼만 극강**
```
Korean female idol trainee, age 18, just joined 3 days ago — pure raw visual talent.
FACE: breathtakingly perfect face — small doll-like proportions, extremely large round sparkling eyes
with wide double lids and prominent aegyo-sal, tiny perfectly upturned button nose,
rosebud lips with natural cherry pink, flawless porcelain skin with natural dewy glow.
Heart-shaped face with delicate pointed chin.
HAIR: dark brown long hair with soft natural waves, wispy curtain bangs at eyebrow level,
face-framing layers — effortlessly pretty without trying.
EXPRESSION: wide-eyed innocent look of someone who doesn't know why she's here but the camera loves her.
Slightly surprised, naturally photogenic from every angle, zero nervousness in front of camera.
DISTINCTIVE: the most stunning face in the room but completely unaware of it.
Like a young Jang Wonyoung who hasn't realized she's beautiful yet. Natural, unposed, effortless.
```

**강은채 (여, 21세) — 실명 위기 극복, 감정 표현의 천재**
```
Korean female idol trainee, age 21, overcame near-blindness — deeply emotional presence.
FACE: soft heart-shaped face with gentle jawline, large luminous double-lidded eyes that seem to hold
deep emotion and gratitude — eyes that have known darkness and now drink in every ray of light,
softly arched natural eyebrows, small refined nose, medium lips with gentle natural pink.
HAIR: dark brown hair, shoulder-length with soft waves, side-parted and tucked behind one ear,
gentle and approachable styling.
EXPRESSION: the most moving expression you've ever seen — a gentle smile that carries both sadness and joy,
eyes glistening with barely contained emotion, warm and vulnerable. The kind of face that makes
people feel something just by looking at it.
DISTINCTIVE: there's a depth in her eyes that other trainees don't have — you can tell this person
has experienced something profound. Fragile beauty with inner steel.
```

**조수아 (여, 19세) — KAIST 포기한 AI 프로그래머, 온오프 스위치**
```
Korean female idol trainee, age 19, former science prodigy — analytical yet emotional on stage.
FACE: clean sharp face with defined jawline suggesting intellectual precision,
slightly narrower double-lidded eyes with intelligent analytical gaze, neat straight eyebrows,
straight small nose, thin defined lips — a face that looks like it's always thinking.
HAIR: jet black straight hair in a neat shoulder-length bob with blunt-cut ends,
precise center part — clean, minimal, mathematical precision in her styling.
EXPRESSION: calm neutral expression with a hint of curiosity, direct eye contact,
slight tilt of the head as if analyzing the camera — the face of someone who approaches
everything including beauty with scientific methodology. Cool and composed.
DISTINCTIVE: the unexpected contrast — this face looks like it belongs in a lab coat
but is somehow stunningly beautiful in a way that catches you off guard.
Sharp intelligence visible in every feature.
```

**윤민지 (여, 20세) — 울산 조선소 딸, 가난했지만 보컬 천재**
```
Korean female idol trainee, age 20, from a working-class shipyard family — powerful vocal prodigy.
FACE: slightly broader face with strong healthy bone structure, round-ish face shape with soft jawline,
natural double-lidded eyes with warm determined gaze, thick natural eyebrows,
average nose with slightly rounded tip, full natural lips with warm coral tone.
HAIR: dark brown hair with natural slight wave, medium length past shoulders,
simple low ponytail — practical, no-nonsense styling of someone who doesn't fuss over appearance.
EXPRESSION: strong warm smile with determined eyes — the face of someone who worked part-time jobs
to afford training fees and is here on pure grit. Not the prettiest face in the room
but the one you can't stop watching. Natural healthy glow from genuine inner strength.
DISTINCTIVE: healthy warm complexion, slightly sun-kissed skin, broader shoulders than typical idols.
The kind of face that tells a story — not manufactured beauty but real, earned, authentic presence.
```

## 6. 단일 프로필 재생성 (레퍼런스 기반 front-facing 변환)

### 6.1 사용 스크립트

`scripts/generate_single_profile.py`

기존 이미지를 레퍼런스로 받아 동일 인물의 정면 프로필 사진을 생성합니다.

### 6.2 프롬프트

```
Generate a front-facing portrait photo of this EXACT same person.

CRITICAL: The generated image must show the SAME person from the reference photo.
Preserve EVERY facial feature exactly:
- The same face shape, jawline, bone structure
- The same eyes (shape, size, depth, gaze quality)
- The same nose (bridge height, tip shape, width)
- The same lips (shape, fullness, color)
- The same small tear mole below the left eye — this is a KEY identifying feature, do NOT remove it
- The same jet black hair color and soft texture
- The same pale luminous skin tone
- The same melancholic, slightly sad and vulnerable aura

CHANGES FROM REFERENCE (only these):
- POSE: Turn to face the camera DIRECTLY — straight-on front-facing view, symmetrical
- EXPRESSION: Same gentle melancholic expression, sad beautiful eyes looking straight at camera
- HAIR: Same jet black hair, soft down bangs at eyebrow level, but neatly styled for a front-facing ID-style portrait
- OUTFIT: Clean white crew-neck t-shirt (simple, minimal)
- BACKGROUND: Solid light grayish-blue (cool muted pastel blue-gray)
- LIGHTING: Soft even studio lighting, flattering, no harsh shadows
- FRAMING: 1:1 square, upper body (chest up), face centered

QUALITY: Vogue Korea editorial, ultra-realistic, 8K resolution
ABSOLUTELY NO TEXT, no watermarks, no logos.
This must look like the same person's official K-pop idol profile photo, taken from the front.
```

## 7. 공통 사항

### 7.1 모델 및 API 설정

| 항목 | 값 |
|------|----|
| 모델 | `gemini-3-pro-image-preview` |
| 라이브러리 | `google-genai`, `Pillow` |
| 종횡비 | `1:1` |
| response_modalities | `["TEXT", "IMAGE"]` |
| 환경변수 | `GOOGLE_API_KEY` |

### 7.2 배경색 통일

모든 프로필 사진은 동일한 배경색을 사용합니다.

```
light grayish-blue (cool muted pastel blue-gray, NOT pink, NOT white)
```

### 7.3 공통 금지 사항

프로필 사진 생성 시 모든 스크립트에서 공통으로 적용되는 금지 사항입니다.

- 피부의 점, 잡티, 주근깨 등 일체의 피부 결점 금지
- 텍스트, 워터마크, 로고 금지
- 레퍼런스 이미지의 얼굴 복사 금지 (의상 레퍼런스는 의상에만 사용)
- 무섭거나 강렬한 표정 금지 (프로필 사진은 항상 따뜻하고 친근하게)
