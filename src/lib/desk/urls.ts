import { isBearingsPublicHost, isDeskHost } from '@/lib/desk/hosts';

export const DESK_SHOP_ORIGIN = 'https://desk.thebearings.app';

/** Public desk paths: host uses `/dev`, localhost/preview keep `/desk/dev`. */
export function deskIndexHref(hostHeader: string): string {
  return isDeskHost(hostHeader) ? '/' : '/desk';
}

export function deskConceptHref(hostHeader: string, slug: string): string {
  return isDeskHost(hostHeader) ? `/${slug}` : `/desk/${slug}`;
}

export function deskBlogHref(hostHeader: string): string {
  return isDeskHost(hostHeader) ? '/blog' : '/desk/blog';
}

export function deskBlogPostHref(hostHeader: string, slug: string): string {
  return isDeskHost(hostHeader) ? `/blog/${slug}` : `/desk/blog/${slug}`;
}

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

export function deskDevHref(hostHeader: string): string {
  return isDeskHost(hostHeader) ? '/dev' : '/desk/dev';
}

/**
 * Shared chrome targets. Apex/www point at the desk host so the shop
 * stays one source of truth — do not duplicate product cards on www.
 */
export function deskChromeHrefs(hostHeader: string): {
  homeHref: string;
  shopHref: string;
  blogHref: string;
  devHref: string;
} {
  if (isBearingsPublicHost(hostHeader)) {
    return {
      homeHref: '/',
      shopHref: `${DESK_SHOP_ORIGIN}/`,
      blogHref: `${DESK_SHOP_ORIGIN}/blog`,
      devHref: `${DESK_SHOP_ORIGIN}/dev`,
    };
  }
  return {
    homeHref: deskIndexHref(hostHeader),
    shopHref: deskIndexHref(hostHeader),
    blogHref: deskBlogHref(hostHeader),
    devHref: deskDevHref(hostHeader),
  };
}
