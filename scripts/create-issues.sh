#!/usr/bin/env bash
# Bearings AX — 백로그 일괄 생성 스크립트
# 사용법: 레포 루트에서  bash create-issues.sh  (gh auth login 선행)
# 대상 레포: 현재 디렉토리의 origin. 다른 레포면 REPO=owner/name bash create-issues.sh
set -euo pipefail

REPO="${REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
echo ">> target repo: $REPO"

# ---------- 1. 라벨 ----------
declare -A LABELS=(
  ["type:feat"]="1D76DB" ["type:fix"]="D73A4A" ["type:docs"]="0075CA"
  ["type:adr"]="5319E7" ["type:legal"]="B60205" ["type:infra"]="0E8A16"
  ["area:guardrail"]="B60205" ["area:ai-gateway"]="5319E7" ["area:indicator"]="1D76DB"
  ["area:profile"]="FBCA04" ["area:education"]="0E8A16" ["area:rebalance"]="D93F0B"
  ["area:analytics"]="C2E0C6" ["area:growth"]="BFD4F2"
  ["priority:P0"]="B60205" ["priority:P1"]="FBCA04" ["priority:P2"]="C2E0C6"
  ["later"]="EEEEEE"
)
for name in "${!LABELS[@]}"; do
  gh label create "$name" --repo "$REPO" --color "${LABELS[$name]}" --force
done
echo ">> labels done"

# ---------- 2. 마일스톤 ----------
for m in "M0 Foundation" "M1 Bearings Wedge" "M2 Indicator Hub + AI" "M3 Profile + Learn" "M4 Portfolio L1-L2" "M5 Rebalance L4" "M6 Monetize"; do
  gh api "repos/$REPO/milestones" -f title="$m" 2>/dev/null || echo "   (milestone exists: $m)"
done
echo ">> milestones done"

# ---------- 3. 이슈 ----------
# issue <milestone> <labels(콤마)> <title> <<'BODY' ... BODY
issue() {
  local milestone="$1" labels="$2" title="$3"
  local body; body="$(cat)"
  gh issue create --repo "$REPO" --title "$title" --milestone "$milestone" \
    $(echo "$labels" | tr ',' '\n' | sed 's/^/--label /' | tr '\n' ' ') \
    --body "$body" >/dev/null
  echo "   created: $title"
}

# ===== M0 =====
issue "M0 Foundation" "type:docs,area:growth,priority:P0" "Cohort → Bearings 리네이밍 정리" <<'BODY'
README/CLAUDE.md/도메인/패키지명 브랜드 불일치 제거. Aurora/Vesper는 dovish/hawkish 해석 페르소나로 재정의 유지.

**AC**: 공개 레포 첫 화면이 Bearings 기준으로 읽힘.
BODY

