/**
 * Path rewrite for desk.thebearings.app and go.thebearings.app.
 * Browser URL stays host-based (`/dev`, `/arm-nb-f80`); App Router sees `/desk/…` / `/go/…`.
 */

const HOST_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Reserved internal path — not a real concept. Triggers desk `notFound()`. */
export const DESK_MISSING_PATH = '/desk/missing';

export function singleSegmentSlug(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 1) return null;
  return HOST_SLUG_RE.test(segments[0]) ? segments[0] : null;
}

function isPassthrough(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Returns the App Router path to rewrite to, or `null` to pass through.
 * Unmatched desk-host paths rewrite to a missing concept so nested not-found
 * (Desk UI) renders instead of the root Cohort 404.
 */
export function deskRewritePath(pathname: string): string | null {
  if (isPassthrough(pathname, '/go') || isPassthrough(pathname, '/desk')) {
    return null;
  }
  if (pathname === '/') return '/desk';
  const slug = singleSegmentSlug(pathname);
  if (slug) return `/desk/${slug}`;
  return DESK_MISSING_PATH;
}

/**
 * Returns the App Router path to rewrite to, or `null` to pass through.
 * Unmatched go-host paths rewrite to `/go` (index calls `notFound()`).
 */
export function goRewritePath(pathname: string): string | null {
  if (isPassthrough(pathname, '/go')) {
    return null;
  }
  if (pathname === '/') return '/go';
  const slug = singleSegmentSlug(pathname);
  if (slug) return `/go/${slug}`;
  return '/go';
}
