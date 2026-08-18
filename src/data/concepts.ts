/**
 * Desk concept catalog — file-backed, portable to a later DB move.
 * Click logs live in Supabase `clicks`; concept content does NOT.
 *
 * productUrl values are Coupang Partners deeplinks (mid-tier, rocket-eligible
 * value picks). Do not replace with unmarked search URLs.
 *
 * OPERATOR: `img` is a local `/desk/...` placeholder or a Coupang CDN
 * thumbnail URL. Do not crawl affiliate pages for images.
 */

export type Item = {
  id: string;
  name: string;
  /** Display string only. Never used for calculation. */
  price: string;
  /** 1:1 with go/:slug */
  slug: string;
  /** Coupang Partners deeplink */
  productUrl: string;
  /** Local `/public` path or https Coupang CDN thumbnail */
  img: string;
  /** % of background, center point */
  x: number;
  y: number;
  /** % of background width */
  w: number;
  /** Stacking order */
  z: number;
};

export type Concept = {
  slug: string;
  title: string;
  note: string;
  bg: string;
  items: Item[];
};

const DEV_ITEMS: Item[] = [
  {
    id: 'arm-nb-f80',
    name: '싱글 모니터암',
    price: '4만 원대',
    slug: 'arm-nb-f80',
    productUrl: 'https://link.coupang.com/a/gi6GpRFFBI',
    img: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/91721891173174-9f29666a-db34-4290-8088-8dd9d8190f7e.jpg',
    x: 50,
    y: 40,
    w: 42,
    z: 2,
  },
  {
    id: 'lamp-screenbar',
    name: '스크린바',
    price: '5만 원대',
    slug: 'lamp-screenbar',
    productUrl: 'https://link.coupang.com/a/gi7YPbNxdY',
    img: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/162502830181035-1a21fc21-ba28-4766-b014-23ffdb407a20.jpg',
    x: 50,
    y: 28,
    w: 30,
    z: 3,
  },
  {
    id: 'stand-laptop',
    name: '노트북 스탠드',
    price: '3만 원대',
    slug: 'stand-laptop',
    productUrl: 'https://link.coupang.com/a/gi6MkDloqW',
    img: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/162502830181035-1a21fc21-ba28-4766-b014-23ffdb407a20.jpg',
    x: 22,
    y: 58,
    w: 22,
    z: 3,
  },
  {
    id: 'kbd-keychron-k8',
    name: '키보드',
    price: '12만 원대',
    slug: 'kbd-keychron-k8',
    productUrl: 'https://link.coupang.com/a/gi61Ks22XA',
    img: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/1025_amir_coupang_oct_80k/3521/906a07f8c5d1459c57c826cc79daa9270da92a7c14721033c4082ba1c89a.jpg',
    x: 48,
    y: 70,
    w: 34,
    z: 4,
  },
  {
    id: 'mouse-mx-master',
    name: '마우스',
    price: '8만 원대',
    slug: 'mouse-mx-master',
    productUrl: 'https://link.coupang.com/a/gi79m3yxFY',
    img: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/987378244568031-c2e35266-fd66-430d-896d-0f06d6c3c00b.jpg',
    x: 74,
    y: 72,
    w: 10,
    z: 5,
  },
];

export const CONCEPTS: Concept[] = [
  {
    slug: 'dev',
    title: '개발자 데스크',
    note: '모니터암과 입력장치 위주의 작업 데스크. 물건은 탭하면 상세와 구매 링크가 열립니다.',
    bg: '/desk/dev/bg.jpg',
    items: DEV_ITEMS,
  },
  {
    slug: 'minimal',
    title: '미니멀 데스크',
    note: '밝은 오크 위 여백. 제품 컷은 운영자가 넣은 뒤 공개합니다.',
    bg: '/desk/minimal/bg.jpg',
    items: [],
  },
  {
    slug: 'cozy',
    title: '코지 데스크',
    note: '저녁 조명 아래의 따뜻한 책상. 제품 컷은 운영자가 넣은 뒤 공개합니다.',
    bg: '/desk/cozy/bg.jpg',
    items: [],
  },
];

export const CONCEPT_BY_SLUG: Record<string, Concept> = Object.fromEntries(
  CONCEPTS.map((c) => [c.slug, c]),
);

export type SlugTarget = {
  slug: string;
  concept: string;
  productUrl: string;
};

/** Flattened slug → Coupang URL map. First concept wins if a slug is reused. */
export const SLUG_TARGETS: Record<string, SlugTarget> = (() => {
  const map: Record<string, SlugTarget> = {};
  for (const concept of CONCEPTS) {
    for (const item of concept.items) {
      if (map[item.slug]) continue;
      map[item.slug] = {
        slug: item.slug,
        concept: concept.slug,
        productUrl: item.productUrl,
      };
    }
  }
  return map;
})();

export function getConcept(slug: string): Concept | undefined {
  return CONCEPT_BY_SLUG[slug];
}

export function getSlugTarget(slug: string): SlugTarget | undefined {
  return SLUG_TARGETS[slug];
}

export function listPublishedConcepts(): Concept[] {
  return CONCEPTS.filter((c) => c.items.length > 0);
}
