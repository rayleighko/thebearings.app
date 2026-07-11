/**
 * Regime performance dataset — the static, client-side heart of the analyzer.
 *
 * Sources (compiled 2026-07-11, full citations in docs/regime-methodology.md):
 * - "IC"  Merrill Lynch, The Investment Clock (2004) — US 1973–2004, real annualized by phase
 * - "BSV" Baltussen, Swinkels, van Vliet (SSRN 4153468) — 1875–2021 regimes
 * - "MAN" Neville, Draaisma, Funnell, Harvey, van Hemert — US inflation regimes 1926–2020
 * - "PSL" PortfoliosLab ETF total-return measurements (episodes)
 *
 * Option B invariant: this data DESCRIBES historical regime averages.
 * It is never rendered as a recommendation, allocation, or timing signal.
 *
 * score: -2 (strong negative) … +2 (strong positive) — editorial synthesis of
 * the sources above; disagreements noted in `note` and surfaced in the UI.
 * annualizedReturn: % per year, REAL terms unless note says otherwise; null = not found.
 * episodes: cumulative total return % over the window (not annualized).
 *   gfc2008:  2007-10-09 → 2009-03-09 (S&P peak → trough)
 *   covid2020: 2020-02-19 → 2020-03-23
 *   inflation2022: calendar year 2022
 *   Values marked estimate:true are derived from adjacent data, not exact-window
 *   measurements — replace via price API before any paid report ships (#32 AC).
 */

export const REGIMES = ['recovery', 'overheat', 'stagflation', 'deflation'] as const;
export type RegimeId = (typeof REGIMES)[number];

export const EPISODES = ['gfc2008', 'covid2020', 'inflation2022'] as const;
export type EpisodeId = (typeof EPISODES)[number];

export interface RegimeCell {
  /** -2 strong negative … +2 strong positive */
  score: -2 | -1 | 0 | 1 | 2;
  /** % per year, real terms unless noted; null when no defensible figure found */
  annualizedReturn: number | null;
  /** source + caveat, shown in the methodology drawer */
  note: string;
}

export interface EpisodeCell {
  /** cumulative total return % over the episode window; null = no data (e.g. BTC in 2008) */
  totalReturn: number | null;
  /** true when derived from adjacent data rather than exact-window measurement */
  estimate?: boolean;
}

export interface AssetClass {
  id: string;
  label: string;
  /** short Korean-free label used on the share card */
  shortLabel: string;
  regimes: Record<RegimeId, RegimeCell>;
  episodes: Record<EpisodeId, EpisodeCell>;
  /** extra reliability warning surfaced in UI (e.g. BTC sample size) */
  warning?: string;
}

export const REGIME_META: Record<
  RegimeId,
  { label: string; growth: 'up' | 'down'; inflation: 'up' | 'down' }
> = {
  recovery: { label: 'Recovery', growth: 'up', inflation: 'down' },
  overheat: { label: 'Overheat', growth: 'up', inflation: 'up' },
  stagflation: { label: 'Stagflation', growth: 'down', inflation: 'up' },
  deflation: { label: 'Deflation', growth: 'down', inflation: 'down' },
};

export const EPISODE_META: Record<EpisodeId, { label: string; window: string }> = {
  gfc2008: { label: '2008 Global Financial Crisis', window: 'Oct 2007 → Mar 2009' },
  covid2020: { label: '2020 COVID Crash', window: 'Feb 19 → Mar 23, 2020' },
  inflation2022: { label: '2022 Inflation Shock', window: 'Calendar year 2022' },
};

