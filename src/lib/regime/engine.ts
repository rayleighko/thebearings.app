/**
 * Regime analysis engine — pure functions, no I/O, fully client-side (#8).
 *
 * Option B invariant: outputs DESCRIBE exposure; no cell of this module may
 * produce recommendation language. Copy lives in the UI layer and passes
 * the ux-copy checklist there.
 */

import {
  ASSET_CLASS_BY_ID,
  EPISODES,
  REGIMES,
  type EpisodeId,
  type RegimeId,
} from './dataset';

export interface PortfolioPosition {
  /** normalized ticker (display) */
  ticker: string;
  /** resolved asset-class id (from TICKER_MAP or user fallback pick) */
  assetClassId: string;
  /** portfolio weight, 0–100 */
  weight: number;
}

export interface RegimeExposure {
  regime: RegimeId;
  /** weighted mean score, normalized to −1…+1 */
  exposure: number;
  /** weighted mean of annualizedReturn over positions that have one; null if <50% coverage */
  annualizedReturn: number | null;
  /** fraction (0–1) of weight backed by a quantitative return figure */
  returnCoverage: number;
}

export interface EpisodeResult {
  episode: EpisodeId;
  /** weighted portfolio total return over the window; null if <50% coverage */
  totalReturn: number | null;
  /** fraction of weight with episode data */
  coverage: number;
  /** true if any contributing cell is an estimate */
  containsEstimates: boolean;
}

export interface AnalysisResult {
  regimes: RegimeExposure[];
  /** regime with the highest exposure — "what this portfolio is betting on" */
  impliedBet: RegimeId;
  /** regime with the lowest exposure — "what quietly breaks it" */
  vulnerability: RegimeId;
  episodes: EpisodeResult[];
  /** weight-share per asset class, for the composition strip */
  composition: { assetClassId: string; weight: number }[];
  /** dataset warnings relevant to this portfolio (e.g. BTC sample size) */
  warnings: string[];
}

const MIN_COVERAGE = 0.5;

export function validateWeights(positions: PortfolioPosition[]): {
  ok: boolean;
  total: number;
} {
  const total = positions.reduce((s, p) => s + p.weight, 0);
  // tolerate rounding: 99–101
  return { ok: positions.length > 0 && total >= 99 && total <= 101, total };
}

export function analyzePortfolio(positions: PortfolioPosition[]): AnalysisResult {
  const totalWeight = positions.reduce((s, p) => s + p.weight, 0);
  if (totalWeight <= 0) throw new Error('empty portfolio');

  const norm = positions.map((p) => ({ ...p, w: p.weight / totalWeight }));

  const regimes: RegimeExposure[] = REGIMES.map((regime) => {
    let scoreSum = 0;
    let retSum = 0;
    let retWeight = 0;
    for (const p of norm) {
      const cell = ASSET_CLASS_BY_ID[p.assetClassId]?.regimes[regime];
      if (!cell) continue;
      scoreSum += cell.score * p.w;
      if (cell.annualizedReturn !== null) {
        retSum += cell.annualizedReturn * p.w;
        retWeight += p.w;
      }
    }
    return {
      regime,
      exposure: round2(scoreSum / 2), // scores are −2…+2 → normalize to −1…+1
      annualizedReturn: retWeight >= MIN_COVERAGE ? round1(retSum / retWeight) : null,
      returnCoverage: round2(retWeight),
    };
  });

  const sorted = [...regimes].sort((a, b) => b.exposure - a.exposure);

  const episodes: EpisodeResult[] = EPISODES.map((episode) => {
    let retSum = 0;
    let covered = 0;
    let containsEstimates = false;
    for (const p of norm) {
      const cell = ASSET_CLASS_BY_ID[p.assetClassId]?.episodes[episode];
      if (!cell || cell.totalReturn === null) continue;
      retSum += cell.totalReturn * p.w;
      covered += p.w;
      if (cell.estimate) containsEstimates = true;
    }
    return {
      episode,
      totalReturn: covered >= MIN_COVERAGE ? round1(retSum) : null,
      coverage: round2(covered),
      containsEstimates,
    };
  });

  const byClass = new Map<string, number>();
  for (const p of norm) {
    byClass.set(p.assetClassId, (byClass.get(p.assetClassId) ?? 0) + p.w);
  }
  const composition = [...byClass.entries()]
    .map(([assetClassId, weight]) => ({ assetClassId, weight: round2(weight) }))
    .sort((a, b) => b.weight - a.weight);

  const warnings = composition
    .map((c) => ASSET_CLASS_BY_ID[c.assetClassId]?.warning)
    .filter((w): w is string => Boolean(w));

  return {
    regimes,
    impliedBet: sorted[0].regime,
    vulnerability: sorted[sorted.length - 1].regime,
    episodes,
    composition,
    warnings: [...new Set(warnings)],
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
