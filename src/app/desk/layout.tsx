import type { Metadata } from 'next';

const TITLE = 'Desk — 책상 위 물건';
const DESCRIPTION =
  '책상 위 물건을 탭하면 제품 정보와 구매 링크가 열립니다. 쿠팡 파트너스 활동의 일환입니다.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  applicationName: 'Desk',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Desk',
  },
  icons: {
    icon: [
      { url: '/bearings/favicon.ico', sizes: 'any' },
      { url: '/bearings/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/bearings/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/bearings/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/bearings/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/bearings/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: { url: '/bearings/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/desk.webmanifest',
};

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
