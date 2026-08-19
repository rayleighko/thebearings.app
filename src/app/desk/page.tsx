import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { DeskChrome } from '@/components/desk/DeskChrome';
import { JsonLd } from '@/components/desk/JsonLd';
import { CONCEPTS, listPublishedConcepts } from '@/data/concepts';
import { DESK_ABOUT, DESK_BRAND_DESCRIPTION, DESK_BRAND_NAME } from '@/lib/desk/brand';
import { deskConceptListJsonLd, publicOriginForHost } from '@/lib/desk/seo';
import {
  deskChromeHrefs,
  deskConceptHref,
  deskIndexHref,
} from '@/lib/desk/urls';

export const metadata: Metadata = {
  title: { absolute: DESK_BRAND_NAME },
  description: DESK_BRAND_DESCRIPTION,
  alternates: { canonical: '/' },
};

const conceptLinkClass =
  'flex min-h-[44px] items-center justify-between rounded-xl border border-cohort-ink-10 bg-white px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90';

export default async function DeskIndexPage() {
  const host = (await headers()).get('host') ?? '';
  const published = listPublishedConcepts();
  const origin = publicOriginForHost(host);
  const { homeHref, shopHref, blogHref } = deskChromeHrefs(host);

  return (
    <DeskChrome homeHref={homeHref} shopHref={shopHref} blogHref={blogHref} current="shop">
      <JsonLd
        data={deskConceptListJsonLd({
          pageUrl: `${origin}${deskIndexHref(host)}`,
          items: published.map((concept) => ({
            name: concept.title,
            url: `${origin}${deskConceptHref(host, concept.slug)}`,
          })),
        })}
      />
      <h1 className="mt-8 text-2xl font-semibold">{DESK_BRAND_NAME}</h1>
      <p className="mt-4 text-base text-cohort-ink-70">{DESK_ABOUT}</p>
      <p className="mt-3 text-base text-cohort-ink-70">
        책상 컨셉을 고르면 물건을 보고 구매 링크로 갈 수 있습니다.
      </p>
      <p className="mt-2 text-sm text-cohort-ink-70">가격은 변동될 수 있습니다.</p>
      <ul className="mt-8 space-y-3">
        {CONCEPTS.map((concept) => {
          const ready = concept.items.length > 0;
          return (
            <li key={concept.slug}>
              {ready ? (
                <Link href={deskConceptHref(host, concept.slug)} className={conceptLinkClass}>
                  <span>
                    <span className="block font-medium">{concept.title}</span>
                    <span className="mt-1 block text-sm text-cohort-ink-70">
                      {concept.note}
                    </span>
                  </span>
                  <span className="ml-3 text-sm text-cohort-ink-70" aria-hidden>
                    →
                  </span>
                </Link>
              ) : (
                <div className="rounded-xl border border-dashed border-cohort-ink-10 px-4 py-3">
                  <span className="block font-medium text-cohort-ink-70">
                    {concept.title}
                  </span>
                  <span className="mt-1 block text-sm text-cohort-ink-70">
                    준비 중 — 배경만 있습니다.
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {published.length === 0 ? (
        <p className="mt-8 text-sm text-cohort-ink-70">공개된 컨셉이 아직 없습니다.</p>
      ) : null}
    </DeskChrome>
  );
}
