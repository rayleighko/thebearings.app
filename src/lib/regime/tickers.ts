/**
 * Ticker → asset-class mapping (V1, curated).
 *
 * Design (#8, master-plan §3.4): user experience is ticker-level input,
 * computation is asset-class-level — this keeps everything client-side
 * (privacy promise) with zero market-data cost.
 *
 * Unknown tickers fall back to a user-facing asset-class picker (UI concern).
 * Keep this list boring and defensible; when in doubt, leave a ticker out
 * rather than guess its class.
 */

export const TICKER_MAP: Record<string, string> = {
  // --- US large-cap / total-market ETFs ---
  SPY: 'usLargeCap', VOO: 'usLargeCap', IVV: 'usLargeCap', VTI: 'usLargeCap',
  ITOT: 'usLargeCap', SCHB: 'usLargeCap', SPLG: 'usLargeCap', DIA: 'usLargeCap',
  RSP: 'usLargeCap', VV: 'usLargeCap', SCHX: 'usLargeCap', IWB: 'usLargeCap',
  VIG: 'usLargeCap', SCHD: 'usLargeCap', DVY: 'usLargeCap', VYM: 'usLargeCap',
  VTV: 'usLargeCap', IWD: 'usLargeCap', // value tilts ≈ large-cap behavior
  IWM: 'usLargeCap', VB: 'usLargeCap',  // small-cap: closer to large-cap than any other V1 class
  BRK_B: 'usLargeCap', 'BRK.B': 'usLargeCap', BRKB: 'usLargeCap',
  JPM: 'usLargeCap', BAC: 'usLargeCap', WFC: 'usLargeCap', GS: 'usLargeCap',
  JNJ: 'usLargeCap', PG: 'usLargeCap', KO: 'usLargeCap', PEP: 'usLargeCap',
  WMT: 'usLargeCap', COST: 'usLargeCap', MCD: 'usLargeCap', DIS: 'usLargeCap',
  XOM: 'usLargeCap', CVX: 'usLargeCap', UNH: 'usLargeCap', LLY: 'usLargeCap',
  PFE: 'usLargeCap', MRK: 'usLargeCap', ABBV: 'usLargeCap', HD: 'usLargeCap',
  CAT: 'usLargeCap', BA: 'usLargeCap', GE: 'usLargeCap', V: 'usLargeCap',
  MA: 'usLargeCap', AXP: 'usLargeCap', T: 'usLargeCap', VZ: 'usLargeCap',

  // --- US growth / tech ---
  QQQ: 'usGrowthTech', QQQM: 'usGrowthTech', VGT: 'usGrowthTech', XLK: 'usGrowthTech',
  VUG: 'usGrowthTech', IWF: 'usGrowthTech', SCHG: 'usGrowthTech', MGK: 'usGrowthTech',
  ARKK: 'usGrowthTech', SMH: 'usGrowthTech', SOXX: 'usGrowthTech', IGV: 'usGrowthTech',
  AAPL: 'usGrowthTech', MSFT: 'usGrowthTech', GOOGL: 'usGrowthTech', GOOG: 'usGrowthTech',
  AMZN: 'usGrowthTech', META: 'usGrowthTech', NVDA: 'usGrowthTech', TSLA: 'usGrowthTech',
  AMD: 'usGrowthTech', AVGO: 'usGrowthTech', CRM: 'usGrowthTech', ADBE: 'usGrowthTech',
  NFLX: 'usGrowthTech', ORCL: 'usGrowthTech', INTC: 'usGrowthTech', QCOM: 'usGrowthTech',
  TSM: 'usGrowthTech', ASML: 'usGrowthTech', SHOP: 'usGrowthTech', UBER: 'usGrowthTech',
  PLTR: 'usGrowthTech', COIN: 'usGrowthTech', SQ: 'usGrowthTech', PYPL: 'usGrowthTech',
  CSCO: 'usGrowthTech', TXN: 'usGrowthTech', MU: 'usGrowthTech', NOW: 'usGrowthTech',

  // --- International developed ---
  EFA: 'intlDevEquity', VEA: 'intlDevEquity', IEFA: 'intlDevEquity', SCHF: 'intlDevEquity',
  VXUS: 'intlDevEquity', IXUS: 'intlDevEquity', VEU: 'intlDevEquity',
  EWJ: 'intlDevEquity', EZU: 'intlDevEquity', VGK: 'intlDevEquity', EWU: 'intlDevEquity',
  EWG: 'intlDevEquity', EWC: 'intlDevEquity', EWA: 'intlDevEquity',

  // --- Emerging markets ---
  EEM: 'emEquity', VWO: 'emEquity', IEMG: 'emEquity', SCHE: 'emEquity',
  EWZ: 'emEquity', FXI: 'emEquity', MCHI: 'emEquity', KWEB: 'emEquity',
  INDA: 'emEquity', EWY: 'emEquity', EWT: 'emEquity', EIDO: 'emEquity',
  BABA: 'emEquity', PDD: 'emEquity',

  // --- US long-term treasuries ---
  TLT: 'usLongTreasury', VGLT: 'usLongTreasury', EDV: 'usLongTreasury',
  SPTL: 'usLongTreasury', TMF: 'usLongTreasury', ZROZ: 'usLongTreasury',
  IEF: 'usLongTreasury', VGIT: 'usLongTreasury', GOVT: 'usLongTreasury', // intermediate ≈ long-half behavior

  // --- Short-term treasuries / cash-like ---
  SHY: 'usShortTreasury', BIL: 'usShortTreasury', SGOV: 'usShortTreasury',
  SHV: 'usShortTreasury', VGSH: 'usShortTreasury', USFR: 'usShortTreasury',
  TFLO: 'usShortTreasury', CASH: 'usShortTreasury',

  // --- TIPS ---
  TIP: 'tips', VTIP: 'tips', SCHP: 'tips', STIP: 'tips', LTPZ: 'tips',

  // --- IG corporates / aggregate ---
  LQD: 'igCorp', VCIT: 'igCorp', VCSH: 'igCorp', IGIB: 'igCorp',
  AGG: 'igCorp', BND: 'igCorp', BNDX: 'igCorp', // aggregate: majority IG duration profile

  // --- High yield ---
  HYG: 'highYield', JNK: 'highYield', SHYG: 'highYield', USHY: 'highYield',
  EMB: 'highYield', // EM sovereign USD debt: HY-like spread behavior in stress

  // --- Gold ---
  GLD: 'gold', IAU: 'gold', GLDM: 'gold', SGOL: 'gold', PHYS: 'gold',
  GDX: 'gold', GDXJ: 'gold', // miners: leveraged gold proxy (imperfect)

  // --- Broad commodities / energy ---
  DBC: 'commodities', PDBC: 'commodities', GSG: 'commodities', COMT: 'commodities',
  USO: 'commodities', UNG: 'commodities', XLE: 'commodities', SLV: 'commodities',
  DBA: 'commodities', COPX: 'commodities',

  // --- REITs ---
  VNQ: 'reits', SCHH: 'reits', IYR: 'reits', XLRE: 'reits', VNQI: 'reits',
  O: 'reits', PLD: 'reits', AMT: 'reits', SPG: 'reits',

  // --- Crypto ---
  BTC: 'bitcoin', 'BTC-USD': 'bitcoin', IBIT: 'bitcoin', FBTC: 'bitcoin',
  GBTC: 'bitcoin', BITO: 'bitcoin',
  ETH: 'bitcoin', 'ETH-USD': 'bitcoin', ETHA: 'bitcoin', // mapped to BTC class with its warning
};

/** Normalize user input: trim, uppercase, strip $ prefix, unify share-class dots. */
export function normalizeTicker(raw: string): string {
  return raw.trim().toUpperCase().replace(/^\$/, '').replace(/\s+/g, '');
}

export function lookupAssetClass(rawTicker: string): string | null {
  const t = normalizeTicker(rawTicker);
  return TICKER_MAP[t] ?? null;
}
