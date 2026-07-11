import type { Metadata, Viewport } from 'next';
import * as Sentry from '@sentry/nextjs';
import '@/styles/globals.css';
import PostHogProvider from '@/components/analytics/PostHogProvider';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';
import { ConditionalFooter } from '@/components/layout/ConditionalFooter';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Bearings';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.thebearings.app';

const baseMetadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Bearings — which regime is your portfolio betting on?',
    template: '%s · Bearings',
  },
  description:
    'Every portfolio is a forecast. See which economic regime your portfolio is implicitly betting on — stress-tested against 2008, 2020 and 2022. Educational tool, not investment advice.',
  applicationName: APP_NAME,
  manifest: '/site.webmanifest',
  verification: {
    other: {
      'naver-site-verification': 'a135b403617e32909c4c0feb85b0dfc64ac86837',
    },
  },
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

/**
 * generateMetadata — Sentry wizard requirement (Sentry.getTraceData propagates
 * server → client trace continuity via HTML metadata). Required by @sentry/nextjs
 * 8.0+ App Router pattern.
 *
 * Note: Next.js requires `metadata` OR `generateMetadata`, not both. We chose
 * generateMetadata to inject runtime trace data on each request.
 */
export function generateMetadata(): Metadata {
  return {
    ...baseMetadata,
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#A8243F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-cohort-ivory font-sans text-cohort-charcoal antialiased">
        <PostHogProvider>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <ConditionalFooter />
          </div>
        </PostHogProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
