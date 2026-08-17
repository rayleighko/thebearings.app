import type { Metadata, Viewport } from 'next';
import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import '@/styles/globals.css';
import PostHogProvider from '@/components/analytics/PostHogProvider';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';
import { ConditionalFooter } from '@/components/layout/ConditionalFooter';
import {
  isBearingsPublicHost,
  isDeskOrGoHost,
  isPreviewOrLocalHost,
} from '@/lib/desk/hosts';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Cohort';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cohort.co.kr';

const BEARINGS_ICONS: NonNullable<Metadata['icons']> = {
  icon: [
    { url: '/bearings/favicon.ico', sizes: 'any' },
    { url: '/bearings/favicon-16.png', type: 'image/png', sizes: '16x16' },
    { url: '/bearings/favicon-32.png', type: 'image/png', sizes: '32x32' },
    { url: '/bearings/favicon-48.png', type: 'image/png', sizes: '48x48' },
    { url: '/bearings/icon-192.png', type: 'image/png', sizes: '192x192' },
    { url: '/bearings/icon-512.png', type: 'image/png', sizes: '512x512' },
  ],
  apple: { url: '/bearings/apple-touch-icon.png', sizes: '180x180' },
};

const cohortMetadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Cohort — 흔들리지 않는 투자 페이스',
    template: '%s · Cohort',
  },
  description:
    'Top 5-10% sophisticated retail을 위한 투자 페이스 메이트 — Aurora 🕊와 Vesper 🦅의 동행. 정보 + 도구 + 의사결정 지원.',
  applicationName: APP_NAME,
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
};

const bearingsMetadata: Metadata = {
  metadataBase: new URL('https://www.thebearings.app'),
  title: {
    default: 'The Bearings',
    template: '%s · The Bearings',
  },
  description:
    'Portfolio regime check and desk product pages. Waitlist stays at /waitlist.',
  applicationName: 'The Bearings',
  manifest: '/bearings.webmanifest',
  icons: BEARINGS_ICONS,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'The Bearings',
  },
};

const deskGoMetadata: Metadata = {
  metadataBase: new URL('https://desk.thebearings.app'),
  title: {
    default: 'Desk — 책상 위 물건',
    template: '%s',
  },
  description:
    '책상 위 물건을 탭하면 제품 정보와 구매 링크가 열립니다. 쿠팡 파트너스 활동의 일환입니다.',
  applicationName: 'Desk',
  manifest: '/desk.webmanifest',
  icons: BEARINGS_ICONS,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Desk',
  },
};

/**
 * generateMetadata — Sentry wizard requirement (Sentry.getTraceData propagates
 * server → client trace continuity via HTML metadata). Required by @sentry/nextjs
 * 8.0+ App Router pattern.
 *
 * Host branching: desk/go never inherit Cohort title/manifest; apex/www use
 * The Bearings chrome. Vercel preview + localhost use desk metadata so we
 * validate the desk surface, not the archived Cohort landing.
 */
export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host') ?? '';
  const base =
    isDeskOrGoHost(host) || isPreviewOrLocalHost(host)
      ? deskGoMetadata
      : isBearingsPublicHost(host)
        ? bearingsMetadata
        : cohortMetadata;

  return {
    ...base,
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1A1A1A',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get('host') ?? '';
  const deskOrGo = isDeskOrGoHost(host);

  return (
    <html lang="ko">
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) mutate <body> before React hydrates — benign,
          but floods the dev console with hydration-mismatch warnings. */}
      <body
        suppressHydrationWarning
        className="bg-cohort-ivory font-sans text-cohort-charcoal antialiased"
      >
        {deskOrGo ? (
          children
        ) : (
          <PostHogProvider>
            <div className="flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
              <ConditionalFooter />
            </div>
            <ServiceWorkerRegister />
          </PostHogProvider>
        )}
      </body>
    </html>
  );
}
