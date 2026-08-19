import type { Metadata } from 'next';

export const DESK_BRAND_NAME = '살까말까 연구소';
export const DESK_SHOP_HEADING = '책상 물건';
export const DESK_BRAND_DESCRIPTION =
  '책상에서 직접 쓰는 물건만 모읍니다. 살까 말까를 적어 두는 연구소입니다.';
export const DESK_ABOUT =
  '책상에서 직접 쓰는 물건만 모읍니다. 살까 말까를 적어 두는 연구소입니다.';
export const DESK_YOUTUBE_HREF = 'https://www.youtube.com/@sal-kka-lab';
export const DESK_YOUTUBE_HANDLE = '@sal-kka-lab';
export const DESK_YOUTUBE_LABEL = '살까말까 연구소';

/** Channel mark — scale + wordmark lockup. Used for in-page chrome and default OG. */
export const DESK_LOGO_SRC = '/desk/logo.png';
export const DESK_LOGO_WIDTH = 1024;
export const DESK_LOGO_HEIGHT = 1024;

export const DESK_ICONS: NonNullable<Metadata['icons']> = {
  icon: [
    { url: '/desk/favicon-32.png', type: 'image/png', sizes: '32x32' },
    { url: '/desk/favicon-16.png', type: 'image/png', sizes: '16x16' },
    { url: '/desk/favicon-48.png', type: 'image/png', sizes: '48x48' },
    { url: '/desk/icon-192.png', type: 'image/png', sizes: '192x192' },
    { url: '/desk/icon-512.png', type: 'image/png', sizes: '512x512' },
  ],
  apple: { url: '/desk/apple-touch-icon.png', sizes: '180x180' },
};

export const DESK_OPEN_GRAPH: NonNullable<Metadata['openGraph']> = {
  title: DESK_BRAND_NAME,
  description: DESK_BRAND_DESCRIPTION,
  siteName: DESK_BRAND_NAME,
  locale: 'ko_KR',
  type: 'website',
  images: [
    {
      url: DESK_LOGO_SRC,
      alt: DESK_BRAND_NAME,
      width: DESK_LOGO_WIDTH,
      height: DESK_LOGO_HEIGHT,
    },
  ],
};

export const DESK_TWITTER: NonNullable<Metadata['twitter']> = {
  card: 'summary',
  title: DESK_BRAND_NAME,
  description: DESK_BRAND_DESCRIPTION,
  images: [DESK_LOGO_SRC],
};

/**
 * Well-known root files browsers request even when <link rel="icon"> points
 * at /desk/*. On desk/go those paths otherwise serve the Cohort pomegranate.
 * Destinations are existing 살까말까 assets — do not invent a new mark.
 */
export const DESK_BRAND_REWRITES: Record<string, string> = {
  '/favicon.ico': '/desk/favicon-32.png',
  '/favicon.svg': '/desk/mark.png',
  '/apple-touch-icon.png': '/desk/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png': '/desk/apple-touch-icon.png',
  '/favicon-96x96.png': '/desk/favicon-48.png',
  '/site.webmanifest': '/desk.webmanifest',
  '/manifest.json': '/desk.webmanifest',
};

export function deskBrandRewritePath(pathname: string): string | null {
  return DESK_BRAND_REWRITES[pathname] ?? null;
}

/** Public files that must not be rewritten to the desk missing concept. */
export function isDeskPublicFile(pathname: string): boolean {
  return pathname === '/desk.webmanifest';
}
