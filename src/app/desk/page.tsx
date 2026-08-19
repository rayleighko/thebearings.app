import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { DeskChrome } from '@/components/desk/DeskChrome';
import { DeskProductCards } from '@/components/desk/DeskProductCards';
import { JsonLd } from '@/components/desk/JsonLd';
import {
  getConcept,
  orderDeskItems,
  resolveDeskFeaturedSlug,
} from '@/data/concepts';
import {
  DESK_ABOUT,
  DESK_BRAND_DESCRIPTION,
  DESK_BRAND_NAME,
  DESK_SHOP_HEADING,
} from '@/lib/desk/brand';
import { deskItemListJsonLd, publicOriginForHost } from '@/lib/desk/seo';
import { deskChromeHrefs, deskIndexHref } from '@/lib/desk/urls';

type PageProps = {
  searchParams: Promise<{
    v?: string | string[];
    from?: string | string[];
    sku?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: { absolute: `${DESK_SHOP_HEADING} — ${DESK_BRAND_NAME}` },
  description: DESK_BRAND_DESCRIPTION,
  alternates: { canonical: '/' },
};

export default async function DeskIndexPage({ searchParams }: PageProps) {
  const concept = getConcept('dev');
  const items = concept?.items ?? [];
  const host = (await headers()).get('host') ?? '';
  const query = await searchParams;
  const featuredSlug = resolveDeskFeaturedSlug(items, query);
  const ordered = orderDeskItems(items, featuredSlug);
  const origin = publicOriginForHost(host);
  const pageUrl = `${origin}${deskIndexHref(host)}`;
  const { homeHref, shopHref, blogHref } = deskChromeHrefs(host);

  return (
    <DeskChrome
      homeHref={homeHref}
      shopHref={shopHref}
      blogHref={blogHref}
      current="shop"
      wide
    >
      {ordered.length > 0 ? (
        <JsonLd
          data={deskItemListJsonLd({
            name: `${DESK_SHOP_HEADING} — 이 책상의 물건`,
            items: ordered,
            pageUrl,
            origin,
          })}
        />
      ) : null}
      <h1 className="mt-8 text-2xl font-semibold text-cohort-ink-90">{DESK_SHOP_HEADING}</h1>
      <p className="mt-4 text-base text-cohort-ink-70 break-keep">{DESK_ABOUT}</p>
      <p className="mt-2 text-sm text-cohort-ink-70 break-keep">가격은 변동될 수 있습니다.</p>
      {ordered.length === 0 ? (
        <p className="mt-8 text-sm text-cohort-ink-70 break-keep">
          공개된 물건이 아직 없습니다.
        </p>
      ) : (
        <DeskProductCards
          items={ordered}
          heading="이 책상의 물건"
          featuredSlug={featuredSlug}
        />
      )}
    </DeskChrome>
  );
}
