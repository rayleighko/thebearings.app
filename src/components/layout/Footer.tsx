import Link from 'next/link';

/**
 * Public-route footer. Cohort marketing chrome (Aurora Chat, dashboard) is
 * archived — this surface is The Bearings. /regime hides this footer and
 * renders its own EN disclaimer.
 */
export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-cohort-ink-10 bg-cohort-ivory pb-20 md:pb-24"
      aria-label="사이트 푸터"
    >
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-xl font-semibold text-cohort-charcoal">
              The Bearings
            </div>
            <p className="mt-2 break-keep text-sm text-cohort-ink-50">
              포트폴리오 레짐과 데스크 제품 페이지.
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3"
            aria-label="푸터 네비게이션"
          >
            <div>
              <h3 className="mb-2 font-medium text-cohort-ink-90">서비스</h3>
              <ul className="space-y-1.5 text-cohort-ink-70">
                <li>
                  <Link
                    href="/regime"
                    className="transition-colors hover:text-cohort-charcoal"
                  >
                    보관됨
                  </Link>
                </li>
                <li>
                  <Link
                    href="/waitlist"
                    className="transition-colors hover:text-cohort-charcoal"
                  >
                    Waitlist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-cohort-ink-90">문의</h3>
              <ul className="space-y-1.5 text-cohort-ink-70">
                <li>
                  <a
                    href="mailto:gmj1197@gmail.com"
                    className="transition-colors hover:text-cohort-charcoal"
                  >
                    이메일
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-cohort-ink-90">법적 고지</h3>
              <ul className="space-y-1.5 text-cohort-ink-70">
                <li>
                  <Link
                    href="/privacy"
                    className="transition-colors hover:text-cohort-charcoal"
                  >
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="transition-colors hover:text-cohort-charcoal"
                  >
                    이용약관
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-6 break-keep text-xs text-cohort-ink-50">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              문의:{' '}
              <strong className="font-medium text-cohort-ink-70">
                gmj1197@gmail.com
              </strong>
            </span>
          </div>
          <div className="mt-3 text-cohort-ink-30">
            © 2026 The Bearings. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
