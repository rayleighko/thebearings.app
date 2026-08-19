import type { ReactNode } from 'react';
import Link from 'next/link';
import { AffiliateDisclosure } from '@/components/desk/AffiliateDisclosure';
import { DeskBrand } from '@/components/desk/DeskBrand';
import {
  DESK_ABOUT,
  DESK_YOUTUBE_HANDLE,
  DESK_YOUTUBE_HREF,
  DESK_YOUTUBE_LABEL,
} from '@/lib/desk/brand';

export type DeskChromeCurrent = 'home' | 'shop' | 'blog';

type DeskChromeProps = {
  homeHref: string;
  shopHref: string;
  blogHref: string;
  current?: DeskChromeCurrent;
  /** Discreet archive entry — www affiliate home only. */
  archiveHref?: string;
  wide?: boolean;
  children: ReactNode;
};

const linkClass =
  'inline-flex min-h-[44px] items-center text-sm text-cohort-ink-70 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90';

export function DeskChrome({
  homeHref,
  shopHref,
  blogHref,
  current,
  archiveHref,
  wide = false,
  children,
}: DeskChromeProps) {
  return (
    <div
      className={`mx-auto flex min-h-screen flex-col break-keep bg-cohort-ivory px-5 py-8 text-cohort-ink-90 sm:px-6 ${
        wide ? 'max-w-3xl' : 'max-w-xl'
      }`}
    >
      <a
        href="#desk-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-cohort-ink-90 focus:outline focus:outline-2 focus:outline-cohort-ink-90"
      >
        본문으로
      </a>
      <header>
        <DeskBrand href={homeHref} />
        <nav aria-label="살까말까 연구소" className="mt-2 flex flex-wrap gap-x-4">
          <Link
            href={shopHref}
            className={linkClass}
            aria-current={current === 'shop' ? 'page' : undefined}
          >
            책상 물건
          </Link>
          <Link
            href={blogHref}
            className={linkClass}
            aria-current={current === 'blog' ? 'page' : undefined}
          >
            글
          </Link>
        </nav>
      </header>
      <main id="desk-main" className="flex-1">
        {children}
      </main>
      <footer className="mt-12 border-t border-cohort-ink-10 pt-6 text-sm text-cohort-ink-70">
        <p className="break-keep">{DESK_ABOUT}</p>
        <nav aria-label="연구소 링크" className="mt-4 flex flex-col gap-1">
          <a
            href={DESK_YOUTUBE_HREF}
            rel="noopener noreferrer"
            target="_blank"
            className={`${linkClass} w-fit`}
          >
            YouTube {DESK_YOUTUBE_HANDLE} / {DESK_YOUTUBE_LABEL}
          </a>
          <Link href={shopHref} className={`${linkClass} w-fit`}>
            책상 물건
          </Link>
          {archiveHref ? (
            <Link href={archiveHref} className={`${linkClass} w-fit text-cohort-ink-50`}>
              보관됨
            </Link>
          ) : null}
        </nav>
        <div className="mt-5">
          <p className="font-medium text-cohort-ink-90">[광고]</p>
          <AffiliateDisclosure className="mt-1 text-cohort-ink-70" />
        </div>
      </footer>
    </div>
  );
}
