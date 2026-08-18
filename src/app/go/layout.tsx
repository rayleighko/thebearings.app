import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Desk' },
  description: '구매 링크로 이동합니다.',
  applicationName: '살까말까 연구소',
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/desk/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/desk/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: { url: '/desk/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function GoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
