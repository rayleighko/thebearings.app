import type { Metadata } from 'next';

const TITLE = '살까말까 연구소';
const DESCRIPTION =
  '책상 위 물건을 탭하면 제품 정보와 구매 링크가 열립니다. 쿠팡 파트너스 활동의 일환입니다.';

const DESK_ICONS: NonNullable<Metadata['icons']> = {
  icon: [
    { url: '/desk/favicon-16.png', type: 'image/png', sizes: '16x16' },
    { url: '/desk/favicon-32.png', type: 'image/png', sizes: '32x32' },
    { url: '/desk/favicon-48.png', type: 'image/png', sizes: '48x48' },
    { url: '/desk/icon-192.png', type: 'image/png', sizes: '192x192' },
    { url: '/desk/icon-512.png', type: 'image/png', sizes: '512x512' },
  ],
  apple: { url: '/desk/apple-touch-icon.png', sizes: '180x180' },
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  applicationName: TITLE,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: TITLE,
  },
  icons: DESK_ICONS,
  manifest: '/desk.webmanifest',
};

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
