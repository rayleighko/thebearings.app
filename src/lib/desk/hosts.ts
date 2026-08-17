/**
 * Host checks for desk.thebearings.app + go.thebearings.app.
 * One Next.js app serves both; thebearings.app root is untouched.
 */

const DESK_HOSTS = new Set(['desk.thebearings.app']);
const GO_HOSTS = new Set(['go.thebearings.app']);
const BEARINGS_PUBLIC_HOSTS = new Set([
  'thebearings.app',
  'www.thebearings.app',
]);
const COHORT_ARCHIVE_HOSTS = new Set(['cohort.co.kr', 'www.cohort.co.kr']);

export function hostnameFromHostHeader(hostHeader: string): string {
  return hostHeader.split(':')[0]?.toLowerCase() ?? '';
}

export function isDeskHost(hostHeader: string): boolean {
  const host = hostnameFromHostHeader(hostHeader);
  return DESK_HOSTS.has(host) || host === 'desk.localhost';
}

export function isGoHost(hostHeader: string): boolean {
  const host = hostnameFromHostHeader(hostHeader);
  return GO_HOSTS.has(host) || host === 'go.localhost';
}

export function isDeskOrGoHost(hostHeader: string): boolean {
  return isDeskHost(hostHeader) || isGoHost(hostHeader);
}

/** Apex + www only — not desk/go subdomains. */
export function isBearingsPublicHost(hostHeader: string): boolean {
  return BEARINGS_PUBLIC_HOSTS.has(hostnameFromHostHeader(hostHeader));
}

/** Archived Korean Cohort landing only. Preview / localhost are not this. */
export function isCohortArchiveHost(hostHeader: string): boolean {
  return COHORT_ARCHIVE_HOSTS.has(hostnameFromHostHeader(hostHeader));
}

/** Vercel preview + local — validate desk, not the archived Cohort landing. */
export function isPreviewOrLocalHost(hostHeader: string): boolean {
  const host = hostnameFromHostHeader(hostHeader);
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.vercel.app')
  );
}
