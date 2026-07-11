# Bearings AX — 초기 백로그 (GitHub Issues 원고)

> 마스터 플랜(`bearings-ax-master-plan.md`)의 실행 단위. 라벨/마일스톤은 `create-issues.sh`가 함께 생성.
> 표기: [마일스톤] 제목 — `라벨들` · 우선순위

---

## M0 Foundation (거버넌스·법률·리브랜딩)

**#1 [M0] Cohort → Bearings 리네이밍 정리** — `type:docs, area:growth` · P0
README/CLAUDE.md/도메인/패키지명에서 브랜드 불일치 제거. AC: 공개 레포 첫 화면이 Bearings 기준으로 읽힘. Aurora/Vesper는 dovish/hawkish 해석 페르소나로 재정의 유지.

**#2 [M0] GitHub Actions CI 구축 (lint·typecheck·test)** — `type:infra` · P0
현재 CI 0. AC: PR에 3게이트 필수 + branch protection. 안전필터 테스트 포함(이슈 #29 선행 조건).

**#3 [M0] 라벨/마일스톤/Projects 보드 세팅** — `type:infra` · P0
Roadmap(타임라인)/Kanban/Table 3뷰. AC: 이 백로그 전체가 보드에서 시계열로 보임.

**#4 [M0][LEGAL] 금융위 법령해석 익명 질의 — 1-tap 승인형 리밸런싱의 일임업 해당 여부** — `type:legal, area:guardrail` · P0
better.fsc.go.kr 질의 발송. 질의문에 G1 불변식(매 건 승인, 유효시간, 프리뷰=주문 일치) 명시. AC: 접수 완료 + 회신 내용 founder-log 기록. **M5 착수 게이트.**

**#5 [M0][LEGAL] 유사투자자문업 신고 요건·절차 조사** — `type:legal, area:guardrail` · P0
개인 신고 가능 여부, 사전교육, 금지행위 목록 정리. AC: 신고 체크리스트 문서 + 신고 시점 결정(M6 전 완료 목표).

**#6 [M0][LEGAL] 증권사 API 약관 원문 확인 (KIS·토스·키움)** — `type:legal, area:rebalance` · P1
제3자 서비스/키 위임 조항 확인. AC: 3사 비교표 + 1차 증권사 선정 ADR 입력자료. 로그인 필요 — 직접 열람.

**#7 [M0] ADR-0001: 트래킹/거버넌스 체계 (GitHub Issues+Projects 채택)** — `type:adr` · P2
Linear/Trello 대비 트레이드오프 기록. 이 백로그 자체가 증거물.

---

## M1 Bearings Wedge (분석기 완성 + 계측)

**#8 [M1] /regime 분석기 코어 — 입력→6레짐 분해→이중 해석 결과** — `type:feat, area:analytics` · P0
waitlist 랜딩을 실사용 도구로 전환. AC: 익명 사용자가 티커+비중 입력 후 결과 도달. 데이터는 기기 이탈 금지(프라이버시 카피 유지).

**#9 [M1] PMF 계측 이벤트 심기 (analysis_started/completed/shared/revisited)** — `type:feat, area:analytics` · P0
재설계안 §6 스펙 그대로. AC: PostHog에서 주간 분석 완료 수(북극성) 조회 가능. 서버-클라이언트 이중 계측은 결제 이벤트만.

**#10 [M1] 공유 카드 생성 (이미지 + ?ref= UTM)** — `type:feat, area:growth` · P1
"내 포트폴리오는 X 레짐에 취약" 카드. AC: Reddit에 붙여넣을 수 있는 품질 + 유입 추적.

**#11 [M1] 레짐별 정적 콘텐츠 페이지 2개 (SEO)** — `type:feat, area:growth` · P1
니즈 로그 최다 질문부터. AC: Search Console 등록 + 인덱싱 확인.

---

## M2 Indicator Hub + AI 코멘트

**#12 [M2] Indicator Engine — FRED 확장 (버핏지수, 점도표 데이터)** — `type:feat, area:indicator` · P0
기존 ECOS/FRED 파이프라인에 시리즈 추가, DB-first 원칙. AC: 일 1회 cron 갱신 + 히스토리 저장.

**#13 [M2] 자체 Fear & Greed 합성 지수** — `type:feat, area:indicator` · P1
CNN 재배포 제약 회피 — VIX/putcall/모멘텀 등 공개 원료로 자체 산식. AC: 산식 공개 문서 포함(신뢰 장치).

**#14 [M2] 지표 대시보드 UI — 원값/percentile/한줄해설 3단 표기** — `type:feat, area:indicator` · P0
초보·전문가 공용 화면. AC: FOMC 일정, 점도표, 버핏지수, F&G, 기존 composite 한 화면.

**#15 [M2] LLM Gateway v0 — Model Registry(DB) + Provider Adapter** — `type:feat, area:ai-gateway` · P0
모델 추가 = row 추가. AC: 모델 2개(Anthropic/OpenAI 각 1) 교체 데모, 코드 변경 없이 registry로 전환.

**#16 [M2] ADR-0002: LangChain 미채택 — 얇은 어댑터 설계 근거** — `type:adr, area:ai-gateway` · P2
1인 유지보수 기준 추상화 비용 분석. 재검토 조건 명시.

**#17 [M2] RAG v0 — pgvector 인제스트 파이프라인 (FOMC 의사록·지표 해설)** — `type:feat, area:ai-gateway` · P1
cron→fetch→chunk→embed→upsert. AC: 코멘트 생성 시 top-k 주입 + 인용 표기. 사용자 데이터 인제스트 금지(G2·G3).

**#18 [M2] 일일 배치 코멘트 — 전 사용자 공유 1회 생성 (Free 티어, 한계비용 0)** — `type:feat, area:ai-gateway` · P0
Aurora(dovish)/Vesper(hawkish) 이중 해석 유지. AC: 안전필터 통과 + AI 고지 문구(G6) 포함.

**#19 [M2] RAG 회귀 테스트 — golden question 20문항** — `type:infra, area:ai-gateway` · P1
환각/인용 없는 수치 출력 검증. AC: CI 게이트 편입.

---

## M3 Profile + Learn (성향 진단 + 교육/게이미피케이션)

**#20 [M3] scoreGlRts + classifyBit 스코어링 완성 (Task 5 Green)** — `type:feat, area:profile` · P0
기존 24스텝 설문·테이블 재활용, 스코어링만 미완. **핵심 로직 직접 타이핑 원칙 유지.** AC: 단위 테스트 green.

**#21 [M3] 성향 결과 카드 — BIT 4유형 + 취약 편향 + 공유 이미지** — `type:feat, area:profile` · P0
"현재 스냅샷 + 재검사" 프레임(단정 라벨 금지). AC: 결과 카드 공유 시 UTM 부착.

**#22 [M3] profile_snapshot 타임라인 — 분기 재검증 리마인더** — `type:feat, area:profile` · P1
founder-log 분기 재퀴즈 결정 재활용. AC: 분기 경계 2주 전 리마인더 + 스냅샷 비교 뷰.

**#23 [M3] 교육 모듈 3개 (분산·비용·손실한계) + 퀴즈** — `type:feat, area:education` · P0
v3 learning-cycle 원고 재활용. AC: 모듈→퀴즈→배지 흐름 완결. 종목/타이밍 내용 금지.

**#24 [M3] 학습 게이미피케이션 — 배지/레벨/스트릭 (거래 측 게임화 금지)** — `type:feat, area:education` · P1
AD-8(리더보드 금지) 유지. AC: 학습 완료율 이벤트 계측 포함.

**#25 [M3] 성향→전략 카테고리 연결 (처방 아닌 필터 프레임)** — `type:feat, area:profile` · P1
"이 성향 사용자들이 일반적으로 검토하는 카테고리" 카피 — G2 경계 문구 리뷰 필수. AC: ux-copy 체크리스트 통과.

---

## M4 Portfolio L1–L2 (자산 입력·읽기 연결)

**#26 [M4] 포트폴리오 L1 — 수동 입력 + CSV 업로드** — `type:feat, area:rebalance` · P0
Bearings 분석기와 데이터 모델 공유. AC: 저장 없이도(익명) 동작, 로그인 시 저장 선택.

**#27 [M4] ADR-0003: 1차 증권사 선정 + 클라이언트 사이드 키 보관 구조** — `type:adr, area:rebalance` · P0
#6 결과 반영. KIS 모의투자 우선 가설. 브라우저 직접 호출 vs 로컬 실행기 결정.

**#28 [M4] L2 읽기 연결 — 클라이언트 사이드 잔고 조회 (키 서버 미경유)** — `type:feat, area:rebalance, area:guardrail` · P0
G3·G5 구현. AC: 네트워크 탭 검증 — 키/잔고 원본이 우리 서버로 전송되지 않음을 문서화. 단일 증권사만.

**#29 [M4] 안전필터 회귀 테스트 CI 게이트화 (기존 50+ 케이스)** — `type:infra, area:guardrail` · P0
G2의 기술적 강제. AC: 개별 종목 추천 출력 시 CI red.

**#30 [M4] Drift 뷰 — 목표(전략 템플릿) 대비 현재 비중 괴리** — `type:feat, area:rebalance` · P1
L2 데이터 기반, 조회·표시만(권유 카피 금지). AC: G6 고지 포함.

---

## M5 Rebalance L4 (승인형 실행 — 모의투자 먼저)

**#31 [M5] 전략 템플릿 엔진 — 60/40, 올웨더 등 5종 (파라미터화)** — `type:feat, area:rebalance` · P0
출처·가정 전체 공시. AC: 템플릿 정의가 코드 아닌 데이터(JSON)로 관리.

**#32 [M5] Rebalance 프리뷰 — 주문 묶음 생성 + '이유' 설명(AI)** — `type:feat, area:rebalance` · P0
서버는 시세+전략만으로 프리뷰 생성(잔고는 클라이언트가 제공). AI 설명은 안전필터 경유. AC: 프리뷰 해시 고정.

**#33 [M5] 승인형 실행 — KIS 모의투자 대상 (G1 불변식 코드 강제)** — `type:feat, area:rebalance, area:guardrail` · P0
매 건 승인, 유효시간 5분, 프리뷰-주문 해시 일치 검증, 자동 실행 옵션 부재를 테스트로 고정. 멱등성 키 + 감사 로그. AC: **#4 법령해석 회신 전 실계좌 배포 금지 게이트 명시.**

**#34 [M5] 실행 감사 로그 + 복기 화면 (투자 일지 씨앗)** — `type:feat, area:rebalance` · P1
누가(사용자)·언제·무엇을 승인했는지 타임라인. v3 journal 비전의 최소 버전.

---

## M6 Monetize + 운영

**#35 [M6] 유사투자자문업 신고 완료 (M6 착수 게이트)** — `type:legal, area:guardrail` · P0
#5 체크리스트 실행. AC: 신고 수리증.

**#36 [M6] Pro 구독 (정액) + BYOK 모델 티어** — `type:feat, area:ai-gateway` · P0
G4: 거래 연동 과금 금지. BYOK: 사용자 키 등록 → 상위 모델(키는 클라이언트 보관). AC: Polar 결제 + 서버-사이드 결제 이벤트 계측.

**#37 [M6] 주간 운영 리추얼 자동화 — PostHog 요약 → 이슈 초안** — `type:infra` · P2
운영 중 루프(ideation §8) 최소 구현. AC: 주 1회 요약이 이슈 코멘트로 생성.

**#38 [Later] 서비스 내 백오피스/모니터링 대시보드** — `type:feat` · P2
유료 사용자 발생 후 착수. 그전까지 PostHog+Sentry+Projects로 운영.

**#39 [Later] 다계좌/자동실행/개별화 — 라이선스 트랙 검토** — `type:legal` · P2
자문업 등록→일임업+RA 테스트베드→혁신금융서비스 3단계. 법인화 전제. 트리거 조건: MRR/유료 전환이 임계 도달 시.
