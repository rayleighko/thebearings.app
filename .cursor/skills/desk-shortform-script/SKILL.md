---
name: desk-shortform-script
description: Writes Typecast-ready desk shortform scripts (YouTube Shorts / Naver Clip) as four clean paste lines plus Studio settings (예슬, 일반, 1.0x). Use when the user asks for a 스크립트, Typecast 대본, 다음 편, shortform script, VO lines, or episode copy for 살까말까 연구소.
---

# Desk shortform script

Read `src/data/shortform-script.ts` before writing. Every episode writes `content/desk/uploads/{nn}-{sku}/script.json` that passes `parseShortformScript`. Print with `pnpm desk:print-script -- --file=...`.

Do not skip `vo.gender` or `picture.hookGender`. Never put pause tokens in the paste lines.

## Locked defaults (살까말까 연구소)

| Field | Value |
|---|---|
| Duration | 9–10s, 4 lines |
| Register | 해요체 구어체. 번역체·전보체·광고 AI 톤 금지 |
| `vo.actor` | `예슬` |
| `vo.gender` | `female` unless the user asks male |
| `vo.emotion` | `normal` (스튜디오 **일반**) |
| `vo.speed` | `1` |
| Pause | Studio `[0.2s 추가]` after each of the first 3 lines. **Not in the text.** |
| On-screen `[광고]` | never |
| Caption / sticker | One 9:16 master. Captions sit 720px from the bottom; SKU sticker 800px. Clears Naver Shopping Connect product card + YouTube Shorts chrome. Do **not** export a second ratio or a Naver-only cut. |
| Logo / AE sting | never (before ep 6) |
| CTA | Shipped ep1–3: `링크는 댓글에 있어요.` Next ep: `프로필에 책상 목록 있어요.` YouTube Shorts description/comment URLs are **not clickable** (Help). Profile URL = `https://desk.thebearings.app` (link title: 책상 물건). Never say `/dev`. Naver click surface = Shopping Connect card. Keep Coupang URL in YT description for disclosure. Never mix Coupang + Naver checkout in one video. |
| YouTube link | `youtube.productUrl` Coupang deeplink |
| Naver link | Brand Connect / Shopping Connect attach + the same `naver.me` in the Clip comment |
| `youtube.category` | `노하우 및 스타일` |
| `youtube.language` | `한국어` |
| `youtube.playlist` | `데스크` |
| `youtube.madeForKids` | `false` |
| `youtube.paidPromotion` | `true` |
| `youtube.comments` | `on` |
| `youtube.showLikeCount` | `true` |
| `youtube.thumbnail` | `from-video` |
| `youtube.tags` | 4–12, include SKU pain + `살까말까연구소` |
| `youtube.hashtags` | include `#shorts` |

Custom Typecast emotions (기쁨/슬픔/높은 톤 등) are off unless the user asks. 일반 is the lock.

## Line jobs (next episode onward — ep1–3 stay as shipped)

Four lines are a **sales loop**, not a finished tip. If line 3 already solves it, the comment is optional and the clip feels like “지나가는 영상”.

| Line | Job | Do | Do not |
|---|---|---|---|
| 1 | 자기인식 | 이 책상에서 매일 하는 통증. SKU가 떠오르게 | 일반 상식 질문만, 다른 물건 미끼 |
| 2 | 잘못된 처방 | 이미 해본 틀린 해결 (의자만, 천장 불만) | 스펙, 가격 |
| 3 | 열린 고리 | SKU를 **이름으로** 가리키되, 다는 위치/고르는 기준 하나는 댓글에 남김 | “바만 달면 해결”처럼 결론을 닫기 |
| 4 | CTA | 다음 편 `프로필에 책상 목록 있어요.` | `/dev` 말하기, `구독하고 방문`, `지금 사세요`, 쇼츠 댓글이 클릭된다고 가정 |

Ban on-camera: 공포 과장, 가짜 리뷰, 진화심리 설명, 최저가. 신뢰는 `[광고]` + 댓글 링크로.

## VO Korean lint (before lock)

Read `.cursor/skills/fluent-korean/SKILL.md` (Cursor port of snflkd/fluent-korean, MIT).
Open the reference file it points at. Do **not** install the Claude Code `/plugin` commands in Cursor.

Spoken 9s 해요체 is the register. Do **not** expand into complete 문어 보고체. After writing four lines, check:

1. 조사·어미를 빼서 전보처럼 끝내지 말 것. `다는 법은 목록에.` → `다는 방법은 목록에 있어요.`
2. 빈 지시어. `그 높이예요` / `그게 그거예요` 금지. 무엇을 말하는지 명사로.
3. `위만… 앞은…` 같은 대우 슬로건, 모든 줄을 `~예요`로 맞추기 금지.
4. 입으로 말하는지. `올려 놨어요`, `그냥`, `맞추는 거예요` 쪽이 `사용합니다`보다 맞음.
5. 엠대시(`—`) 금지.

If a line fails, rewrite that line. Do not add a fifth line.

AI 느낌의 큰 축은 대본만이 아니라 **Pexels + Typecast**다. 다음 편에서 운영자 책상 5초가 있으면 그록은 그걸 첫 클립으로 쓴다. 없어도 라인 3은 닫지 말 것.

## Quality gates

1. One SKU pain point. No 알루미늄 / 가스스프링 / 최저가.
2. First line ≠ previous episode hook.
3. First 1s = pain. No leftover ep1 clip.
4. Product visible by ~5s.
5. Captions = VO lines 1:1.
6. `picture.hookGender` required, independent from VO.
7. Line 3 must not fully resolve the pain (open loop). Ep1–3 are grandfathered.
8. VO Korean lint (skill). Ep1–3 are grandfathered.

## Paste shape (script field only)

```
한줄
두줄
세줄
네줄
```

No `<|0.2s|>`, no `[0.2s]`. Settings stay outside the paste.

`pnpm desk:print-script` also prints the YouTube Studio block (제목·설명·태그·카테고리·언어·재생목록·아동용 아님·유료 광고·댓글·좋아요·썸네일·고정 댓글). Description always starts with `[광고]`. Never `go.thebearings.app`.

## Example

`content/desk/uploads/02-arm-nb-f80/script.json`
