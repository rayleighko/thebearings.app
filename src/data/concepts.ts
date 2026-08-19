/**
 * Desk concept catalog — file-backed, portable to a later DB move.
 * Click logs live in Supabase `clicks`; concept content does NOT.
 *
 * productUrl values are Coupang Partners deeplinks (mid-tier, rocket-eligible
 * value picks). Do not replace with unmarked search URLs.
 *
 * OPERATOR: `img` is a local rembg cutout (`/desk/dev/{id}.png`) or a
 * Coupang CDN thumbnail URL. Official source pixels live in
 * `DEV_OFFICIAL_CDN_THUMBS`. Do not crawl affiliate pages. Do not send
 * product images to GPT (or any image-gen API) to invent a desk scene.
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
  /** Local rembg cutout (`/desk/dev/{id}.png`) or Coupang CDN thumbnail */
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
    img: '/desk/dev/arm-nb-f80.png',
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
    // rembg u2net clips the bar and leaves the V-clamp. Card uses the official thumb.
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
    // rembg cutout is already cropped at the plate corners. Card uses the official thumb.
    img: 'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/8604239937395705-2fe01d34-70d0-4224-9e48-265326f123b3.jpg',
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
    img: '/desk/dev/kbd-keychron-k8.png',
    x: 48,
    y: 70,
    w: 34,
    z: 4,
  },
  {
    // Rayleigh name AG100. Box AG010 / listing AG0101.
    // id/img stay mouse-mx-master (cutout filename). Public go slug is mouse-ag100.
    // Partners URL already lands on ATWO AG010 — keep it.
    id: 'mouse-mx-master',
    name: '마우스 AG100',
    price: '8만 원대',
    slug: 'mouse-ag100',
    productUrl: 'https://link.coupang.com/a/gi79m3yxFY',
    img: '/desk/dev/mouse-mx-master.png',
    x: 74,
    y: 72,
    w: 10,
    z: 5,
  },
];

/**
 * Official Coupang CDN thumbs (source pixels for rembg). Overlay `img`
 * points at the local cutout after `pnpm desk:cutout-thumbs`.
 */
export const DEV_OFFICIAL_CDN_THUMBS: Record<string, string> = {
  'arm-nb-f80':
    'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/91721891173174-9f29666a-db34-4290-8088-8dd9d8190f7e.jpg',
  'lamp-screenbar':
    'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/162502830181035-1a21fc21-ba28-4766-b014-23ffdb407a20.jpg',
  'stand-laptop':
    'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/8604239937395705-2fe01d34-70d0-4224-9e48-265326f123b3.jpg',
  'kbd-keychron-k8':
    'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/1025_amir_coupang_oct_80k/3521/906a07f8c5d1459c57c826cc79daa9270da92a7c14721033c4082ba1c89a.jpg',
  'mouse-mx-master':
    'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/987378244568031-c2e35266-fd66-430d-896d-0f06d6c3c00b.jpg',
};

export const CONCEPTS: Concept[] = [
  {
    slug: 'dev',
    title: '책상 물건',
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

/**
 * Retired public slugs that still 302 to the same Coupang dest.
 * Do not 404 these — old desk cards / caches still hit them.
 */
export const SLUG_ALIASES: Record<string, string> = {
  'mouse-mx-master': 'mouse-ag100',
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
  for (const [alias, canonical] of Object.entries(SLUG_ALIASES)) {
    const target = map[canonical];
    if (target && !map[alias]) {
      map[alias] = target;
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

/** Known Shorts SKU. Do not pin it unless video search params name it. */
export const DESK_FEATURED_SLUG = 'arm-nb-f80';

export type DeskVideoSearchParams = {
  v?: string | string[];
  from?: string | string[];
  sku?: string | string[];
};

function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

/** Video context only (`?v=` or `?from=video&sku=`). Bare catalog has no featured SKU. */
export function resolveDeskFeaturedSlug(
  items: Item[],
  searchParams: DeskVideoSearchParams,
): string | undefined {
  const fromVideo = firstSearchParam(searchParams.v);
  const fromFlag =
    firstSearchParam(searchParams.from) === 'video'
      ? firstSearchParam(searchParams.sku)
      : undefined;
  const candidate = fromVideo ?? fromFlag;
  if (!candidate) return undefined;
  return items.some((item) => item.id === candidate) ? candidate : undefined;
}

/** Keep `?v=` / `?from=` / `?sku=` when `/dev` redirects to the apex shop. */
export function deskVideoQueryString(searchParams: DeskVideoSearchParams): string {
  const q = new URLSearchParams();
  const v = firstSearchParam(searchParams.v);
  const from = firstSearchParam(searchParams.from);
  const sku = firstSearchParam(searchParams.sku);
  if (v) q.set('v', v);
  if (from) q.set('from', from);
  if (sku) q.set('sku', sku);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export function orderDeskItems(items: Item[], featuredSlug?: string): Item[] {
  if (!featuredSlug) return items;
  const featured = items.find((item) => item.id === featuredSlug);
  if (!featured) return items;
  return [featured, ...items.filter((item) => item.id !== featuredSlug)];
}
