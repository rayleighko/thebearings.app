import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import {
  DESK_BRAND_DESCRIPTION,
  DESK_BRAND_NAME,
  DESK_ICONS,
  DESK_OPEN_GRAPH,
  DESK_TWITTER,
} from '@/lib/desk/brand';
import { deskVerificationMetadata } from '@/lib/desk/seo';

export const metadata: Metadata = {
  title: { absolute: DESK_BRAND_NAME },
  description: DESK_BRAND_DESCRIPTION,
  applicationName: DESK_BRAND_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: DESK_BRAND_NAME,
  },
  icons: DESK_ICONS,
  manifest: '/desk.webmanifest',
  openGraph: DESK_OPEN_GRAPH,
  twitter: DESK_TWITTER,
  verification: deskVerificationMetadata(),
};

/**
 * Desk/go hosts skip root PostHogProvider (Cohort-only). Vercel Web Analytics
 * needs no extra key and is enough for desk.thebearings.app pageviews.
 * go.thebearings.app hops stay on Supabase `clicks`.
 */
export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
