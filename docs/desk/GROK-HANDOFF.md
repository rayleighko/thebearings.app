# 살까말까 연구소 — Grok 핸드오프

다른 에이전트(그록 봇)가 이 레포에서 작업을 이어갈 때 **이 파일부터** 읽는다.  
Cohort(투자 페이스)와 섞지 말 것. 이 줄은 데스크 제휴 숏폼 + 샵 페이지만 다룬다.

운영자: Rayleigh. 채널: **살까말까 연구소** (`@sal-kka-lab` / 네이버 `salkkalab`).  
사이트: `https://desk.thebearings.app` (라이브 카탈로그 `/dev`).  
레포: `thebrearings` (브랜치 작업은 desk 관련 PR 후 `main`에 머지된 상태일 수 있음).

---

## 0. 지금 뭐 하는 중인가 (한 줄)

한국 책상 용품. 같은 9:16을 유튜브+네이버에 올린다.  
유튜브 쇼츠 **댓글/설명 링크는 클릭 불가**. 네이버는 커넥트 **카드**가 클릭면. 본인 제휴 링크는 누르지 않는다.

**2026-08-19 저녁 기준 — 코드 스프린트 정지. 지표 대기.**

끝난 것: ep1–3 업로드, desk UX(히어로/가격 숨김, AG100 슬러그, 살까말까 아이콘), desk 사이트맵, www 어필리에이트 홈, `/regime` 아카이브.  
검색 등록(GSC desk 사이트맵 + 네이버 desk 소유확인)도 운영자가 마침. `docs/desk/search-console.md`.

지금: **유튜브 쇼츠 설명·댓글 URL은 클릭 불가** (YouTube Help, 2023-08-31~, 2026에도 유효). 546뷰 0쿠팡은 포맷 실패가 아니라 **측정 이벤트가 없는 구조**. 내일은 쿠팡 YT 클릭으로 성패를 가르지 말 것. 볼 것: 네이버 커넥트(카드) 클릭, YT 시청유지·저장, 프로필→desk 히트.  
이미 올린 1–3편 CTA는 `링크는 댓글에 있어요.` 다음 편은 `프로필에 목록 있어요.` (§3).

---

## 0b. 역할과 루틴

| 누구 | 하는 일 |
|---|---|
| **Cursor (이 챗)** | 그록 매니저. 판단, 잠금, PR 범위, “지금 그록이 해도 되나”. 결과물 검수 요청을 운영자에게 넘김 |
| **그록 봇** | 실행. 대본 JSON, 스톡, 렌더, `youtube.md`/`naver.md`, §6 표 기입. 업로드·Typecast 클릭은 안 함 |
| **운영자 (Rayleigh)** | Typecast, 업로드, 고정 댓글, 커넥트 부착, 대시보드 캡처. 그록 산출물 검수. 본인 링크 안 누름 |

루틴 (한 바퀴): **상품 확정 → 그록 대본/렌더 → 운영자 Typecast·업로드·링크 → 1–3일 지표 → Cursor가 다음 바퀴 허용.**  
사이트 이중 CTA / 블로그 / 사업자 / ep4는 §10 게이트 통과 후에만.

대기 중 그록이 **해도 되는 유일한 일:** 운영자가 준 숫자를 §6에 한 줄. 유튜브 쿠팡 CTR로 포맷 성패를 말하지 말 것. 렌더·새 SKU·코드 금지.

대기 중 그록이 **하면 안 되는 일:** ep4, 틱톡, 빈 블로그 글, 사이트맵 재제출, 콜라주 UI, Cohort 작업.

---

## 1. 찾을 때 힌트 (검색 키워드)

