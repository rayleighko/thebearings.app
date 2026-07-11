/**
 * Reference portfolios for comparison overlays (#result-viz).
 *
 * Option B invariant: benchmarks are HISTORICAL REFERENCE POINTS, never
 * "what you should hold". Copy in the UI layer must stay descriptive.
 * Weights are the textbook/public formulations, fully disclosed.
 */

import { analyzePortfolio, type AnalysisResult, type PortfolioPosition } from './engine';

export interface Benchmark {
  id: string;
  label: string;
  /** disclosed composition, shown in the methodology note */
  description: string;
  positions: PortfolioPosition[];
}

export const BENCHMARKS: Benchmark[] = [
  {
    id: 'sixtyForty',
    label: '60/40',
    description: 'Classic 60% US large-cap equity / 40% long-term treasuries.',
    positions: [
      { ticker: '60/40', assetClassId: 'usLargeCap', weight: 60 },
      { ticker: '60/40', assetClassId: 'usLongTreasury', weight: 40 },
    ],
  },
  {
    id: 'allWeather',
    label: 'All-Weather',
    description:
      'Public All-Weather-style mix: 30% equities, 40% long-term treasuries, 15% short-term treasuries, 7.5% gold, 7.5% commodities.',
    positions: [
      { ticker: 'AW', assetClassId: 'usLargeCap', weight: 30 },
      { ticker: 'AW', assetClassId: 'usLongTreasury', weight: 40 },
      { ticker: 'AW', assetClassId: 'usShortTreasury', weight: 15 },
      { ticker: 'AW', assetClassId: 'gold', weight: 7.5 },
      { ticker: 'AW', assetClassId: 'commodities', weight: 7.5 },
    ],
  },
];

const cache = new Map<string, AnalysisResult>();

export function benchmarkResult(id: string): AnalysisResult | null {
  const b = BENCHMARKS.find((x) => x.id === id);
  if (!b) return null;
  const hit = cache.get(id);
  if (hit) return hit;
  const r = analyzePortfolio(b.positions);
  cache.set(id, r);
  return r;
}

/**
 * Map regime exposures to matrix coordinates (−1…+1 on each axis).
 * x = inflation tilt: high-inflation half minus low-inflation half.
 * y = growth tilt: high-growth half minus low-growth half.
 */
export function matrixPosition(r: AnalysisResult): { x: number; y: number } {
  const e = Object.fromEntries(r.regimes.map((g) => [g.regime, g.exposure])) as Record<
    'recovery' | 'overheat' | 'stagflation' | 'deflation',
    number
  >;
  const x = (e.overheat + e.stagflation) / 2 - (e.recovery + e.deflation) / 2;
  const y = (e.recovery + e.overheat) / 2 - (e.stagflation + e.deflation) / 2;
  const clamp = (n: number) => Math.max(-1, Math.min(1, n));
  return { x: clamp(x), y: clamp(y) };
}
