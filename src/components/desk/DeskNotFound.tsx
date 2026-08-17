import Link from 'next/link';

type DeskNotFoundProps = {
  homeHref?: string;
  homeLabel?: string;
};

/**
 * Desk/go 404 — no Cohort brand, Aurora, dashboard, or marketing footer.
 */
export function DeskNotFound({
  homeHref = '/desk',
  homeLabel = '모든 컨셉',
}: DeskNotFoundProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16 text-center break-keep text-cohort-ink-90">
      <p className="text-sm text-cohort-ink-50">Desk</p>
      <h1 className="mt-2 text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm text-cohort-ink-50">
        주소가 바뀌었거나 없는 책상·링크입니다.
      </p>
      <Link
        href={homeHref}
        className="mt-8 inline-flex min-h-[44px] items-center rounded-xl border border-cohort-ink-10 bg-white px-6 text-base font-medium text-cohort-ink-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
      >
        {homeLabel}
      </Link>
    </main>
  );
}
