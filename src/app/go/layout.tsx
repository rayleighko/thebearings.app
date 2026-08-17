import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Desk' },
  description: '구매 링크로 이동합니다.',
  applicationName: 'Desk',
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/bearings/favicon.ico', sizes: 'any' },
      { url: '/bearings/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/bearings/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: { url: '/bearings/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function GoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