issue "M0 Foundation" "type:infra,priority:P0" "GitHub Actions CI 구축 (lint·typecheck·test)" <<'BODY'
현재 CI 없음. 안전필터 테스트 게이트(#29)의 선행 조건.

**AC**: PR에 3게이트 필수 + branch protection.
BODY

issue "M0 Foundation" "type:infra,priority:P0" "라벨/마일스톤/Projects 보드 세팅" <<'BODY'
Projects 뷰 3개: Roadmap(타임라인) / Kanban(Now·Next·Later) / Table(라벨 필터).

**AC**: 백로그 전체가 보드에서 시계열로 보임.
BODY

issue "M0 Foundation" "type:legal,area:guardrail,priority:P0" "[LEGAL] 법령해석 익명 질의 — 1-tap 승인형 리밸런싱의 일임업 해당 여부" <<'BODY'
better.fsc.go.kr 질의. G1 불변식(매 건 승인·유효시간·프리뷰=주문 일치·자동실행 부재) 명시하여 발송.

**AC**: 접수 완료 + 회신 founder-log 기록. **M5 실계좌 착수 게이트.**
BODY

issue "M0 Foundation" "type:legal,area:guardrail,priority:P0" "[LEGAL] 유사투자자문업 신고 요건·절차 조사" <<'BODY'
개인 신고 가능 여부, 사전교육, 금지행위(개별 상담·선행매매·허위광고) 정리.

**AC**: 신고 체크리스트 문서 + 신고 시점 결정(M6 전 완료 목표).
BODY

issue "M0 Foundation" "type:legal,area:rebalance,priority:P1" "[LEGAL] 증권사 API 약관 원문 확인 (KIS·토스·키움)" <<'BODY'
제3자 서비스/키 위임/클라이언트 사이드 호출 관련 조항 확인 (로그인 후 원문 열람 필요).

**AC**: 3사 비교표 → ADR-0003(#27) 입력자료.
BODY

issue "M0 Foundation" "type:adr,priority:P2" "ADR-0001: 트래킹/거버넌스 체계 — GitHub Issues+Projects 채택" <<'BODY'
Linear/Trello 대비 트레이드오프 기록. 1인 + AI 에이전트(gh CLI) 운영 적합성 근거.
BODY

# ===== M1 =====
issue "M1 Bearings Wedge" "type:feat,area:analytics,priority:P0" "/regime 분석기 코어 — 입력→6레짐 분해→이중 해석 결과" <<'BODY'
waitlist 랜딩 → 실사용 도구 전환.

**AC**: 익명 사용자가 티커+비중 입력 후 결과 도달. 포트폴리오 데이터 기기 이탈 금지.
BODY

issue "M1 Bearings Wedge" "type:feat,area:analytics,priority:P0" "PMF 계측 — analysis started/completed/shared/revisited 이벤트" <<'BODY'
북극성 = 주간 분석 완료 수. 속성에 비중값 금지(범주만).

**AC**: PostHog에서 북극성 조회 가능.
BODY

issue "M1 Bearings Wedge" "type:feat,area:growth,priority:P1" "공유 카드 생성 (이미지 + ?ref= UTM)" <<'BODY'
"내 포트폴리오는 X 레짐에 취약" 카드.

**AC**: Reddit 첨부 품질 + 유입 추적 동작.
BODY

issue "M1 Bearings Wedge" "type:feat,area:growth,priority:P1" "레짐별 정적 콘텐츠 페이지 2개 (SEO)" <<'BODY'
Reddit 니즈 로그 최다 질문 주제부터.

**AC**: Search Console 등록 + 인덱싱 확인.
BODY

# ===== M2 =====
issue "M2 Indicator Hub + AI" "type:feat,area:indicator,priority:P0" "Indicator Engine — FRED 확장 (버핏지수·점도표 데이터)" <<'BODY'
기존 ECOS/FRED 파이프라인에 시리즈 추가. DB-first ingest 원칙.

**AC**: 일 1회 cron 갱신 + 히스토리 저장.
BODY

issue "M2 Indicator Hub + AI" "type:feat,area:indicator,priority:P1" "자체 Fear & Greed 합성 지수" <<'BODY'
CNN 지수 재배포 제약 회피 — VIX/putcall/모멘텀 등 공개 원료 자체 산식.

**AC**: 산식 공개 문서 포함(신뢰 장치).
BODY

issue "M2 Indicator Hub + AI" "type:feat,area:indicator,priority:P0" "지표 대시보드 UI — 원값/percentile/한줄해설 3단 표기" <<'BODY'
초보·전문가 공용 화면: FOMC 일정·점도표·버핏지수·F&G·기존 composite.

**AC**: 한 화면 통합 + 모바일 대응.
BODY

issue "M2 Indicator Hub + AI" "type:feat,area:ai-gateway,priority:P0" "LLM Gateway v0 — Model Registry(DB) + Provider Adapter" <<'BODY'
모델 추가 = registry row 추가 (코드 배포 불필요). Prompt-as-config 분리.

**AC**: 모델 2개 교체 데모 — 코드 변경 없이 전환.
BODY

issue "M2 Indicator Hub + AI" "type:adr,area:ai-gateway,priority:P2" "ADR-0002: LangChain 미채택 — 얇은 어댑터 설계 근거" <<'BODY'
1인 유지보수 기준 추상화 비용 분석 + 재검토 조건 명시. 파인튜닝 보류 근거 포함.
BODY

issue "M2 Indicator Hub + AI" "type:feat,area:ai-gateway,priority:P1" "RAG v0 — pgvector 인제스트 (FOMC 의사록·지표 해설)" <<'BODY'
cron→fetch→chunk→embed→upsert. 사용자 데이터 인제스트 금지(G2·G3).

**AC**: 코멘트 생성 시 top-k 주입 + 인용 표기.
BODY

issue "M2 Indicator Hub + AI" "type:feat,area:ai-gateway,priority:P0" "일일 배치 코멘트 — 전 사용자 공유 1회 생성 (Free, 한계비용 0)" <<'BODY'
Aurora(dovish)/Vesper(hawkish) 이중 해석. 안전필터 경유 + AI 고지(G6).

**AC**: cron 생성 + 고지 문구 포함 렌더.
BODY

issue "M2 Indicator Hub + AI" "type:infra,area:ai-gateway,priority:P1" "RAG 회귀 테스트 — golden question 20문항" <<'BODY'
환각/인용 없는 수치 출력 검증.

**AC**: CI 게이트 편입.
BODY

# ===== M3 =====
issue "M3 Profile + Learn" "type:feat,area:profile,priority:P0" "scoreGlRts + classifyBit 스코어링 완성 (Task 5 Green)" <<'BODY'
기존 24스텝 설문·user_investment_profile 재활용. 핵심 로직 직접 타이핑 원칙.

**AC**: 단위 테스트 green.
BODY

issue "M3 Profile + Learn" "type:feat,area:profile,priority:P0" "성향 결과 카드 — BIT 4유형 + 취약 편향 + 공유 이미지" <<'BODY'
"현재 스냅샷 + 재검사" 프레임(단정 라벨 금지).

**AC**: 공유 시 UTM 부착.
BODY

issue "M3 Profile + Learn" "type:feat,area:profile,priority:P1" "profile_snapshot 타임라인 — 분기 재검증 리마인더" <<'BODY'
founder-log 분기 재퀴즈 결정 재활용.

**AC**: 분기 경계 2주 전 리마인더 + 스냅샷 비교 뷰.
BODY

issue "M3 Profile + Learn" "type:feat,area:education,priority:P0" "교육 모듈 3개 (분산·비용·손실한계) + 퀴즈" <<'BODY'
v3 learning-cycle 원고 재활용. 종목/타이밍 내용 금지.

**AC**: 모듈→퀴즈→배지 흐름 완결.
BODY

issue "M3 Profile + Learn" "type:feat,area:education,priority:P1" "학습 게이미피케이션 — 배지/레벨/스트릭 (거래 게임화 금지)" <<'BODY'
학습만 게이미피케이션, 거래는 역게임화(AD-8 리더보드 금지 유지).

**AC**: 학습 완료율 이벤트 계측 포함.
BODY

issue "M3 Profile + Learn" "type:feat,area:profile,priority:P1" "성향→전략 카테고리 연결 (처방 아닌 필터 프레임)" <<'BODY'
"이 성향 사용자들이 일반적으로 검토하는 카테고리" 카피 — G2 경계 리뷰 필수.

**AC**: ux-copy 체크리스트 통과.
BODY

# ===== M4 =====
issue "M4 Portfolio L1-L2" "type:feat,area:rebalance,priority:P0" "포트폴리오 L1 — 수동 입력 + CSV 업로드" <<'BODY'
Bearings 분석기와 데이터 모델 공유.

**AC**: 익명으로도 동작, 로그인 시 저장 선택.
BODY

issue "M4 Portfolio L1-L2" "type:adr,area:rebalance,priority:P0" "ADR-0003: 1차 증권사 선정 + 클라이언트 사이드 키 보관 구조" <<'BODY'
약관 확인(#6) 반영. KIS 모의투자 우선 가설. 브라우저 직접 호출 vs 로컬 실행기 결정.
BODY

issue "M4 Portfolio L1-L2" "type:feat,area:rebalance,area:guardrail,priority:P0" "L2 읽기 연결 — 클라이언트 사이드 잔고 조회 (키 서버 미경유)" <<'BODY'
G3(단일 증권사·세션성)·G5(키 서버 미경유) 구현.

**AC**: 네트워크 검증 문서 — 키/잔고 원본이 서버로 전송되지 않음.
BODY

issue "M4 Portfolio L1-L2" "type:infra,area:guardrail,priority:P0" "안전필터 회귀 테스트 CI 게이트화 (기존 50+ 케이스)" <<'BODY'
G2의 기술적 강제.

**AC**: 개별 종목 추천 출력 시 CI red.
BODY

issue "M4 Portfolio L1-L2" "type:feat,area:rebalance,priority:P1" "Drift 뷰 — 전략 템플릿 대비 현재 비중 괴리" <<'BODY'
조회·표시만(권유 카피 금지), G6 고지 포함.
BODY

# ===== M5 =====
issue "M5 Rebalance L4" "type:feat,area:rebalance,priority:P0" "전략 템플릿 엔진 — 5종 파라미터화 (60/40, 올웨더 등)" <<'BODY'
출처·가정 전체 공시. 템플릿 정의는 코드가 아닌 데이터(JSON).
BODY

issue "M5 Rebalance L4" "type:feat,area:rebalance,priority:P0" "Rebalance 프리뷰 — 주문 묶음 생성 + AI '이유' 설명" <<'BODY'
서버는 시세+전략만으로 프리뷰(잔고는 클라이언트 제공). AI 설명은 안전필터 경유.

**AC**: 프리뷰 해시 고정.
BODY

issue "M5 Rebalance L4" "type:feat,area:rebalance,area:guardrail,priority:P0" "승인형 실행 — KIS 모의투자 (G1 불변식 코드 강제)" <<'BODY'
매 건 승인 · 유효시간 5분 · 프리뷰-주문 해시 일치 · 자동실행 옵션 부재를 테스트로 고정. 멱등성 키 + 감사 로그.

**AC**: 법령해석 회신(#4) 전 실계좌 배포 금지 게이트 명시.
BODY

issue "M5 Rebalance L4" "type:feat,area:rebalance,priority:P1" "실행 감사 로그 + 복기 화면 (투자 일지 씨앗)" <<'BODY'
승인 주체·시각·내용 타임라인. v3 journal 비전의 최소 버전.
BODY

# ===== M6 =====
issue "M6 Monetize" "type:legal,area:guardrail,priority:P0" "유사투자자문업 신고 완료 (M6 착수 게이트)" <<'BODY'
체크리스트(#5) 실행.

**AC**: 신고 수리증.
BODY

issue "M6 Monetize" "type:feat,area:ai-gateway,priority:P0" "Pro 구독 (정액) + BYOK 모델 티어" <<'BODY'
G4: 거래 연동 과금 금지. BYOK 키는 클라이언트 보관.

**AC**: Polar 결제 + 서버사이드 결제 이벤트 계측.
BODY

issue "M6 Monetize" "type:infra,priority:P2" "주간 운영 리추얼 자동화 — PostHog 요약 → 이슈 초안" <<'BODY'
운영 중 루프 최소 구현.

**AC**: 주 1회 요약이 이슈 코멘트로 생성.
BODY

issue "M6 Monetize" "type:feat,later,priority:P2" "[Later] 서비스 내 백오피스/모니터링 대시보드" <<'BODY'
유료 사용자 발생 후 착수. 그전까지 PostHog+Sentry+Projects.
BODY

issue "M6 Monetize" "type:legal,later,priority:P2" "[Later] 다계좌/자동실행/개별화 — 라이선스 트랙" <<'BODY'
자문업 등록 → 일임업+코스콤 RA 테스트베드(~7개월) → 혁신금융서비스. 법인화 전제. 트리거: 유료 전환 임계 도달.
BODY

echo ">> all issues created. open: https://github.com/$REPO/issues"
