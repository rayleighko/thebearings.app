/**
 * Path rewrite for desk.thebearings.app and go.thebearings.app.
 * Browser URL stays host-based (`/dev`, `/arm-nb-f80`); App Router sees `/desk/…` / `/go/…`.
 */

import { isDeskPublicFile } from '@/lib/desk/brand';

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

/** Next metadata routes — must not become a missing desk concept. */
const CRAWLER_FILES = new Set(['/sitemap.xml', '/robots.txt']);

function isCrawlerFile(pathname: string): boolean {
  return CRAWLER_FILES.has(pathname);
}

function isDeskBlogPath(pathname: string): boolean {
  return pathname === '/blog' || pathname.startsWith('/blog/');
}

/**
 * Returns the App Router path to rewrite to, or `null` to pass through.
 * Unmatched desk-host paths rewrite to a missing concept so nested not-found
 * (Desk UI) renders instead of the root Cohort 404.
 */
export function deskRewritePath(pathname: string): string | null {
  if (
    isPassthrough(pathname, '/go') ||
    isPassthrough(pathname, '/desk') ||
    isDeskPublicFile(pathname) ||
    isCrawlerFile(pathname)
  ) {
    return null;
  }
  if (pathname === '/') return '/desk';
  if (isDeskBlogPath(pathname)) return `/desk${pathname}`;
  const slug = singleSegmentSlug(pathname);
  if (slug) return `/desk/${slug}`;
  return DESK_MISSING_PATH;
}

/**
 * Returns the App Router path to rewrite to, or `null` to pass through.
 * Unmatched go-host paths rewrite to `/go` (index calls `notFound()`).
 */
export function goRewritePath(pathname: string): string | null {
  if (
    isPassthrough(pathname, '/go') ||
    isDeskPublicFile(pathname) ||
    isCrawlerFile(pathname)
  ) {
    return null;
  }
  if (pathname === '/') return '/go';
  const slug = singleSegmentSlug(pathname);
  if (slug) return `/go/${slug}`;
  return '/go';
}

/**
 * On desk.thebearings.app, `/desk` and `/desk/:slug` are internal App Router
 * paths. Strip the prefix so the public URL is `/` and `/dev`.
 */
export function deskCanonicalPath(pathname: string): string | null {
  if (pathname === '/desk' || pathname === '/desk/') return '/';
  if (pathname.startsWith('/desk/')) {
    const rest = pathname.slice('/desk'.length);
    return rest || '/';
  }
  return null;
}

/** Same for go.thebearings.app `/go/:slug` → `/:slug`. */
export function goCanonicalPath(pathname: string): string | null {
  if (pathname === '/go' || pathname === '/go/') return '/';
  if (pathname.startsWith('/go/')) {
    const rest = pathname.slice('/go'.length);
    return rest || '/';
  }
  return null;
}