| 찾는 것 | 열 파일 / 검색어 |
|---|---|
| 이 핸드오프 | `docs/desk/GROK-HANDOFF.md` |
| 운영 회고·지표 판정 | `docs/desk/retro-2026-08-18.md` |
| 대본 잠금 (예슬/4줄/CTA) | `.cursor/skills/desk-shortform-script/SKILL.md` → `src/data/shortform-script.ts` |
| 편별 대본 JSON | `content/desk/uploads/{nn}-{sku}/script.json` |
| 업로드 복붙 | 같은 폴더 `youtube.md` / `naver.md` |
| 올릴 큐 | `content/desk/uploads/README.md` |
| 스톡·라이선스 규칙 | `docs/desk/shortform-asset-pipeline.md` |
| 카탈로그·쿠팡 URL | `src/data/concepts.ts` (`productUrl`, `DEV_OFFICIAL_CDN_THUMBS`) |
| 렌더 ep2 / ep3 | `scripts/desk/render-ep2.ts` · `render-ep3.ts` (`pnpm desk:render-ep2` / `desk:render-ep3`) |
| 자막 PNG | `scripts/desk/render-caption-plate.swift` (`--safe-bottom 720`) |
| 스톡 다운 | `scripts/desk/fetch-stock-clips.ts` / `pnpm desk:fetch-stock` |
| 컷아웃 | `scripts/desk/cutout-official-thumbs.ts` / `public/desk/dev/{id}.png` |
| Typecast 출력 | `pnpm desk:print-script -- --file=...` |
| `go` 클릭 로그 (영상 CTA 아님) | `src/app/go/[slug]/route.ts` → Supabase `clicks` / `supabase/migrations/0015_clicks.sql` |
| 데스크 UI | `src/app/desk/` · `src/components/desk/DeskBrand.tsx` |
| 검색 등록 (GSC/네이버) | `docs/desk/search-console.md` — **완료.** www 재등록·`go` 등록 금지 |
| 블로그 스캐폴드 | `content/desk/blog/` · `src/app/desk/blog/` |
| pnpm 스크립트 | `package.json` 의 `desk:*` |

`mp4` / `wav` 는 gitignore. 로컬만: `content/desk/uploads/**` 와 `tmp/desk-stock/`.

---

## 2. 채널과 사이트 (섞지 말 것)

