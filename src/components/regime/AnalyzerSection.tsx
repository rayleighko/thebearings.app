'use client';

import { useMemo, useRef, useState } from 'react';
import { posthog } from '@/lib/analytics/posthog';
import { COHORT_EVENTS } from '@/lib/analytics/events';
import {
  ASSET_CLASSES,
  ASSET_CLASS_BY_ID,
  EPISODE_META,
  REGIME_META,
  type RegimeId,
} from '@/lib/regime/dataset';
import {
  analyzePortfolio,
  validateWeights,
  type AnalysisResult,
  type PortfolioPosition,
} from '@/lib/regime/engine';
import { lookupAssetClass, normalizeTicker } from '@/lib/regime/tickers';

/**
 * /regime analyzer (#8) + PMF instrumentation (#9).
 *
 * Everything runs client-side — tickers and weights are NEVER sent anywhere.
 * PostHog events carry only category-level properties (counts, regime ids);
 * no tickers, no weights (privacy spec, docs/master-plan.md §6).
 *
 * Option B: result copy DESCRIBES historical exposure. No recommendations,
 * no target allocations, no timing language.
 */

const ACCENT = '#A8243F';
const HAWK = '#E8A33D';
const REVISIT_KEY = 'bearings.regime.lastCompletedAt';
const REVISIT_MIN_MS = 60 * 60 * 1000; // 1h — ignore immediate re-runs
const REVISIT_MAX_MS = 7 * 24 * 60 * 60 * 1000; // 7d window

interface Row {
  id: number;
  ticker: string;
  weight: string;
  /** set when ticker is unknown and the user picked a class manually */
  manualClass: string;
}

const emptyRow = (id: number): Row => ({ id, ticker: '', weight: '', manualClass: '' });

function resolveClass(row: Row): string | null {
  if (!row.ticker.trim()) return null;
  return lookupAssetClass(row.ticker) ?? (row.manualClass || null);
}

