import type { Item } from '@/data/concepts';
import { AFFILIATE_REL, getAffiliateHref } from '@/lib/desk/urls';

/**
 * Text product list in the HTML for search engines.
 * Visible (not display:none) so it is not a link-only thin page.
 */
export function SeoProductList({
  items,
  heading,
}: {
  items: Item[];
  heading: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10 break-keep" aria-labelledby="desk-product-list">
      <h2 id="desk-product-list" className="text-lg font-semibold text-cohort-ink-90">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-cohort-ink-50">가격은 변동될 수 있습니다.</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="text-base text-cohort-ink-70">
            <a
              href={getAffiliateHref(item.slug)}
              rel={AFFILIATE_REL}
              target="_blank"
              className="min-h-[44px] inline-flex items-center underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
            >
              {item.name}
            </a>
            <span className="ml-2 text-sm text-cohort-ink-50">{item.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