| 면 | 역할 |
|---|---|
| 유튜브 쇼츠 | **설명·고정 댓글 URL은 클릭 불가** ([YouTube Help](https://support.google.com/youtube/answer/13748639)). 댓글 쿠팡은 고지·복붙용. 클릭 가능한 외부 경로는 **채널 프로필** 또는(자격 되면) 쇼핑 태그 |
| 네이버 클립 | **실제 클릭면** = 쇼핑 커넥트 상품 카드. 댓글 `naver.me`는 보조 |
| `desk.thebearings.app` | 리스트 카탈로그. **유튜브 프로필에 이 URL.** 비교를 여기서 끝내고 카드→`go` |
| `go.thebearings.app/{slug}` | desk 카드 클릭 로그 후 쿠팡 302. 영상 VO·쇼츠 댓글 CTA로 쓰지 않음 |

한 영상에 쿠팡과 네이버를 섞지 않는다. 공동구매(BETA) 안 함. 물/생수 등 데스크 밖 SKU 안 함.

### 라이브 SKU (쿠팡)

| slug | 상품 | 파트너스 |
|---|---|---|
| `arm-nb-f80` | 싱글 모니터암 | `https://link.coupang.com/a/gi6GpRFFBI` |
| `lamp-screenbar` | 스크린바 | `https://link.coupang.com/a/gi7YPbNxdY` |
| `stand-laptop` | 노트북 스탠드 | `https://link.coupang.com/a/gi6MkDloqW` |
| `kbd-keychron-k8` | 키보드 | `https://link.coupang.com/a/gi61Ks22XA` |
| `mouse-ag100` | 마우스 AG100 (box AG010 / listing AG0101) | `https://link.coupang.com/a/gi79m3yxFY` (already ATWO AG010). Alias: `mouse-mx-master` |

네이버 F80 검정 (1·2편): `https://naver.me/5K6ntkF6`. 스크린바용 `naver.me`는 운영자가 커넥트에서 발급.

---

## 3. 잠금 (지표 없이 바꾸지 말 것)

1. 9:16 마스터 **하나**. 네이버 전용 비율 없음. 가림은 하단 카드 → 자막 **아래 720px**, 스티커 **800px**.
2. Typecast: 배우 **예슬**, 감정 **일반**, 배속 **1.0x**, 해요체 4줄. 대본에 `<|0.2s|>` / `[0.2s]` 넣지 않음. 스튜디오에서 앞 3문장 `[0.2s 추가]`.
3. 화면 `[광고]` / 로고 스팅 없음 (6편 전). 고지는 설명 첫 줄 `[광고]` + 유튜브 유료 광고 체크. 쇼츠 댓글 쿠팡 URL은 고지용이지 클릭 경로가 아님.
4. 다음 편 VO 4줄: `프로필에 목록 있어요.` 프로필 = `https://desk.thebearings.app/dev`. 네이버 클릭면은 상품 카드. 번역 댓글 우회 금지.
5. 훅은 **파는 SKU**를 가리킨다. 의자를 미끼로 쓰고 암을 팔지 않음 (2편 교훈).
6. 첫 1초 = 통증. ~5초 제품 스티커. 이전 편 클립 재사용 금지.
7. 본인 파트너스/커넥트 링크 클릭 금지. 누르면 그 클릭은 0으로 읽거나 `clicks` 행을 뺀다.
8. 같은 날 쇼츠 과다 금지. 업로드 자동화·비공식 업로더·Coupang 페이지 스크래핑 금지.
9. Option B 스캔이 `src/` 의 `추천`을 잡는다. 데스크 배지는 `이 영상` (이미 반영).

대본 스키마: `parseShortformScript` (`src/data/shortform-script.ts`). 테스트: `src/data/__tests__/shortform-script.test.ts`.

### 3b. 네 줄은 설명문이 아니라 클릭 설계 (다음 편부터)

운영자 검수 2026-08-19: 올린 편은 **AI 스톡+TTS**에 **결론이 영상 안에서 닫혀** 지나가는 팁처럼 들린다. 조회 붐 + 쿠팡 0과 같은 방향.

다음 편 라인 역할 (SKILL과 동일):

1. 이 책상에서 알아보는 통증 (자기인식)
2. 이미 해본 틀린 처방
3. SKU 이름은 말하되 **다는 법/고르는 기준 하나는 프로필·카드에** (열린 고리). “달면 해결돼요”로 닫지 말 것
4. 다음 편부터: `프로필에 목록 있어요.` (유튜브 클릭면). 이미 올린 1–3편 CTA는 그대로 둠.

하지 말 것: 지금 사세요 / 한정 / 꼭 사야 / 추천 / 가짜 후기 / 공포 과장. 쇼츠에서 그건 신뢰만 깎고 제휴 고지와도 안 맞음.

AI 느낌의 본진은 대본보다 **남의 책상 클립 + 예슬 TTS**. 다음 편에 운영자 모니터/암/바 5초가 있으면 그록은 그걸 훅 클립으로 쓴다. 없어도 ep4를 지금 렌더하지 말 것 — 클릭 게이트(§10)가 먼저.

---

## 4. 영상 파이프라인 (로컬)

운영자가 촬영하지 않음. Pexels 라이선스 클립 + 공식 쿠팡 썸네일 컷아웃 + Typecast VO.

```
대본 script.json
  → pnpm desk:print-script   (Typecast 네 줄 + 유튜브 복붙)
  → 운영자 Typecast에서 wav 저장 (git 밖)
  → pnpm desk:fetch-stock -- --sku={slug}   (없으면)
  → render (ffmpeg 9:16 + 자막 플레이트 + 스티커 + VO)
  → content/desk/uploads/{nn}-{sku}/video.mp4
  → 운영자 업로드 (유튜브 스튜디오 / 네이버 클립은 폰)
  → 즉시 고정·댓글
```

### 명령

```bash
# 대본 출력
pnpm desk:print-script -- --file=content/desk/uploads/03-lamp-screenbar/script.json

# 스톡 (PEXELS_API_KEY 는 .env.local 만)
pnpm desk:fetch-stock -- --sku=lamp-screenbar

# 2편 / 3편 렌더
pnpm desk:render-ep2
pnpm desk:render-ep3

# 컷아웃이 비면
pnpm desk:cutout-thumbs
```

`desk:render-ep3` **있음** (`scripts/desk/render-ep3.ts`). 3편을 다시 뽑을 때:

- VO: `content/desk/uploads/03-lamp-screenbar/vo.wav` (로컬, 약 9.3s)
- 스티커: `public/desk/dev/lamp-screenbar.png`
- 클립: `tmp/desk-stock/clips/` 의 **스크린바 쿼리** 파일. `arm-nb-f80-*` 쓰지 말 것
- 자막 4줄 = `script.json` `vo.lines` (마지막 줄 마침표 없이 플레이트에 넣어도 됨)
- `CAPTION_SAFE_BOTTOM = 720`, `STICKER_SAFE_BOTTOM = 800`
- 출력: `content/desk/uploads/03-lamp-screenbar/video.mp4`
- 유튜브 CTA는 **암 링크 아님** `https://link.coupang.com/a/gi7YPbNxdY`

자막 플레이트: Homebrew ffmpeg에 `drawtext` 없음 → Swift PNG + overlay.

스톡 쿼리: `src/data/desk-stock-queries.ts`.

ep1 구형 렌더(`pnpm desk:render-ep1` / capcut-cli)는 참고만. 신규 편은 ep2 패턴.

### 업로드 체크

유튜브: 아동용 아님 · 유료 광고 켜기 · 재생목록 `데스크` · 썸네일=영상에서 · 관련 동영상/엔드스크린 스킵.  
네이버: 앱만 업로드. AirDrop mp4. 상품 픽셀과 다른 SKU를 붙이지 말 것 (표시광고).

---

## 5. 지표 — 어디에 있나

레포 안에 자동 대시보드는 없다. **사람이 숫자를 이 문서 §6 표에 적는다.**  
회고 판정은 `docs/desk/retro-2026-08-18.md`.

| 소스 | 보는 숫자 | 비고 |
|---|---|---|
| 쿠팡 파트너스 → 일별 실적 | 클릭·구매·수익 | desk/`go`/네이버/복붙/본인이 섞임. **쇼츠 댓글 CTR로 읽지 말 것** |
| 네이버 브랜드 커넥트 → 쇼핑 커넥트 | 클릭·주문 | 네이버만. 기간이 하루 늦을 수 있음 |
| 유튜브 스튜디오 → 실시간 / 쇼츠 목록 | 조회·댓글 | 28일 개요는 2일 지연. AI 요약은 빈 구간을 읽으면 무시 |
| 유튜브 해당 영상 분석 | **평균 시청 시간(초/%)** | `계속 시청함`은 “다음 내 쇼츠로 이어감”. 쇼츠 2개면 낮음. 이탈률 아님 |
| 네이버 클립 분석 / 내 클립 | 조회·팔로워 | 배포 신호. 조회 한 자리면 포맷 결론 내지 말 것 |
| Supabase `clicks` | `go.` 를 밟은 행 | 영상 CTA가 `go.`가 아니면 거의 비어 있음. 서비스 롤만 insert |
| 채널 홈 | `desk.thebearings.app` | 프로필 링크. 클릭은 쿠팡과 별개 |
| Vercel Analytics | desk pageviews | Desk layout only. PostHog is Cohort-only (root skips desk/go). No extra env key |

조회 ÷ 클릭 ≈ CTR 감만. 모니터암/스크린바는 당일 전환이 드묾. 구매 0으로 SKU 버리지 말 것.

YouTube Studio AI가 `의자 추천` 같은 키워드를 제안하면 무시 (잘못된 제품 + `추천` 금지).

---

## 6. 지표 로그 (에이전트가 행을 추가)

날짜는 운영자 로컬(KST). 본인 클릭은 괄호로 표시하고 판정에서 뺀다.

| 날짜 | 편 | 플랫폼 | 조회 | AVD | 클릭 | 구매 | 메모 |
|---|---|---|---|---|---|---|---|
| 2026-08-18 | 1 암 | YT | 초반 ~192, 클릭≈0 | ~6s/9s (초반) | 설명에 `go.` 였음 | 0 | 피드 99%. 댓글 전 |
| 2026-08-18 | 2 암 | YT | — | — | — | 0 | 당일 공개 |
| 2026-08-19 16:30 | 1+2 암 | 쿠팡 | YT 합 357 | (미집계) | **7** (본인 1 가능, 19일 +6) | 0 | CTR≈2%. 댓글 단 뒤 |
| 2026-08-19 | 2 암 | 네이버 | 3 | — | 1 (본인일 수 있음) | 0 | 클립 1개만. 배포 문제 |
| 2026-08-19 | 2 암 | YT Studio AI | 165 | `계속 시청함` 7.06% (이어보기, AVD 아님) | — | — | 훅≠의자 미끼 교훈 |
| 2026-08-19 17:00 | 3 스크린바 | local | 마스터 9.30s | — | — | 0 | 렌더 완료. 암 클립/링크 안 씀. 이후 YT+네이버 업로드 |
| 2026-08-19 21:10 | 3 스크린바 | YT | **546** | — | 쿠팡 0 (당일) | 0 | 피드 붐. 댓글 1(고정). 1·2편은 192 / 166. 클릭 대기는 정상 |
| 2026-08-19 21:10 | 1 암 | YT | 192 | — | (암 링크 합산) | — | 스튜디오 목록 |
| 2026-08-19 21:10 | 2 암 | YT | 166 | — | (암 링크 합산) | — | 스튜디오 목록 |

1편 YT 설명은 2026-08-19에 쿠팡으로 교체함. 이후 `go.` 클릭은 기댓값 낮음.

**2026-08-19 21:10 판정:** 3편 조회 붐 ≠ 실패. 쇼츠는 설명/댓글 탭이 드물고 쿠팡 집계도 하루 늦을 수 있음. ep4 안 함. 8/20–21에 `gi7YPbNxdY` 클릭만 보면 됨.

---

## 7. 이미 올린 편

| 편 | SKU | 훅 | YT | 네이버 |
|---|---|---|---|---|
| 01 | `arm-nb-f80` | 고개 앞으로 빠지지 않음? | 공개. 재생목록 데스크 | 그리드에 없을 수 있음 → 올리기 |
| 02 | `arm-nb-f80` | 목 아픈데 의자만 바꿔요? | 공개 | 재업로드(자막 720). 상품 F80 검정 |
| 03 | `lamp-screenbar` | 모니터가 눈부셔요? | 공개 | 공개. 스크린바 커넥트(F80 금지). `naver.me`는 업로드 팩에 적을 것 |

---

## 8. 그록이 해도 되는 일 / 금지

매니저(Cursor)가 “실행하라”고 쓰기 전에는 §0b 대기 규칙이 이 목록보다 앞선다.

**해도 됨 (게이트 통과 후 또는 매니저 지시)**

- §6 표에 운영자가 준 숫자 추가 + 회고 한 줄
- 훅이 SKU와 같은지 대본 검수
- `script.json` + `desk:print-script` + `desk:fetch-stock` + `render-ep2` 패턴 렌더
- 데스크 UI 버그 수정 (로고·리스트·세이프존은 이미 있음)
- 지표가 온 뒤에만: 사이트 이중 CTA, §11을 통과한 다음 편, 전환 SKU 글 하나

**하지 말 것**

- 유튜브/네이버 비공식 업로드 봇
- 본인 제휴 링크 테스트 클릭
- 물·생수·거북목 베개 등 데스크 밖 피벗
- 공동구매 링크 발급
- 영상 VO에 `go.` 를 넣기 (모르는 도메인)
- 쇼츠 댓글 링크가 클릭된다고 가정하고 A/B
- 번역 버튼으로 댓글 URL 우회
- 3편 대본을 다시 렌더해 CTA만 바꾸기 (이미 공개)
- 지표 오기 전 ep4 렌더·틱톡·블로그 본문·사업자 푸터
- `supabase/config.toml` 로컬 PG 버전 커밋
- `--no-verify` / force push
- Cohort 랜딩/오로라 카피를 데스크에 심기

막히면 운영자에게 물어라. 업로드와 Typecast 스튜디오 클릭은 사람만 한다.

---

## 9. 3편 복붙 (렌더 후 운영자)

**유튜브 고정 댓글**

```
링크는 여기
https://link.coupang.com/a/gi7YPbNxdY
```

설명 첫 줄: `[광고] 모니터가 눈부시면 천장 불부터 보면 됨.`  
태그: `스크린바, 모니터조명, 눈피로, 데스크셋업, 살까말까연구소`

네이버 댓글: 커넥트에서 받은 스크린바 `naver.me` (F80 링크 쓰지 말 것).

---

## 10. 다음 작업 (지표 게이트)

코드 스프린트는 여기까지. 아래 1번 숫자가 오기 전에 2–4를 시작하지 않는다.

1. **운영자 클릭면 점검 (내일, 영상 새로 안 만듦)** — 유튜브 스튜디오 → 수익 창출 → 쇼핑 탭(자격 여부). 채널 프로필 링크 = `https://desk.thebearings.app/dev`. 네이버 클립에 **상품 카드**가 붙어 있는지(댓글만이면 카드부터).
2. **지표** — 네이버 커넥트 클릭(진짜 클릭). 유튜브는 시청 유지·저장(댓글 쿠팡 CTR 쓰지 말 것). Vercel/desk 유입은 프로필 단 뒤.
3. **다음 숏폼** — §11 기준을 통과한 SKU. 노트북 스탠드는 단독 히어로 금지(애드온). 같은 날 두 편 금지.
4. **첫 글** — 구매가 찍힌 SKU 하나만. `/blog` 스텁 유지.
5. **사업자** — 수익 난 뒤.

---

## 11. SKU 선정 기준 (쿠팡)

리서치 2026-08-19 종합. 파트너스 기본은 **클릭 후 24시간** 결제(창 안 장바구니 포함 가능). “나중에 비교하고 사”는 조회만 주고 수수료 0이 되기 쉽다.

**통과하려면 전부:**

1. **3초 비주얼** — before/after가 한 프레임에서 보임. 그림이 안 바뀌면 단독 금지.
2. **결정 게이트 ≤ 1** — 영상에 한 줄로 닫을 수 있음 (VESA 100이면 됨). 게이트 4개면 검색으로 샌다.
3. **가격 띠가 좁음** — 3만/8만/19만이 공존하면 숏폼은 욕망만 만들고 쿠팡에서 비교 시작. 저가 한 리스팅이거나, 비교는 desk에서 끝내고 링크를 누르게.
4. **당일 결제 가능** — 호환성 숙제가 숙제 노트면 비추천.
5. **썸네일 = 영상 스티커** — 첫 이미지가 다른 색/각도면 이탈.
6. **성숙 카테고리 아님** — 리뷰 수만 단위 + 별 4.5면 숏폼 정보 우위 없음.

**역할:**

| SKU | 역할 | 한 줄 |
|---|---|---|
| `arm-nb-f80` | 앵커·계측 | 시각 임팩트. VESA만 닫으면 당일 결제 가능. 첫 전환 데이터는 여기 |
| `lamp-screenbar` | 욕망 | 저가 한 리스팅만. 커브드/노트북 불가 한 줄. 벤큐급 숏폼 금지. 비교 3칸은 desk |
| `stand-laptop` | 애드온 | 단독 편 금지. 암/바 클릭 24시간 창에만 |
| 키보드·마우스 | 보류 | 위 6항 통과 전 히어로 아님 |

고르지 말 것: 수수료가 커서. 고를 것: **사람을 당일 쇼핑 앱에 들여보내는가.** 데스크 밖 SKU는 영상으로 열지 않음.
