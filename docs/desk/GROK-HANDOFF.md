# 살까말까 연구소 — Grok 핸드오프

다른 에이전트(그록 봇)가 이 레포에서 작업을 이어갈 때 **이 파일부터** 읽는다.  
Cohort(투자 페이스)와 섞지 말 것. 이 줄은 데스크 제휴 숏폼 + 샵 페이지만 다룬다.

운영자: Rayleigh. 채널: **살까말까 연구소** (`@sal-kka-lab` / 네이버 `salkkalab`).  
사이트: `https://desk.thebearings.app` (라이브 카탈로그 `/dev`).  
레포: `thebrearings` (브랜치 작업은 desk 관련 PR 후 `main`에 머지된 상태일 수 있음).

---

## 0. 지금 뭐 하는 중인가 (한 줄)

한국 책상 용품을 **유튜브 쇼츠 = 쿠팡 파트너스**, **네이버 클립 = 쇼핑 커넥트**로 나눠 판다.  
같은 9:16 마스터를 두 곳에 올린다. 클릭이 KPI, 조회수는 보조. 본인 제휴 링크는 누르지 않는다.

**다음 할 일 (2026-08-19):** 3편 스크린바 **업로드** (유튜브+네이버). 마스터는 로컬 준비됨.  
실험 변수는 SKU/통증만. CTA 문장은 아직 `링크는 댓글에 있어요.` (`아래`는 4편).

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
| 렌더 ep2 (복제할 스크립트) | `scripts/desk/render-ep2.ts` |
| 자막 PNG | `scripts/desk/render-caption-plate.swift` (`--safe-bottom 720`) |
| 스톡 다운 | `scripts/desk/fetch-stock-clips.ts` / `pnpm desk:fetch-stock` |
| 컷아웃 | `scripts/desk/cutout-official-thumbs.ts` / `public/desk/dev/{id}.png` |
| Typecast 출력 | `pnpm desk:print-script -- --file=...` |
| `go` 클릭 로그 (영상 CTA 아님) | `src/app/go/[slug]/route.ts` → Supabase `clicks` / `supabase/migrations/0015_clicks.sql` |
| 데스크 UI | `src/app/desk/` · `src/components/desk/DeskBrand.tsx` |
| 검색 등록 (GSC/네이버) | `docs/desk/search-console.md` — www 재등록 금지. desk 사이트맵만 |
| 블로그 스캐폴드 | `content/desk/blog/` · `src/app/desk/blog/` |
| pnpm 스크립트 | `package.json` 의 `desk:*` |

`mp4` / `wav` 는 gitignore. 로컬만: `content/desk/uploads/**` 와 `tmp/desk-stock/`.

---

## 2. 채널과 사이트 (섞지 말 것)

| 면 | 역할 |
|---|---|
| 유튜브 쇼츠 | 판매 = 쿠팡 딥링크 `https://link.coupang.com/...` 설명+**고정 댓글** |
| 네이버 클립 | 판매 = 쇼핑 커넥트 상품 부착 + 댓글에 같은 `naver.me` |
| `desk.thebearings.app` | 리스트 카탈로그. 채널 소개 링크. **영상에서 말하지 않음** |
| `go.thebearings.app/{slug}` | 클릭 로그 후 쿠팡 302. **영상 CTA로 쓰지 않음** (한 홉, 모르는 도메인) |

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
3. 화면 `[광고]` / 로고 스팅 없음 (6편 전). 고지는 설명 첫 줄 `[광고]` + 유튜브 유료 광고 체크.
4. CTA 지금: `링크는 댓글에 있어요.` → 그 플랫폼 댓글이 있어야 공개 완료. 유튜브=쿠팡, 네이버=`naver.me`.
5. 훅은 **파는 SKU**를 가리킨다. 의자를 미끼로 쓰고 암을 팔지 않음 (2편 교훈).
6. 첫 1초 = 통증. ~5초 제품 스티커. 이전 편 클립 재사용 금지.
7. 본인 파트너스/커넥트 링크 클릭 금지. 누르면 그 클릭은 0으로 읽거나 `clicks` 행을 뺀다.
8. 같은 날 쇼츠 과다 금지. 업로드 자동화·비공식 업로더·Coupang 페이지 스크래핑 금지.
9. Option B 스캔이 `src/` 의 `추천`을 잡는다. 데스크 배지는 `이 영상` (이미 반영).

대본 스키마: `parseShortformScript` (`src/data/shortform-script.ts`). 테스트: `src/data/__tests__/shortform-script.test.ts`.

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

# 2편 렌더 (3편은 이 파일을 복제해 render-ep3 를 만들 것)
pnpm desk:render-ep2

# 컷아웃이 비면
pnpm desk:cutout-thumbs
```

`desk:render-ep3` 는 **아직 없다**. `scripts/desk/render-ep2.ts`를 복사해

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
| 쿠팡 파트너스 → 일별 실적 | 클릭·구매·수익 | **KPI.** 편별 분해 없음. 링크가 같으면 암이 합산됨 |
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
| 2026-08-19 17:00 | 3 스크린바 | local | 마스터 9.30s | — | — | 0 | 렌더 완료. 미업로드. 암 클립/링크 안 씀 |

1편 YT 설명은 2026-08-19에 쿠팡으로 교체함. 이후 `go.` 클릭은 기댓값 낮음.

---

## 7. 이미 올린 편

| 편 | SKU | 훅 | YT | 네이버 |
|---|---|---|---|---|
| 01 | `arm-nb-f80` | 고개 앞으로 빠지지 않음? | 공개. 재생목록 데스크 | 그리드에 없을 수 있음 → 올리기 |
| 02 | `arm-nb-f80` | 목 아픈데 의자만 바꿔요? | 공개 | 재업로드(자막 720). 상품 F80 검정 |
| 03 | `lamp-screenbar` | 모니터가 눈부셔요? | **미업로드** | 미업로드. 마스터 video.mp4 로컬 준비. 네이버는 스크린바 naver.me 필요 |

---

## 8. 그록이 해도 되는 일 / 금지

**해도 됨**

- `render-ep3.ts` 작성 후 로컬 렌더 (클립·wav가 있을 때)
- `03-lamp-screenbar/youtube.md` · `naver.md` 작성 (`pnpm desk:print-script` 출력 기준)
- §6 표에 운영자가 준 숫자 추가 + `retro-2026-08-18.md` 판정 한 줄
- 훅이 SKU와 같은지 대본 검수
- 데스크 UI 버그 수정 (로고·리스트·세이프존은 이미 있음)

**하지 말 것**

- 유튜브/네이버 비공식 업로드 봇
- 본인 제휴 링크 테스트 클릭
- 물·생수·거북목 베개 등 데스크 밖 피벗
- 공동구매 링크 발급
- 영상 CTA를 `go.` 나 `desk.thebearings.app` 로 변경
- 3편에서 CTA를 `아래`로 바꾸기 (4편)
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
