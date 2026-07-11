'use client';

/**
 * ResultMatrix — the landing's 2×2 instrument, reused as a RESULT view:
 * "where does this portfolio stand on the map?" (one-glance read).
 *
 * Marker position is continuous (inflation/growth tilt from regime
 * exposures), not just a quadrant pick — the instrument metaphor holds.
 * An optional benchmark marker renders in muted gray for comparison.
 * Identity is never color-alone: both markers carry text labels.
 */

const ACCENT = '#A8243F';
const MONO = "'Berkeley Mono','JetBrains Mono',monospace";

export interface MatrixMarker {
  /** −1…+1, inflation tilt (right = high inflation) */
  x: number;
  /** −1…+1, growth tilt (up = high growth) */
  y: number;
  label: string;
}

export default function ResultMatrix({
  portfolio,
  benchmark,
}: {
  portfolio: MatrixMarker;
  benchmark?: MatrixMarker | null;
}) {
  // plot frame: 40..280 in a 320 viewBox; y axis inverted (SVG down = positive)
  const px = (x: number) => 160 + x * 110;
  const py = (y: number) => 160 - y * 110;

  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label={`Regime map. Your portfolio sits at inflation tilt ${portfolio.x.toFixed(2)}, growth tilt ${portfolio.y.toFixed(2)}${
        benchmark ? `; benchmark ${benchmark.label} shown for comparison` : ''
      }.`}
      className="mx-auto h-auto w-full max-w-[360px]"
    >
      {/* frame + crosshair (matches the landing instrument) */}
      <rect x="40" y="40" width="240" height="240" fill="none" stroke="#2a2a2d" strokeWidth="1" />
      <line x1="160" y1="40" x2="160" y2="280" stroke="#3a3a3d" strokeWidth="1" />
      <line x1="40" y1="160" x2="280" y2="160" stroke="#3a3a3d" strokeWidth="1" />

      {/* quadrant labels */}
      <g fill="#8a8a8f" fontFamily={MONO} fontSize="9" letterSpacing="0.08em">
        <text x="100" y="60" textAnchor="middle">RECOVERY</text>
        <text x="220" y="60" textAnchor="middle">OVERHEAT</text>
        <text x="100" y="272" textAnchor="middle">DEFLATION</text>
        <text x="220" y="272" textAnchor="middle">STAGFLATION</text>
      </g>

      {/* axis labels */}
      <g fill="#aeaeb2" fontFamily={MONO} fontSize="10" letterSpacing="0.12em">
        <text x="160" y="302" textAnchor="middle">INFLATION →</text>
        <text x="20" y="160" textAnchor="middle" transform="rotate(-90 20 160)">GROWTH →</text>
      </g>

      {/* benchmark marker (muted, square — never color-alone) */}
      {benchmark && (
        <g>
          <rect
            x={px(benchmark.x) - 4}
            y={py(benchmark.y) - 4}
            width="8"
            height="8"
            fill="none"
            stroke="#8a8a8f"
            strokeWidth="1.5"
          />
          <text
            x={px(benchmark.x)}
            y={py(benchmark.y) + 20}
            textAnchor="middle"
            fill="#8a8a8f"
            fontFamily={MONO}
            fontSize="8.5"
            letterSpacing="0.08em"
          >
            {benchmark.label.toUpperCase()}
          </text>
        </g>
      )}

      {/* portfolio marker (accent, ringed circle) */}
      <g>
        <circle cx={px(portfolio.x)} cy={py(portfolio.y)} r="5" fill={ACCENT} />
        <circle
          cx={px(portfolio.x)}
          cy={py(portfolio.y)}
          r="11"
          fill="none"
          stroke={ACCENT}
          strokeWidth="1"
          opacity="0.5"
        />
        <text
          x={px(portfolio.x)}
          y={py(portfolio.y) - 16}
          textAnchor="middle"
          fill={ACCENT}
          fontFamily={MONO}
          fontSize="9"
          letterSpacing="0.1em"
        >
          {portfolio.label.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
