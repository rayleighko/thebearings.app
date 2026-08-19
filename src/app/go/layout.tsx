import type { Metadata } from 'next';
import {
  DESK_BRAND_NAME,
  DESK_ICONS,
  DESK_OPEN_GRAPH,
  DESK_TWITTER,
} from '@/lib/desk/brand';

export const metadata: Metadata = {
  title: { absolute: DESK_BRAND_NAME },
  description: '구매 링크로 이동합니다.',
  applicationName: DESK_BRAND_NAME,
  robots: { index: false, follow: false },
  icons: DESK_ICONS,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: DESK_BRAND_NAME,
  },
  openGraph: {
    ...DESK_OPEN_GRAPH,
    title: DESK_BRAND_NAME,
    description: '구매 링크로 이동합니다.',
  },
  twitter: {
    ...DESK_TWITTER,
    title: DESK_BRAND_NAME,
    description: '구매 링크로 이동합니다.',
  },
};

export default function GoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
