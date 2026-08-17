/**
 * Affiliate hrefs go through the go redirect so every click is logged.
 * On production, prefer the dedicated go host (cleaner referrer).
 * Locally, same-origin /go/:slug works without extra DNS.
 */
export function getAffiliateHref(slug: string): string {
  const goHost = process.env.NEXT_PUBLIC_GO_HOST?.trim();
  const encoded = encodeURIComponent(slug);
  if (goHost) {
    return `https://${goHost}/${encoded}`;
  }
  return `/go/${encoded}`;
}

export const AFFILIATE_REL = 'nofollow sponsored noopener';
