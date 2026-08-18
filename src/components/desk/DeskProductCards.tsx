import Image from 'next/image';
import type { Item } from '@/data/concepts';
import { DESK_FEATURED_SLUG } from '@/data/concepts';
import { AFFILIATE_REL, getAffiliateHref } from '@/lib/desk/urls';

type DeskProductCardsProps = {
  items: Item[];
  heading: string;
  featuredSlug?: string;
};

/**
 * Shoppable product cards — visible HTML links for SEO and affiliate compliance.
 */
export function DeskProductCards({
  items,
  heading,
  featuredSlug = DESK_FEATURED_SLUG,
}: DeskProductCardsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8 break-keep" aria-labelledby="desk-product-list">
      <h2 id="desk-product-list" className="text-lg font-semibold text-cohort-ink-90">
        {heading}
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const featured = item.id === featuredSlug;
          return (
            <li key={item.id}>
              <a
                href={getAffiliateHref(item.slug)}
                rel={AFFILIATE_REL}
                target="_blank"
                className={`flex min-h-[44px] flex-col overflow-hidden rounded-xl border bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90 ${
                  featured
                    ? 'border-cohort-charcoal ring-2 ring-cohort-charcoal/20'
                    : 'border-cohort-ink-10'
                }`}
              >
                <div className="relative aspect-square w-full bg-cohort-ivory p-4">
                  {featured ? (
                    <span className="absolute left-3 top-3 z-10 rounded-md bg-cohort-charcoal px-2 py-1 text-xs font-medium text-white">
                      추천
                    </span>
                  ) : null}
                  <Image
                    src={item.img}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                  <span className="text-base font-medium text-cohort-ink-90">{item.name}</span>
                  <span className="mt-1 text-sm text-cohort-ink-50">{item.price}</span>
                  <span className="mt-3 text-sm font-medium text-cohort-ink-70">쿠팡에서 보기 →</span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
