# Licensed short-form asset pipeline

Operator-only path for hooking **9:16** clips aimed at Korean YouTube / Naver.
The founder does not film. Source footage must be something we are allowed to use.

**Official source for V1:** [Pexels Videos API](https://www.pexels.com/api/documentation/#videos-search).
Pixabay / Coverr can be added later the same way (API + local cache). This is not a
scraping project.

Live desk surface: `https://desk.thebearings.app/dev`
Go redirects: Partners slugs `arm-nb-f80`, `lamp-screenbar`, `stand-laptop`,
`kbd-keychron-k8`, `mouse-mx-master`.

---

## Phases

| Phase | What | Status |
|-------|------|--------|
| **1** | Search + cache licensed clips (Pexels API, local manifest, up to 8 preview downloads per SKU) | **this slice** |
| **2** | 9:16 edit via unofficial `capcut-cli` compile + ffmpeg proxy (`pnpm desk:render-ep1`) | ep1 (`arm-nb-f80`) |
| **3** | Description / disclosure pack (paste-ready YouTube/Naver text per SKU) | later |
| **4** | Official YouTube Data API upload **if** OAuth is added | **not now** |

Do not start phase 4 in this repo until the founder creates a Google Cloud OAuth
client and explicitly asks for upload. No unofficial upload bots.

---

## NON-GOALS (hard)

Do **not** add any of the following, in this slice or later “just to help”:

- Xiaohongshu / 小红书, Douyin, Kuaishou, Instagram, TikTok, or Coupang **page scrapers**
- Download of unsigned / unlicensed creator videos
- Watermark removal or “clean” re-encodes of marked files
- Jurisdiction / geo-arbitrage “copyright workaround” logic
- Remotion, admin UI, Coupang Partners API, or upload automation (out of this slice)

Korean targeting lives in **captions and descriptions**, not by taking files from
Korean creators without a license.

---

## Operator — Phase 1

1. Create a free Pexels API key: <https://www.pexels.com/api/>
2. Put it in **`.env.local` only** (never commit, never Vercel unless a future
   server path needs it — this script is local):

   ```
   PEXELS_API_KEY=...
   ```

3. From the repo root:

   ```bash
   pnpm desk:fetch-stock
   ```

   Search-only (no binaries):

   ```bash
   pnpm desk:fetch-stock -- --no-download
   ```

   One SKU:

   ```bash
   pnpm desk:fetch-stock -- --sku=arm-nb-f80
   ```

4. Outputs (gitignored under `tmp/`):

   - `tmp/desk-stock/cache/` — search JSON (re-runs skip the API)
   - `tmp/desk-stock/clips/` — at most 8 preview mp4s per SKU
   - `tmp/desk-stock/manifest.json` — ids, dimensions, **photographer credit**, local paths

Pexels asks for a prominent link to Pexels and photographer credit when possible
(e.g. “Video by Jane Doe on Pexels”). The script prints credits and stores them
in the manifest. Use those strings in descriptions (phase 3).

**This script is not part of `pnpm build`.** Missing `PEXELS_API_KEY` exits with
an operator message; it does not break the app.

---

## SKU → English stock queries

Queries are English on purpose (Pexels library). They live in
`src/data/desk-stock-queries.ts` and must cover every published `dev` item.

| SKU | Desk item | Search intent |
|-----|-----------|----------------|
| `arm-nb-f80` | 싱글 모니터암 | East Asian office / neck first (Pexels English queries). Catalog is Western-heavy — query bias only; no CN-app scrape |
| `lamp-screenbar` | 스크린바 | monitor light bar / screen lamp |
| `stand-laptop` | 노트북 스탠드 | laptop stand / riser |
| `kbd-keychron-k8` | 키보드 | mechanical keyboard workspace |
| `mouse-mx-master` | 마우스 | wireless / ergonomic mouse |

Do not invent a new still for `stand-laptop` — it currently shares the official
Coupang CDN URL with `lamp-screenbar`. Stock video is a separate asset.

---

## Official product cutouts (not GPT composites)

Coupang Partners: product pixels must be the real sellable items. AI is only
for **empty** desk backgrounds. Do **not** send product images to GPT (or any
image-generation API) to invent a photorealistic desk scene — that morphs the
SKU.

Path for the overlay (so thumbs look less like white-box stickers):

1. Download official `thumbnail.coupangcdn.com` URLs already in
   `src/data/concepts.ts` (`DEV_OFFICIAL_CDN_THUMBS`).
2. Local **rembg** only — crop / resize / background-remove. Do not reshape
   the product.
3. Write `public/desk/dev/{id}.png` (~800px wide) and point `img` at
   `/desk/dev/{id}.png`.

```bash
pnpm desk:cutout-thumbs
```

Requires rembg with CPU + CLI extras (not part of `pnpm build`):

```bash
pipx install "rembg[cpu,cli]"
# or
uv tool install "rembg[cpu,cli]" --python 3.11
rembg d u2net   # do not run bare `rembg d` — that downloads every model
```

The script pins `-m u2net` (crop/mask only). Default rembg 2.x is a heavier model.

Never open `link.coupang.com` affiliate URLs for images. Never scrape
Xiaohongshu / Coupang product pages.

---

## Description / pinned comment only (not on the picture)

Do **not** burn `[광고]`, `유료광고`, or `협찬` on video frames. One Coupang
Partners disclosure surface is enough — YouTube description and/or pinned
comment. Exact wording (same as the desk page — no “받을 수 있습니다”):

```
이 페이지는 쿠팡 파트너스 활동의 일환으로,
이에 따른 일정액의 수수료를 제공받습니다.

https://desk.thebearings.app/dev

링크는 프로필에 있어요.
```

Then: SKU-specific hook (Korean), optional Pexels credit line, no **최저가**,
no buy-now timing, no invented product claims, no 치료/교정 medical claims.

---

## Slice 2 — ep1 render (CapCut draft + watchable proxy)

Unofficial [`capcut-cli`](https://github.com/renezander030/capcut-cli) edits a local
`draft_content.json`. Preview/export is its ffmpeg proxy (`render --all-video-tracks`).
The CapCut app is **not** installed on the operator Mac as of 2026-08-18; fancy encode waits.

```bash
pnpm desk:render-ep1
```

- Spec: `scripts/desk/ep1-arm-spec.json`
- Cutlist: `docs/desk/ep1-arm-cutlist.md`
- Draft (gitignored): `tmp/desk-stock/drafts/ep1-arm-nb-f80/`
- MP4 (gitignored): `tmp/desk-stock/out/ep1-arm-nb-f80.mp4`

This Homebrew ffmpeg has `overlay` but not `drawtext`. Korean captions are Apple SD
Gothic Neo PNG plates. Still no upload automation.

---

## Typecast VO (Studio export first; API is a separate product)

Studio **Basic** (web) is not the Typecast API. Official docs:
[web plans and API plans are billed separately](https://typecast.ai/docs/llms.txt)
— a Basic/Pro/Business Studio subscription still needs an **API** plan and key
to call `POST https://api.typecast.ai/v1/text-to-speech`. API pricing:
<https://typecast.ai/pricing/api/> (Free = 30k credits/month). Console
(sign-in, do not scrape): <https://studio.typecast.ai/developers/api>.

Until an API key exists in `.env.local`:

1. Export wav + srt from Studio (already done for ep1).
2. Copy to `tmp/desk-stock/vo/ep1-arm-nb-f80.{wav,srt}` (gitignored).
3. Mux later: keep the 20s silent video; do not glue the old 12s take onto
   the new cut. Founder re-exports a faster 구어체 wav separately.

Watchable silent file: `tmp/desk-stock/out/ep1-arm-nb-f80.mp4`.
Old mux (`ep1-arm-nb-f80-vo.mp4`) is stale — do not ship it.

If an API plan is added later:

```
TYPECAST_API_KEY=
TYPECAST_VOICE_ID=
pnpm desk:typecast-tts
```

`scripts/desk/typecast-tts.ts` uses only documented endpoints (`/v1/text-to-speech`,
`/v1/users/me/subscription`, `/v2/voices`) and header `X-API-KEY`. It writes
`tmp/desk-stock/vo/ep1-arm-nb-f80.api.wav` and does not overwrite the Studio export.
401/403 = no API plan or a web-only credential — keep using the downloaded wav.
