import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { AffiliateDisclosure } from '@/components/desk/AffiliateDisclosure';
import { DeskBrand } from '@/components/desk/DeskBrand';
import { JsonLd } from '@/components/desk/JsonLd';
import { CONCEPTS, listPublishedConcepts } from '@/data/concepts';
import { DESK_BRAND_DESCRIPTION, DESK_BRAND_NAME } from '@/lib/desk/brand';
import { deskConceptListJsonLd, publicOriginForHost } from '@/lib/desk/seo';
import { deskBlogHref, deskConceptHref, deskIndexHref } from '@/lib/desk/urls';

export const metadata: Metadata = {
  title: { absolute: DESK_BRAND_NAME },
  description: DESK_BRAND_DESCRIPTION,
  alternates: { canonical: '/' },
};

export default async function DeskIndexPage() {
  const host = (await headers()).get('host') ?? '';
  const published = listPublishedConcepts();
  const origin = publicOriginForHost(host);

  return (
    <main className="mx-auto min-h-screen max-w-xl break-keep bg-cohort-ivory px-5 py-10 text-cohort-ink-90">
      <JsonLd
        data={deskConceptListJsonLd({
          pageUrl: `${origin}${deskIndexHref(host)}`,
          items: published.map((concept) => ({
            name: concept.title,
            url: `${origin}${deskConceptHref(host, concept.slug)}`,
          })),
        })}
      />
      <AffiliateDisclosure className="rounded-lg border border-cohort-ink-10 bg-white px-4 py-3 text-cohort-ink-70" />
      <header className="mt-8">
        <DeskBrand href={deskIndexHref(host)} />
      </header>
      <p className="mt-6 text-base text-cohort-ink-70">
        책상 컨셉을 고르면 물건을 보고 구매 링크로 갈 수 있습니다.
      </p>
      <p className="mt-2 text-sm text-cohort-ink-50">가격은 변동될 수 있습니다.</p>
      <ul className="mt-8 space-y-3">
        {CONCEPTS.map((concept) => {
          const ready = concept.items.length > 0;
          return (
            <li key={concept.slug}>
              {ready ? (
                <Link
                  href={deskConceptHref(host, concept.slug)}
                  className="flex min-h-[44px] items-center justify-between rounded-xl border border-cohort-ink-10 bg-white px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
                >
                  <span>
                    <span className="block font-medium">{concept.title}</span>
                    <span className="mt-1 block text-sm text-cohort-ink-50">
                      {concept.note}
                    </span>
                  </span>
                  <span className="ml-3 text-sm text-cohort-ink-50" aria-hidden>
                    →
                  </span>
                </Link>
              ) : (
                <div className="rounded-xl border border-dashed border-cohort-ink-10 px-4 py-3">
                  <span className="block font-medium text-cohort-ink-70">
                    {concept.title}
                  </span>
                  <span className="mt-1 block text-sm text-cohort-ink-50">
                    준비 중 — 배경만 있습니다.
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {published.length === 0 ? (
        <p className="mt-8 text-sm text-cohort-ink-50">공개된 컨셉이 아직 없습니다.</p>
      ) : null}
      <nav className="mt-10">
        <Link
          href={deskBlogHref(host)}
          className="inline-flex min-h-[44px] items-center text-sm text-cohort-ink-50 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
        >
          글 (준비 중)
        </Link>
      </nav>
    </main>
  );
}
