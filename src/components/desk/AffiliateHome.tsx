import Link from 'next/link';
import { DeskChrome } from '@/components/desk/DeskChrome';
import { DESK_ABOUT, DESK_BRAND_NAME } from '@/lib/desk/brand';
import { deskChromeHrefs } from '@/lib/desk/urls';

const CTA_CLASS =
  'inline-flex min-h-[44px] items-center justify-center rounded-xl border border-cohort-ink-10 bg-white px-4 py-3 text-base font-medium text-cohort-ink-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90';

type AffiliateHomeProps = {
  host: string;
};

/** Apex/www front door — points at desk.thebearings.app, does not duplicate cards. */
export function AffiliateHome({ host }: AffiliateHomeProps) {
  const { homeHref, shopHref, blogHref } = deskChromeHrefs(host);

  return (
    <DeskChrome
      homeHref={homeHref}
      shopHref={shopHref}
      blogHref={blogHref}
      current="home"
      archiveHref="/regime"
    >
      <h1 className="mt-8 text-2xl font-semibold">{DESK_BRAND_NAME}</h1>
      <p className="mt-4 text-base text-cohort-ink-70">{DESK_ABOUT}</p>
      <p className="mt-3 text-base text-cohort-ink-70">
        물건 목록은 책상 호스트에 있습니다. 후기나 순위 글은 없습니다.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link href={shopHref} className={CTA_CLASS}>
          책상 물건
        </Link>
        <Link href={blogHref} className={`${CTA_CLASS} text-cohort-ink-70`}>
          글
        </Link>
      </div>
    </DeskChrome>
  );
}
