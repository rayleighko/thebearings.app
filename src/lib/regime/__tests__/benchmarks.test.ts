import { describe, expect, it } from 'vitest';
import { BENCHMARKS, benchmarkResult, matrixPosition } from '../benchmarks';
import { analyzePortfolio } from '../engine';

describe('benchmarks', () => {
  it('every benchmark has weights summing to 100 and valid asset classes', () => {
    for (const b of BENCHMARKS) {
      const total = b.positions.reduce((s, p) => s + p.weight, 0);
      expect(total, b.id).toBe(100);
      const r = analyzePortfolio(b.positions);
      expect(r.regimes).toHaveLength(4);
    }
  });

  it('benchmarkResult caches and returns consistent results', () => {
    const a = benchmarkResult('sixtyForty');
    const b = benchmarkResult('sixtyForty');
    expect(a).toBe(b); // same cached object
    expect(benchmarkResult('nope')).toBeNull();
  });

  it('60/40 2022 episode matches the engine hand-calc (−23.4%)', () => {
    const r = benchmarkResult('sixtyForty');
    const y2022 = r?.episodes.find((e) => e.episode === 'inflation2022');
    expect(y2022?.totalReturn).toBeCloseTo(-23.4, 1);
  });

  it('matrixPosition: equity-heavy mix tilts up-left (growth up, inflation down)', () => {
    const r = analyzePortfolio([{ ticker: 'SPY', assetClassId: 'usLargeCap', weight: 100 }]);
    const { x, y } = matrixPosition(r);
    expect(x).toBeLessThan(0); // low-inflation half
    expect(y).toBeGreaterThan(0); // high-growth half
  });

  it('matrixPosition: commodities tilt right (high inflation)', () => {
    const r = analyzePortfolio([{ ticker: 'DBC', assetClassId: 'commodities', weight: 100 }]);
    expect(matrixPosition(r).x).toBeGreaterThan(0);
  });

  it('matrixPosition clamps to −1…+1', () => {
    const r = analyzePortfolio([{ ticker: 'SPY', assetClassId: 'usLargeCap', weight: 100 }]);
    const { x, y } = matrixPosition(r);
    expect(Math.abs(x)).toBeLessThanOrEqual(1);
    expect(Math.abs(y)).toBeLessThanOrEqual(1);
  });
});