export const ASSET_CLASSES: AssetClass[] = [
  {
    id: 'usLargeCap',
    label: 'US Large-Cap Equity',
    shortLabel: 'US Stocks',
    regimes: {
      recovery: { score: 2, annualizedReturn: 19.9, note: 'IC: real 19.9%/yr — best regime, all sources agree.' },
      overheat: { score: 1, annualizedReturn: 6.0, note: 'IC real 6.0%; BSV mild-overshoot 8.2%. Positive but decelerating.' },
      stagflation: { score: -2, annualizedReturn: -11.7, note: 'IC real −11.7%; range −16.6% (BSV) to −7% (MAN).' },
      deflation: { score: -1, annualizedReturn: 6.4, note: 'Widest source disagreement: full-phase averages positive (IC +6.4) because they include rebounds; entry into recession is sharply negative (2008: −37%). Score reflects entry-phase direction.' },
    },
    episodes: {
      gfc2008: { totalReturn: -55.2 },
      covid2020: { totalReturn: -33.7 },
      inflation2022: { totalReturn: -18.2 },
    },
  },
  {
    id: 'usGrowthTech',
    label: 'US Growth / Tech',
    shortLabel: 'Tech',
    regimes: {
      recovery: { score: 2, annualizedReturn: null, note: 'Long-duration equity thrives on low rates + recovering growth; higher beta than large-cap.' },
      overheat: { score: 0, annualizedReturn: null, note: 'Earnings fine, but rising rates compress valuations — mixed.' },
      stagflation: { score: -2, annualizedReturn: null, note: 'Double hit: rates up, growth down. 2022 (−32.6%) is the live example.' },
      deflation: { score: -1, annualizedReturn: null, note: 'Falling rates help, but high beta falls hard into recession (2008: −42% yr); recovers fastest afterwards.' },
    },
    episodes: {
      gfc2008: { totalReturn: -50, estimate: true },
      covid2020: { totalReturn: -28.6 },
      inflation2022: { totalReturn: -32.6 },
    },
  },
  {
    id: 'intlDevEquity',
    label: 'International Developed Equity',
    shortLabel: 'Intl Stocks',
    regimes: {
      recovery: { score: 2, annualizedReturn: null, note: 'Global growth recovery beneficiary; pattern mirrors US (BSV global sample).' },
      overheat: { score: 1, annualizedReturn: null, note: 'Higher value/materials weight than US → relative resilience when inflation rises.' },
      stagflation: { score: -2, annualizedReturn: -16.6, note: 'BSV global equities in stagflation: real −16.6%/yr.' },
      deflation: { score: -1, annualizedReturn: null, note: 'Same logic as US large-cap; fell harder in GFC (−61%).' },
    },
    episodes: {
      gfc2008: { totalReturn: -61.0 },
      covid2020: { totalReturn: -33, estimate: true },
      inflation2022: { totalReturn: -14.4 },
    },
  },
  {
    id: 'emEquity',
    label: 'Emerging Markets Equity',
    shortLabel: 'EM Stocks',
    regimes: {
      recovery: { score: 2, annualizedReturn: null, note: 'Biggest beneficiary of easing liquidity + recovering global growth (2003-07, 2009-10).' },
      overheat: { score: 1, annualizedReturn: null, note: 'Commodity-exporter weight helps as inflation rises; strong USD offsets.' },
      stagflation: { score: -1, annualizedReturn: null, note: 'Tightening + strong USD are headwinds; commodity exposure is a partial hedge. 2022: −20.6%.' },
      deflation: { score: -2, annualizedReturn: null, note: 'Capital flight in crises → deepest drawdowns (GFC max −66.4%).' },
    },
    episodes: {
      gfc2008: { totalReturn: -62, estimate: true },
      covid2020: { totalReturn: -31, estimate: true },
      inflation2022: { totalReturn: -20.6 },
    },
  },
  {
    id: 'usLongTreasury',
    label: 'US Long-Term Treasuries',
    shortLabel: 'Long Bonds',
    regimes: {
      recovery: { score: 1, annualizedReturn: 7.0, note: 'IC: real 7.0% — falling inflation supports, recovering growth offsets.' },
      overheat: { score: -1, annualizedReturn: 0.2, note: 'IC real 0.2% — rising rates erode real returns to ~zero.' },
      stagflation: { score: -2, annualizedReturn: -1.9, note: 'IC −1.9% (intermediate); long bonds worse: MAN 30Y real −8%.' },
      deflation: { score: 2, annualizedReturn: 9.8, note: 'IC real 9.8%, BSV 8.4% — the classic deflation asset.' },
    },
    episodes: {
      gfc2008: { totalReturn: 23, estimate: true },
      covid2020: { totalReturn: 14, estimate: true },
      inflation2022: { totalReturn: -31.2 },
    },
  },
  {
    id: 'usShortTreasury',
    label: 'US Short-Term Treasuries / Cash',
    shortLabel: 'Cash/T-Bills',
    regimes: {
      recovery: { score: 0, annualizedReturn: 2.1, note: 'IC real 2.1% — big opportunity cost in the best equity regime.' },
      overheat: { score: 0, annualizedReturn: 1.2, note: 'IC real 1.2% — nominal yields follow hikes.' },
      stagflation: { score: 0, annualizedReturn: -0.3, note: 'IC real −0.3% but the best RELATIVE defense in IC; BSV shows down to −4.3% in high inflation.' },
      deflation: { score: 1, annualizedReturn: 3.3, note: 'IC real 3.3%, BSV 5.9% — principal preserved, real value rises.' },
    },
    episodes: {
      gfc2008: { totalReturn: 9, estimate: true },
      covid2020: { totalReturn: 1.5, estimate: true },
      inflation2022: { totalReturn: -3.8, estimate: true },
    },
  },
  {
    id: 'tips',
    label: 'TIPS (Inflation-Linked Bonds)',
    shortLabel: 'TIPS',
    regimes: {
      recovery: { score: 0, annualizedReturn: 3, note: 'MAN non-inflationary real +3%; lags nominals when inflation falls.' },
      overheat: { score: 1, annualizedReturn: null, note: 'Principal accretion helps; rising real rates offset.' },
      stagflation: { score: 1, annualizedReturn: 2, note: 'MAN inflation-regime real +2% — clear relative edge over nominals (−5~−8%). But 2022 shows real-rate spikes can still produce nominal losses (−12.3%).' },
      deflation: { score: 0, annualizedReturn: null, note: 'Duration helps, inflation accretion disappears; 2008 liquidity squeeze hit −14.6% before recovering.' },
    },
    episodes: {
      gfc2008: { totalReturn: 1, estimate: true },
      covid2020: { totalReturn: -1.7, estimate: true },
      inflation2022: { totalReturn: -12.3 },
    },
    warning: 'TIPS only exist since 1997 — inflation-regime figures include synthetic backfill (MAN).',
  },
  {
    id: 'igCorp',
    label: 'Investment-Grade Corporate Bonds',
    shortLabel: 'IG Bonds',
    regimes: {
      recovery: { score: 2, annualizedReturn: null, note: 'Spread compression + stable rates — best credit regime.' },
      overheat: { score: 0, annualizedReturn: null, note: 'Fundamentals fine; duration losses from rising rates.' },
      stagflation: { score: -2, annualizedReturn: -7, note: 'MAN inflation-regime IG real −7%; rates and spreads deteriorate together (2022: −17.9%).' },
      deflation: { score: 0, annualizedReturn: null, note: 'Contested cell: treasury rally helps, spread blowouts hurt; GFC window roughly flat (−21.5% drawdown mid-window, then recovery).' },
    },
    episodes: {
      gfc2008: { totalReturn: 0, estimate: true },
      covid2020: { totalReturn: -13, estimate: true },
      inflation2022: { totalReturn: -17.9 },
    },
  },
  {
    id: 'highYield',
    label: 'High-Yield Bonds',
    shortLabel: 'High Yield',
    regimes: {
      recovery: { score: 2, annualizedReturn: null, note: 'Falling defaults + spread compression — strongest early-cycle credit.' },
      overheat: { score: 1, annualizedReturn: null, note: 'Short duration + high carry absorb rate rises while growth holds.' },
      stagflation: { score: -2, annualizedReturn: -7, note: 'MAN inflation-regime HY real −7%; default risk joins as growth slows.' },
      deflation: { score: -2, annualizedReturn: null, note: 'Spreads explode in recessions (GFC max drawdown −34.3%); equity-like correlation.' },
    },
    episodes: {
      gfc2008: { totalReturn: -25, estimate: true },
      covid2020: { totalReturn: -22.0 },
      inflation2022: { totalReturn: -11.0 },
    },
  },
  {
    id: 'gold',
    label: 'Gold',
    shortLabel: 'Gold',
    regimes: {
      recovery: { score: -1, annualizedReturn: null, note: 'Rising real rates + risk-on = headwind (2013-15 is the archetype).' },
      overheat: { score: 1, annualizedReturn: 13, note: 'MAN inflation-regime real +13% (average across rising-inflation phases).' },
      stagflation: { score: 2, annualizedReturn: 13, note: 'One of the strongest 1970s assets. MAN +13% is 1970s-weighted — wide range.' },
      deflation: { score: 1, annualizedReturn: null, note: 'Falling real rates + safety bid (GFC window +24%), but early liquidity squeezes sell gold too (Nov 2008 −29% drawdown, Mar 2020).' },
    },
    episodes: {
      gfc2008: { totalReturn: 24, estimate: true },
      covid2020: { totalReturn: -3.6, estimate: true },
      inflation2022: { totalReturn: -0.8 },
    },
    warning: 'Gold regime data effectively starts 1971 (end of convertibility) — one long sample.',
  },
  {
    id: 'commodities',
    label: 'Broad Commodities',
    shortLabel: 'Commodities',
    regimes: {
      recovery: { score: -2, annualizedReturn: -7.9, note: 'IC real −7.9% — structurally weak while inflation falls.' },
      overheat: { score: 2, annualizedReturn: 19.7, note: 'IC real 19.7%; MAN +14% (energy +41%). All sources agree.' },
      stagflation: { score: 2, annualizedReturn: 28.6, note: 'IC real 28.6% — sample dominated by 1973-74/79-80 oil shocks; range +14% (MAN) to +28.6%.' },
      deflation: { score: -2, annualizedReturn: -11.9, note: 'IC real −11.9% — demand collapse hits directly (H2 2008, 2020).' },
    },
    episodes: {
      gfc2008: { totalReturn: -30, estimate: true },
      covid2020: { totalReturn: -27, estimate: true },
      inflation2022: { totalReturn: 19.3 },
    },
  },
  {
    id: 'reits',
    label: 'REITs',
    shortLabel: 'REITs',
    regimes: {
      recovery: { score: 2, annualizedReturn: null, note: 'Falling rates + recovering growth + easing credit (2009-15).' },
      overheat: { score: 0, annualizedReturn: null, note: 'Rent escalation hedges inflation; rising rates compress valuations — mixed.' },
      stagflation: { score: -1, annualizedReturn: -2, note: 'MAN residential real −2%; listed REITs more rate-sensitive (2022: −26.3%).' },
      deflation: { score: -2, annualizedReturn: null, note: 'Leverage + credit dependence → among the worst in recessions (GFC max −73%).' },
    },
    episodes: {
      gfc2008: { totalReturn: -71, estimate: true },
      covid2020: { totalReturn: -42.4 },
      inflation2022: { totalReturn: -26.3 },
    },
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    shortLabel: 'BTC',
    regimes: {
      recovery: { score: 1, annualizedReturn: null, note: 'High-beta response to liquidity expansion (2020: +303%). Under 2 observed cycles — no structural conclusion possible.' },
      overheat: { score: 0, annualizedReturn: null, note: '"Inflation hedge" narrative failed its 2021-22 test; direction unclear.' },
      stagflation: { score: -1, annualizedReturn: null, note: 'Single observation (2022: −64.3%) — traded as a risk asset under tightening.' },
      deflation: { score: -2, annualizedReturn: null, note: 'March 2020: −50% in two days — behaves as ultra-high-beta risk, not a haven.' },
    },
    episodes: {
      gfc2008: { totalReturn: null },
      covid2020: { totalReturn: -33, estimate: true },
      inflation2022: { totalReturn: -64.3 },
    },
    warning: 'Bitcoin has ~1.5 macro cycles of history. Regime scores are indicative only.',
  },
];

export const ASSET_CLASS_BY_ID: Record<string, AssetClass> = Object.fromEntries(
  ASSET_CLASSES.map((a) => [a.id, a]),
);
