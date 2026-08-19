# 살까말까 연구소 — 검색 등록 체크리스트

운영자 확인 2026-08-19. **thebearings.app / www 를 다시 등록하지 말 것.**

이미 있는 것:
- GSC 속성 `thebearings.app` (클릭 0은 정상). 인스타 `@sal_kka_lab`, 유튜브 `@sal-kka-lab` 도 있음 — 웹 색인 대체가 아님. 그대로 둔다.
- 네이버 서치어드바이저 사이트 `https://www.thebearings.app` (2026-07-11, 사이트맵 제출됨, 색인 2). 계정명 살까말까 연구소.

www 와 desk 는 다른 호스트다. desk URL을 www 사이트맵에 넣지 않는다. `go.thebearings.app` 은 등록하지 않는다.

## 아직 할 클릭

붙여넣을 desk 주소:
- 사이트: `https://desk.thebearings.app`
- 사이트맵: `https://desk.thebearings.app/sitemap.xml`
- 확인용: `https://desk.thebearings.app/` · `/dev` · `/blog`

### 1. 네이버 — desk를 두 번째 사이트로

www 는 이미 되어 있다. 다시 넣지 말 것.

1. [서치어드바이저](https://searchadvisor.naver.com/) → **사이트 추가** `https://desk.thebearings.app`
2. desk 홈을 한 번 새로고침한 뒤 **소유확인**. (`naver-site-verification` 메타는 프로덕션 desk 레이아웃에 있음)
3. 요청 → 사이트맵 제출 → `https://desk.thebearings.app/sitemap.xml` (또는 `sitemap.xml` — desk 호스트에서)
4. 선택: 웹 페이지 수집 `https://desk.thebearings.app/` 와 `https://desk.thebearings.app/dev`

### 2. Google Search Console — 기존 속성에 desk 사이트맵

`thebearings.app` 을 다시 추가하지 말 것.

기존 Domain 속성에 `https://desk.thebearings.app/sitemap.xml` 을 사이트맵으로 넣는다. UI가 거부하면 URL-prefix 속성 `https://desk.thebearings.app` 을 하나 더 만들고 같은 사이트맵을 넣는다. YT/IG 속성은 그대로 둔다.

### 하지 말 것

- `thebearings.app` / `www.thebearings.app` 재등록
- `go.thebearings.app` 등록·사이트맵 제출
- desk URL을 www 사이트맵에 섞기
- 토큰을 레포 밖으로 새로 지어내기

`GOOGLE_SITE_VERIFICATION` 은 비워 둔다. 네이버 desk 토큰은 코드에 있다.
