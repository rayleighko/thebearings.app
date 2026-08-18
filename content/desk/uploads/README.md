# Desk shortform 업로드 큐

`tmp/`가 아니다. 여기가 **올릴 파일**의 위치다.

렌더·스톡·rembg 작업은 `tmp/desk-stock/`에 남긴다. 다 되면 이 폴더의 `NN-sku/`로만 복사한다. `tmp`는 지우지 않는다.

## 순서

1. `01-arm-nb-f80/` — 1편 (올렸음)
2. `02-arm-nb-f80/` — 올렸음 (유튜브 공개)
3. **내일:** `03-lamp-screenbar/` — 스크린바. 오늘은 올리지 않음. `docs/desk/ep3-screenbar-script.md`

한 편 폴더:

```
NN-sku/
  video.mp4      최종 9:16 (소리 있는 판)
  captions.srt   있으면
  youtube.md     제목·설명·태그·고정 댓글
  naver.md       제목·설명
```

## 플랫폼별 링크·업로드

- **YouTube Shorts:** 설명 + **고정 댓글**에 쿠팡 딥링크 (`link.coupang.com`). `go` 쓰지 않음.
- **네이버 클립:** 쇼핑 커넥트로 상품 붙이기 + **댓글**에 같은 `naver.me`. 쿠팡/`go` 넣지 말 것.
- 영상이 `링크는 댓글에 있어요`이면 그 플랫폼 댓글이 비어 있으면 안 됨. 업로드 직후 댓글이 공개 조건.

## 공통

- 화면 `[광고]` 없음. 고지는 설명란 첫 줄 `[광고]` 접두(+유튜브 유료 프로모션 체크)
- 프로필 링크(선택): `https://desk.thebearings.app/dev`
- 자막 세이프존: 아래 720px / 스티커 800px (쇼핑 커넥트 카드 피함). 9:16 마스터 하나.
- mp4는 git에 안 넣는다. 메타데이터(md, srt, json, 이 README)만 커밋한다
- 회고 SoT: `docs/desk/retro-2026-08-18.md`
