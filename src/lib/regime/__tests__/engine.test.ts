import { describe, expect, it } from 'vitest';
import { analyzePortfolio, validateWeights, type PortfolioPosition } from '../engine';
import { ASSET_CLASSES, REGIMES } from '../dataset';
import { lookupAssetClass, normalizeTicker } from '../tickers';

const pos = (ticker: string, assetClassId: string, weight: number): PortfolioPosition => ({
  ticker,
  assetClassId,
  weight,
});

describe('dataset integrity', () => {
  it('every asset class has all 4 regime cells with valid scores', () => {
    for (const a of ASSET_CLASSES) {
      for (const r of REGIMES) {
        const cell = a.regimes[r];
        expect(cell, `${a.id}.${r}`).toBeDefined();
        expect([-2, -1, 0, 1, 2]).toContain(cell.score);
        expect(cell.note.length).toBeGreaterThan(10);
      }
    }
  });

  it('every asset class has all 3 episode cells', () => {
    for (const a of ASSET_CLASSES) {
      expect(Object.keys(a.episodes).sort()).toEqual(
        ['covid2020', 'gfc2008', 'inflation2022'].sort(),
      );
    }
  });
});

describe('ticker lookup', () => {
  it('normalizes user input', () => {
    expect(normalizeTicker(' $spy ')).toBe('SPY');
    expect(normalizeTicker('btc-usd')).toBe('BTC-USD');
  });

  it('maps known tickers and rejects unknown ones', () => {
    expect(lookupAssetClass('SPY')).toBe('usLargeCap');
    expect(lookupAssetClass('nvda')).toBe('usGrowthTech');
    expect(lookupAssetClass('TLT')).toBe('usLongTreasury');
    expect(lookupAssetClass('ZZZZ')).toBeNull();
  });
});

describe('validateWeights', () => {
  it('accepts totals within 99–101', () => {
    expect(validateWeights([pos('SPY', 'usLargeCap', 60), pos('TLT', 'usLongTreasury', 40)]).ok).toBe(true);
    expect(validateWeights([pos('SPY', 'usLargeCap', 50)]).ok).toBe(false);
    expect(validateWeights([]).ok).toBe(false);
  });
});

describe('analyzePortfolio', () => {
  it('100% US equity: bets on recovery, vulnerable to stagflation', () => {
    const r = analyzePortfolio([pos('SPY', 'usLargeCap', 100)]);
    expect(r.impliedBet).toBe('recovery');
    expect(r.vulnerability).toBe('stagflation');
    // exposure normalized: recovery score 2 → 1.0
    expect(r.regimes.find((x) => x.regime === 'recovery')?.exposure).toBe(1);
    expect(r.regimes.find((x) => x.regime === 'stagflation')?.exposure).toBe(-1);
  });

  it('60/40 stock-bond: episode math is the weighted sum', () => {
    const r = analyzePortfolio([
      pos('SPY', 'usLargeCap', 60),
      pos('TLT', 'usLongTreasury', 40),
    ]);
    const y2022 = r.episodes.find((e) => e.episode === 'inflation2022');
    // 0.6 × (−18.2) + 0.4 × (−31.2) = −23.4
    expect(y2022?.totalReturn).toBeCloseTo(-23.4, 1);
    expect(y2022?.coverage).toBe(1);
    // 2022 figures for SPY/TLT are measured, not estimates
    expect(y2022?.containsEstimates).toBe(false);
  });

  it('flags estimates when a contributing episode cell is estimated', () => {
    const r = analyzePortfolio([pos('GLD', 'gold', 100)]);
    const gfc = r.episodes.find((e) => e.episode === 'gfc2008');
    expect(gfc?.containsEstimates).toBe(true);
  });

  it('drops episode figures below 50% coverage instead of fabricating them', () => {
    // bitcoin has no 2008 data → coverage 0 for a BTC-only portfolio
    const r = analyzePortfolio([pos('BTC', 'bitcoin', 100)]);
    const gfc = r.episodes.find((e) => e.episode === 'gfc2008');
    expect(gfc?.totalReturn).toBeNull();
    expect(gfc?.coverage).toBe(0);
  });

  it('surfaces dataset warnings for the classes actually held', () => {
    const r = analyzePortfolio([
      pos('IBIT', 'bitcoin', 10),
      pos('SPY', 'usLargeCap', 90),
    ]);
    expect(r.warnings.some((w) => w.includes('Bitcoin'))).toBe(true);
  });

  it('normalizes weights that do not sum to exactly 100', () => {
    const a = analyzePortfolio([pos('SPY', 'usLargeCap', 50), pos('TLT', 'usLongTreasury', 50)]);
    const b = analyzePortfolio([pos('SPY', 'usLargeCap', 1), pos('TLT', 'usLongTreasury', 1)]);
    expect(a.regimes).toEqual(b.regimes);
  });

  it('never outputs recommendation-shaped fields (Option B smoke check)', () => {
    const r = analyzePortfolio([pos('SPY', 'usLargeCap', 100)]);
    const json = JSON.stringify(r).toLowerCase();
    for (const banned of ['buy', 'sell', 'recommend', 'should', 'target allocation']) {
      expect(json).not.toContain(banned);
    }
  });
});