export default function AnalyzerSection() {
  const [rows, setRows] = useState<Row[]>([emptyRow(1), emptyRow(2)]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const startedRef = useRef(false);
  const startedAtRef = useRef<number>(0);
  const nextId = useRef(3);

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    startedAtRef.current = Date.now();
    posthog.capture(COHORT_EVENTS.REGIME_ANALYSIS_STARTED, {});
  }

  function updateRow(id: number, patch: Partial<Row>) {
    markStarted();
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setResult(null);
    setShareState('idle');
  }

  function addRow() {
    setRows((rs) => [...rs, emptyRow(nextId.current++)]);
  }

  function removeRow(id: number) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
    setResult(null);
  }

  const filled = rows.filter((r) => r.ticker.trim() !== '');
  const unknownRows = filled.filter(
    (r) => lookupAssetClass(r.ticker) === null && !r.manualClass,
  );
  const weightTotal = filled.reduce((s, r) => s + (parseFloat(r.weight) || 0), 0);

  const positions: PortfolioPosition[] = useMemo(
    () =>
      filled
        .map((r) => ({
          ticker: normalizeTicker(r.ticker),
          assetClassId: resolveClass(r) ?? '',
          weight: parseFloat(r.weight) || 0,
        }))
        .filter((p) => p.assetClassId && p.weight > 0),
    [filled],
  );

  function handleAnalyze() {
    setError(null);
    if (filled.length === 0) {
      setError('Add at least one holding.');
      return;
    }
    if (unknownRows.length > 0) {
      setError('Pick an asset class for the highlighted tickers first.');
      return;
    }
    const { ok, total } = validateWeights(positions);
    if (!ok) {
      setError(`Weights add up to ${Math.round(total)}% — make them total 100%.`);
      return;
    }

    const analysis = analyzePortfolio(positions);
    setResult(analysis);

    // #9 — completion + revisit (category-level props only)
    const now = Date.now();
    posthog.capture(COHORT_EVENTS.REGIME_ANALYSIS_COMPLETED, {
      asset_count: positions.length,
      class_count: analysis.composition.length,
      implied_bet: analysis.impliedBet,
      vulnerability: analysis.vulnerability,
      duration_ms: startedAtRef.current ? now - startedAtRef.current : null,
    });
    try {
      const prev = Number(window.localStorage.getItem(REVISIT_KEY) ?? 0);
      if (prev && now - prev > REVISIT_MIN_MS && now - prev < REVISIT_MAX_MS) {
        posthog.capture(COHORT_EVENTS.REGIME_RESULT_REVISITED, {
          days_since_last: Math.round((now - prev) / (24 * 60 * 60 * 1000)),
        });
      }
      window.localStorage.setItem(REVISIT_KEY, String(now));
    } catch {
      /* storage unavailable — skip revisit tracking */
    }
  }

  async function handleShare() {
    if (!result) return;
    const bet = REGIME_META[result.impliedBet].label;
    const vuln = REGIME_META[result.vulnerability].label;
    const text = [
      `My portfolio is implicitly betting on ${bet.toUpperCase()} — and ${vuln.toLowerCase()} is what quietly breaks it.`,
      '',
      'Read yours (no login, data stays on your device):',
      'https://www.thebearings.app/regime?ref=share',
    ].join('\n');
    const canWebShare =
      typeof navigator !== 'undefined' && typeof navigator.share === 'function';
    try {
      if (canWebShare) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareState('copied');
      }
      posthog.capture(COHORT_EVENTS.REGIME_RESULT_SHARED, {
        channel: canWebShare ? 'web-share' : 'clipboard',
        implied_bet: result.impliedBet,
      });
    } catch {
      /* user dismissed share sheet */
    }
  }

  return (
    <section className="mt-12" aria-label="Portfolio regime analyzer">
      <p className="font-mono text-xs tracking-[0.18em] text-neutral-500">
        READ YOUR PORTFOLIO
      </p>
      <h2 className="mt-3 text-xl font-semibold text-neutral-50">
        Enter your holdings. The read happens on your device.
      </h2>

      {/* input rows */}
      <div className="mt-6 space-y-3">
        {rows.map((row) => {
          const unknown =
            row.ticker.trim() !== '' && lookupAssetClass(row.ticker) === null;
          return (
            <div key={row.id} className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor={`t-${row.id}`}>Ticker</label>
                <input
                  id={`t-${row.id}`}
                  value={row.ticker}
                  onChange={(e) => updateRow(row.id, { ticker: e.target.value, manualClass: '' })}
                  placeholder="Ticker (e.g. VOO)"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  className="min-h-[48px] w-0 flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 font-mono text-sm uppercase text-neutral-100 placeholder:normal-case placeholder:text-neutral-600 outline-none focus:border-neutral-500"
                />
                <label className="sr-only" htmlFor={`w-${row.id}`}>Weight percent</label>
                <input
                  id={`w-${row.id}`}
                  value={row.weight}
                  onChange={(e) => updateRow(row.id, { weight: e.target.value })}
                  placeholder="%"
                  inputMode="decimal"
                  className="min-h-[48px] w-20 rounded-md border border-neutral-700 bg-neutral-900 px-3 text-right font-mono text-sm text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove ${row.ticker || 'row'}`}
                  className="min-h-[48px] min-w-[44px] rounded-md border border-neutral-800 font-mono text-neutral-500 hover:text-neutral-300"
                >
                  ×
                </button>
              </div>
              {unknown && (
                <div className="mt-2">
                  <label
                    htmlFor={`c-${row.id}`}
                    className="font-mono text-[11px] tracking-wide"
                    style={{ color: HAWK }}
                  >
                    Unknown ticker — which asset class is it closest to?
                  </label>
                  <select
                    id={`c-${row.id}`}
                    value={row.manualClass}
                    onChange={(e) => updateRow(row.id, { manualClass: e.target.value })}
                    className="mt-1 min-h-[44px] w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 text-sm text-neutral-200"
                  >
                    <option value="">Select asset class…</option>
                    {ASSET_CLASSES.map((a) => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={addRow}
          className="min-h-[44px] rounded-md border border-neutral-800 px-4 font-mono text-xs tracking-wide text-neutral-400 hover:text-neutral-200"
        >
          + ADD HOLDING
        </button>
        <p
          className="font-mono text-xs"
          style={{ color: Math.round(weightTotal) === 100 ? '#8a8a8f' : HAWK }}
        >
          TOTAL {Math.round(weightTotal * 10) / 10}%
        </p>
      </div>

      <button
        type="button"
        onClick={handleAnalyze}
        className="mt-5 min-h-[52px] w-full rounded-lg px-6 text-base font-semibold text-neutral-50 transition-opacity duration-150 hover:opacity-90"
        style={{ backgroundColor: ACCENT }}
      >
        Read my regime
      </button>
      {error && (
        <p role="alert" className="mt-3 font-mono text-xs" style={{ color: HAWK }}>
          {error}
        </p>
      )}

      {/* results */}
      {result && (
        <div className="mt-10 space-y-8" role="region" aria-live="polite" aria-label="Analysis result">
          {/* headline read */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-5">
            <p className="font-mono text-xs tracking-[0.18em] text-neutral-500">THE READ</p>
            <p className="mt-3 text-lg leading-relaxed text-neutral-100">
              Historically, this mix performed best in{' '}
              <strong style={{ color: ACCENT }}>
                {REGIME_META[result.impliedBet].label.toUpperCase()}
              </strong>{' '}
              — that&apos;s the regime it is implicitly betting on. Its weakest
              historical regime is{' '}
              <strong style={{ color: HAWK }}>
                {REGIME_META[result.vulnerability].label.toUpperCase()}
              </strong>
              .
            </p>
          </div>

          {/* exposure bars */}
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-neutral-500">
              REGIME EXPOSURE (−1 … +1)
            </p>
            <div className="mt-4 space-y-3">
              {result.regimes.map((r) => (
                <div key={r.regime} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-xs tracking-wide text-neutral-400">
                    {REGIME_META[r.regime].label.toUpperCase()}
                  </span>
                  <div className="relative h-4 flex-1 rounded-sm bg-neutral-900">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-neutral-700" />
                    <div
                      className="absolute inset-y-0 rounded-sm"
                      style={{
                        left: r.exposure >= 0 ? '50%' : `${50 + r.exposure * 50}%`,
                        width: `${Math.abs(r.exposure) * 50}%`,
                        backgroundColor: r.exposure >= 0 ? ACCENT : HAWK,
                      }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right font-mono text-xs text-neutral-300">
                    {r.exposure > 0 ? '+' : ''}{r.exposure.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* dual read */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-800 p-4" style={{ borderLeftColor: ACCENT, borderLeftWidth: 2 }}>
              <p className="font-mono text-xs tracking-[0.14em]" style={{ color: ACCENT }}>DOVISH READ</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                If inflation cools from here, history puts this mix in its{' '}
                {avgSide(result, 'recovery', 'deflation') >= 0 ? 'stronger' : 'weaker'} half —
                driven by its {topClassLabel(result)} weight.
              </p>
            </div>
            <div className="rounded-lg border border-neutral-800 p-4" style={{ borderLeftColor: HAWK, borderLeftWidth: 2 }}>
              <p className="font-mono text-xs tracking-[0.14em]" style={{ color: HAWK }}>HAWKISH READ</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                If inflation re-accelerates, history puts this mix in its{' '}
                {avgSide(result, 'overheat', 'stagflation') >= 0 ? 'stronger' : 'weaker'} half.
                Two winds, always — neither read is a forecast.
              </p>
            </div>
          </div>

          {/* episode stress cards */}
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-neutral-500">
              IF YOU HAD HELD THIS MIX
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.episodes.map((e) => (
                <div key={e.episode} className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
                  <p className="font-mono text-[11px] tracking-wide text-neutral-500">
                    {EPISODE_META[e.episode].label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-neutral-600">
                    {EPISODE_META[e.episode].window}
                  </p>
                  <p className="mt-3 text-2xl font-semibold" style={{ color: (e.totalReturn ?? 0) >= 0 ? ACCENT : HAWK }}>
                    {e.totalReturn === null ? 'n/a' : `${e.totalReturn > 0 ? '+' : ''}${e.totalReturn}%`}
                  </p>
                  {e.totalReturn !== null && e.containsEstimates && (
                    <p className="mt-2 font-mono text-[10px] text-neutral-600">
                      includes estimated components*
                    </p>
                  )}
                  {e.totalReturn === null && (
                    <p className="mt-2 font-mono text-[10px] text-neutral-600">
                      insufficient data for this mix
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* warnings + methodology honesty — always shown with results */}
          <div className="border-l-2 border-neutral-700 pl-4">
            {result.warnings.map((w) => (
              <p key={w} className="text-xs leading-relaxed text-neutral-500">⚠ {w}</p>
            ))}
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              *Historical regime averages (1973–2021 academic datasets) and
              episode measurements; some episode cells are estimates from
              adjacent data. Past regimes describe the past — they don&apos;t
              predict the next one. Educational tool, not investment advice.
            </p>
          </div>

          {/* share */}
          <button
            type="button"
            onClick={handleShare}
            className="min-h-[48px] w-full rounded-lg border border-neutral-700 px-6 font-mono text-sm tracking-wide text-neutral-200 hover:border-neutral-500"
          >
            {shareState === 'copied' ? 'COPIED — PASTE IT ANYWHERE' : 'SHARE THIS READ'}
          </button>
        </div>
      )}
    </section>
  );
}

function avgSide(result: AnalysisResult, a: RegimeId, b: RegimeId): number {
  const ra = result.regimes.find((r) => r.regime === a)?.exposure ?? 0;
  const rb = result.regimes.find((r) => r.regime === b)?.exposure ?? 0;
  return (ra + rb) / 2;
}

function topClassLabel(result: AnalysisResult): string {
  const top = result.composition[0];
  return top ? ASSET_CLASS_BY_ID[top.assetClassId]?.label ?? 'largest' : 'largest';
}
