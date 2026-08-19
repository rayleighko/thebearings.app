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
| Register | 해요체 구어체. AI 광고 톤 금지 |
| `vo.actor` | `예슬` |
| `vo.gender` | `female` unless the user asks male |
| `vo.emotion` | `normal` (스튜디오 **일반**) |
| `vo.speed` | `1` |
| Pause | Studio `[0.2s 추가]` after each of the first 3 lines. **Not in the text.** |
| On-screen `[광고]` | never |
| Caption / sticker | One 9:16 master. Captions sit 720px from the bottom; SKU sticker 800px. Clears Naver Shopping Connect product card + YouTube Shorts chrome. Do **not** export a second ratio or a Naver-only cut. |
| Logo / AE sting | never (before ep 6) |
| CTA | last line `링크는 댓글에 있어요.` **Publish is not done until that platform's comment exists.** YouTube pinned = Coupang. Naver comment = `naver.me` (same SKU). Never mix. |
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
| 4 | CTA | `링크는 댓글에 있어요.` | `지금 사세요`, `한정`, `꼭 사야`, `추천` |

Ban on-camera: 공포 과장, 가짜 리뷰, 진화심리 설명, 최저가. 신뢰는 `[광고]` + 댓글 링크로.

AI 느낌의 큰 축은 대본이 아니라 **Pexels + Typecast**. 다음 편에서 운영자 책상 5초가 있으면 그록은 그걸 첫 클립으로 쓴다. 없으면 스톡이어도 라인 3은 닫지 말 것.

## Quality gates

1. One SKU pain point. No 알루미늄 / 가스스프링 / 최저가.
2. First line ≠ previous episode hook.
3. First 1s = pain. No leftover ep1 clip.
4. Product visible by ~5s.
5. Captions = VO lines 1:1.
6. `picture.hookGender` required, independent from VO.
7. Line 3 must not fully resolve the pain (open loop). Ep1–3 are grandfathered.

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
