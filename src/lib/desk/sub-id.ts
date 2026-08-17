/**
 * Coupang Partners subId: `{concept}-{slug}-{YYYYMMDD}` (UTC).
 * Example: dev-arm-nb-f80-20260817
 */
export function buildSubId(
  concept: string,
  slug: string,
  now: Date = new Date(),
): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${concept}-${slug}-${y}${m}${d}`;
}
