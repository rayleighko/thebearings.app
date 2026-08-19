# Episode 1 cutlist — `arm-nb-f80` (싱글 모니터암)

> **히스토리.** ep1 CapCut 20s / 프로필 CTA. 새 편은 `.cursor/skills/desk-shortform-script/SKILL.md` + `pnpm desk:render-ep2` / `desk:render-ep3`. 이 컷리스트로 렌더하지 말 것.

9:16 · target **20.0s** · licensed Pexels previews only (no XHS / YouTube / Coupang scrape).

CapCut draft: `tmp/desk-stock/drafts/ep1-arm-nb-f80/` (compile spec: `scripts/desk/ep1-arm-spec.json`).
Watchable proxy: `tmp/desk-stock/out/ep1-arm-nb-f80.mp4`.

**No on-screen `[광고]` / 유료 / 협찬.** Coupang Partners disclosure lives in the
YouTube description and/or pinned comment only — exact text in
`docs/desk/shortform-asset-pipeline.md` (“Description / pinned comment only”).

## Mapping

| Timeline | Source file | In–out (source) | Caption |
|---|---|---|---|
| 0.0–2.0s | `clips/arm-nb-f80-8519534.mp4` | 0.00–2.00 | `고개 앞으로 나감` |
| 2.0–8.0s | `clips/arm-nb-f80-7489592.mp4` | 0.00–6.00 | `오후엔 목부터` |
| 8.0–14.0s | `clips/arm-nb-f80-12894329.mp4` | 0.00–6.00 | `높이만 맞추면 됨` |
| 14.0–20.0s | `clips/arm-nb-f80-7653215.mp4` | 2.00–8.00 | `링크는 프로필에` |

Four **distinct** source files. No clip loops. No empty-desk-under-monitor hook.
Do **not** put 책상 + 프로필 in one caption (a desk is not inside a YouTube profile).

Product sticker: `public/desk/dev/arm-nb-f80.png` · ~18% canvas width · bottom-right · **8.0–20.0s** (height beat + CTA). Not on the pain beats.

## Why these files (psych, one line)

- **8519534** — East Asian man, head dropped to a low laptop: interoception first.
- **7489592** — different East Asian man, laptop on the lap, hunched: afternoon neck without 병/치료/교정.
- **12894329** — East Asian office worker at a real desk with monitors in frame: height tool, not a gadget hero. Pexels still has no licensed “cranking a monitor arm” clip.
- **7653215** — two East Asian coworkers at a wooden desk: CTA is the **link**, not “desk lives in the profile.”

English `asian` / `east asian` Pexels queries still return a mixed bag (Western neck-pain B-roll ranked high). These four were hand-picked from the licensed hits. No Xiaohongshu / Douyin / unofficial CN APIs.

No 최저가. No aluminum / gas-spring feature list.

## Credits (Pexels)

- Video by Artem Podrez on Pexels — https://www.pexels.com/video/a-man-typing-on-his-laptop-8519534/
- Video by Kampus Production on Pexels — https://www.pexels.com/video/man-using-a-laptop-7489592/
- Video by Mizuno K on Pexels — https://www.pexels.com/video/businesswoman-working-at-a-desk-in-an-office-12894329/
- Video by Thirdman on Pexels — https://www.pexels.com/video/women-looking-at-the-laptop-screen-7653215/

## Re-run

```bash
pnpm desk:render-ep1
```

Needs `npx capcut-cli` (unofficial) + `ffmpeg` / `ffprobe`. Does not read `.env.local`. Does not upload.

## Still manual (slice 2+)

- **Typecast VO** — founder re-exports a faster 구어체 take. Last line is `링크는 프로필에 있어요.` Do **not** mux the old 12s wav onto this cut. `pnpm desk:typecast-tts` needs a separate API key (see `docs/desk/shortform-asset-pipeline.md`).
- **CapCut app encode** — `render` is an ffmpeg proxy (`--scale 1 --all-video-tracks`). Fancy export waits until CapCut is installed and the draft is opened.
- **This Homebrew ffmpeg has no `drawtext`** — Korean captions are burned as Apple SD Gothic Neo PNG plates + `overlay`. Text segments still live in the draft for the CapCut app.
