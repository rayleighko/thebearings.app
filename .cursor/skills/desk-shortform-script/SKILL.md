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
| Logo / AE sting | never (before ep 6) |
| CTA | last line `링크는 댓글에 있어요.` |
| YouTube link | `youtube.productUrl` Coupang deeplink |
| Naver link | Brand Connect only |
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

## Quality gates

1. One SKU pain point. No 알루미늄 / 가스스프링 / 최저가.
2. First line ≠ previous episode hook.
3. First 1s = pain. No leftover ep1 clip.
4. Product visible by ~5s.
5. Captions = VO lines 1:1.
6. `picture.hookGender` required, independent from VO.

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
