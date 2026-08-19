import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { AffiliateDisclosure } from '@/components/desk/AffiliateDisclosure';
import { DeskBrand } from '@/components/desk/DeskBrand';
import { DeskProductCards } from '@/components/desk/DeskProductCards';
import { JsonLd } from '@/components/desk/JsonLd';
import {
  CONCEPTS,
  getConcept,
  orderDeskItems,
  resolveDeskFeaturedSlug,
} from '@/data/concepts';
import { deskItemListJsonLd, publicOriginForHost } from '@/lib/desk/seo';
import { deskConceptHref, deskIndexHref } from '@/lib/desk/urls';

type PageProps = {
  params: Promise<{ concept: string }>;
  searchParams: Promise<{
    v?: string | string[];
    from?: string | string[];
    sku?: string | string[];
  }>;
};

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ concept: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { concept: slug } = await params;
  const concept = getConcept(slug);
  if (!concept) {
    return { title: { absolute: '살까말까 연구소' } };
  }
  return {
    title: { absolute: `${concept.title} — 살까말까 연구소` },
    description: concept.note,
    alternates: { canonical: deskConceptHref('desk.thebearings.app', slug) },
    robots: concept.items.length === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function DeskConceptPage({ params, searchParams }: PageProps) {
  const { concept: slug } = await params;
  const concept = getConcept(slug);
  if (!concept) {
    notFound();
  }
  const host = (await headers()).get('host') ?? '';
  const query = await searchParams;
  const featuredSlug = resolveDeskFeaturedSlug(concept.items, query);
  const items = orderDeskItems(concept.items, featuredSlug);

  const origin = publicOriginForHost(host);
  const pageUrl = `${origin}${deskConceptHref(host, slug)}`;

  return (
    <main className="mx-auto min-h-screen max-w-3xl break-keep bg-cohort-ivory px-4 py-8 text-cohort-ink-90 sm:px-6">
      {items.length > 0 ? (
        <JsonLd
          data={deskItemListJsonLd({
            name: `${concept.title} — 이 책상의 물건`,
            items,
            pageUrl,
            origin,
          })}
        />
      ) : null}
      <AffiliateDisclosure className="rounded-lg border border-cohort-ink-10 bg-white px-4 py-3 text-cohort-ink-70" />
      <header className="mt-6">
        <DeskBrand href={deskIndexHref(host)} />
      </header>
      <nav className="mt-2">
        <Link
          href={deskIndexHref(host)}
          className="inline-flex min-h-[44px] items-center text-sm text-cohort-ink-50 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
        >
          모든 컨셉
        </Link>
      </nav>
      <h1 className="mt-4 text-2xl font-semibold">{concept.title}</h1>
      <p className="mt-2 text-base text-cohort-ink-70">{concept.note}</p>
      {items.length === 0 ? (
        <p className="mt-8 text-sm text-cohort-ink-50">
          이 컨셉의 제품은 아직 없습니다. 배경만 미리 두었습니다.
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-cohort-ink-50">가격은 변동될 수 있습니다.</p>
          <DeskProductCards
            items={items}
            heading="이 책상의 물건"
            featuredSlug={featuredSlug}
          />
        </>
      )}
    </main>
  );
}
