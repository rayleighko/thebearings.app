---
name: fluent-korean
description: >-
  Cursor-adapted fluent-korean (MIT, snflkd). Keeps particles, endings, and
  complete Korean clauses in user-facing copy. Use when writing or editing
  Korean VO, 대본, youtube.md, naver.md, desk shop copy, or other Korean UI
  strings. Do not use for code, identifiers, commit subjects, or English.
---

# fluent-korean (Cursor)

Upstream is a Claude Code **output-style**, not a Cursor marketplace plugin.
This repo vendors the MIT text and routes it for Cursor / Grok.

- Original: https://github.com/snflkd/fluent-korean
- Copyright (c) 2026 snflkd — `references/LICENSE`
- Guideline body (do not skip): `references/fluent-korean-not-coding.md`

## When to apply

Read the reference file, then apply it to **Korean the user will read**:

- 살까말까 VO / `script.json` `vo.lines`
- `youtube.md` / `naver.md` body (not hashtag soup)
- desk shop headings and card labels
- Korean replies that explain a product or a lock

## When not to apply

- Code, types, URLs, slugs, commit subjects
- English
- Lists and tables (upstream already exempts headers/lists from the “finish every sentence” clause)
- Stretching a 9–10s shortform into 문어 보고체

## 살까말까 shortform overlay

If the artifact is four Typecast lines, **desk-shortform-script wins on length and 해요체**.
fluent-korean still wins on:

1. Do not drop 조사/어미 (`다는 법은 목록에.` → `다는 방법은 목록에 있어요.`)
2. No empty 그/이 (`그 높이예요`)
3. No em dash (`—`)
4. Do not add a fifth line to “complete” the grammar

Then stop. Do not turn 해요체 into `사용합니다`.

## How

1. Open `references/fluent-korean-not-coding.md` (full examples — do not rely on this SKILL.md as a summary of those clauses).
2. Rewrite only the Korean the user will hear or read.
3. If desk shortform, run the overlay above and `parseShortformScript`.
