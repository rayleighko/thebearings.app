import type { Metadata, MetadataRoute } from 'next';
import { listPublishedConcepts, type Item } from '@/data/concepts';
import { listIndexableDeskBlogPosts } from '@/lib/desk/blog';
import {
  isBearingsPublicHost,
  isCohortArchiveHost,
  isDeskHost,
  isGoHost,
  isPreviewOrLocalHost,
  hostnameFromHostHeader,
} from '@/lib/desk/hosts';
import {
  deskBlogHref,
  deskBlogPostHref,
  deskConceptHref,
  deskIndexHref,
} from '@/lib/desk/urls';

export const DESK_PUBLIC_ORIGIN = 'https://desk.thebearings.app';
export const GO_PUBLIC_ORIGIN = 'https://go.thebearings.app';
export const BEARINGS_PUBLIC_ORIGIN = 'https://www.thebearings.app';
export const COHORT_PUBLIC_ORIGIN = 'https://cohort.co.kr';

export function publicOriginForHost(hostHeader: string): string {
  if (isDeskHost(hostHeader)) return DESK_PUBLIC_ORIGIN;
  if (isGoHost(hostHeader)) return GO_PUBLIC_ORIGIN;
  if (isBearingsPublicHost(hostHeader)) return BEARINGS_PUBLIC_ORIGIN;
  if (isCohortArchiveHost(hostHeader)) return COHORT_PUBLIC_ORIGIN;
  const host = hostnameFromHostHeader(hostHeader);
  if (!host) return DESK_PUBLIC_ORIGIN;
  const proto = host === 'localhost' || host.endsWith('.localhost') ? 'http' : 'https';
  return `${proto}://${host}`;
}

function absoluteUrl(origin: string, path: string): string {
  if (path === '/') return `${origin}/`;
  return `${origin}${path}`;
}

function deskAssetUrl(origin: string, src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${origin}${src}`;
}

/**
 * Naver Search Advisor HTML-tag for https://desk.thebearings.app
 * (operator paste 2026-08-19). Public webmaster token — desk layout only.
 */
export const DESK_NAVER_SITE_VERIFICATION =
  '4a88cabec7e8636b0c46680b39411390990786fc';

/** Desk-host verification. Naver token is hardcoded; Google stays env-only. */
export function deskVerificationMetadata(): Metadata['verification'] {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  return {
    ...(google ? { google } : {}),
    other: { 'naver-site-verification': DESK_NAVER_SITE_VERIFICATION },
  };
}

export function buildDeskSitemap(
  hostHeader: string,
  now = new Date(),
): MetadataRoute.Sitemap {
  const origin = publicOriginForHost(hostHeader);
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(origin, deskIndexHref(hostHeader)),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  for (const concept of listPublishedConcepts()) {
    entries.push({
      url: absoluteUrl(origin, deskConceptHref(hostHeader, concept.slug)),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  entries.push({
    url: absoluteUrl(origin, deskBlogHref(hostHeader)),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  });

  for (const post of listIndexableDeskBlogPosts()) {
    entries.push({
      url: absoluteUrl(origin, deskBlogPostHref(hostHeader, post.slug)),
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.4,
    });
  }

  return entries;
}

/** Existing Bearings public routes — do not add /regime here; that list is unchanged. */
export function buildBearingsSitemap(now = new Date()): MetadataRoute.Sitemap {
  const base = BEARINGS_PUBLIC_ORIGIN;
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/waitlist`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
}

export function buildCohortSitemap(now = new Date()): MetadataRoute.Sitemap {
  const base = COHORT_PUBLIC_ORIGIN;
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/waitlist`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
}

export function buildSitemapForHost(
  hostHeader: string,
  now = new Date(),
): MetadataRoute.Sitemap {
  if (isGoHost(hostHeader)) return [];
  if (isDeskHost(hostHeader) || isPreviewOrLocalHost(hostHeader)) {
    return buildDeskSitemap(hostHeader, now);
  }
  if (isBearingsPublicHost(hostHeader)) {
    return buildBearingsSitemap(now);
  }
  return buildCohortSitemap(now);
}

export function buildRobotsForHost(hostHeader: string): MetadataRoute.Robots {
  if (isGoHost(hostHeader)) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }
  if (isDeskHost(hostHeader) || isPreviewOrLocalHost(hostHeader)) {
    const origin = publicOriginForHost(hostHeader);
    return {
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${origin}/sitemap.xml`,
      host: origin.replace(/^https?:\/\//, ''),
    };
  }
  if (isBearingsPublicHost(hostHeader)) {
    return {
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${BEARINGS_PUBLIC_ORIGIN}/sitemap.xml`,
      host: 'www.thebearings.app',
    };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${COHORT_PUBLIC_ORIGIN}/sitemap.xml`,
    host: 'cohort.co.kr',
  };
}

export function deskItemListJsonLd({
  name,
  items,
  pageUrl,
  origin = DESK_PUBLIC_ORIGIN,
}: {
  name: string;
  items: Item[];
  pageUrl: string;
  origin?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        image: deskAssetUrl(origin, item.img),
        url: pageUrl,
      },
    })),
  };
}

export function deskConceptListJsonLd({
  pageUrl,
  items,
}: {
  pageUrl: string;
  items: { name: string; url: string }[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '살까말까 연구소 책상 컨셉',
    url: pageUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function deskBlogPostingJsonLd({
  headline,
  description,
  datePublished,
  url,
}: {
  headline: string;
  description: string;
  datePublished: string;
  url: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    url,
    author: {
      '@type': 'Organization',
      name: '살까말까 연구소',
      url: DESK_PUBLIC_ORIGIN,
    },
  };
}
