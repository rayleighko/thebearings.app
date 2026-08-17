/**
 * Desk concept catalog — file-backed, portable to a later DB move.
 * Click logs live in Supabase `clicks`; concept content does NOT.
 *
 * OPERATOR: replace every `productUrl` with a Coupang Partners deeplink
 * before launch. Current values are unmarked-as-affiliate search URLs so
 * local /go redirects have somewhere to land. Do not invent partner keys.
 *
 * OPERATOR: drop real product cutouts at `public/desk/{concept}/{id}.png`
 * (rembg / remove.bg / Photoshop — no AI morphing). Current PNGs are
 * geometric placeholders so layout and tap targets work.
 */

export type Item = {
  id: string;
  name: string;
  /** Display string only. Never used for calculation. */
  price: string;
  /** 1:1 with go/:slug */
  slug: string;
  /** Coupang Partners deeplink (placeholder until operator replaces). */
  productUrl: string;
  /** Cutout PNG path under /public */
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

/** Search URL — NOT a Partners deeplink. Operator must replace. */
function placeholderSearchUrl(query: string): string {
  const q = encodeURIComponent(query);
  return `https://www.coupang.com/np/search?q=${q}&channel=user`;
}

const DEV_ITEMS: Item[] = [
  {
    id: 'arm-nb-f80',
    name: 'NB F80 모니터암',
    price: '4만 원대',
    slug: 'arm-nb-f80',
    productUrl: placeholderSearchUrl('NB F80 모니터암'),
    img: '/desk/dev/arm-nb-f80.png',
    x: 50,
    y: 40,
    w: 42,
    z: 2,
  },
  {
    id: 'lamp-screenbar',
    name: '스크린바 모니터 조명',
    price: '5만 원대',
    slug: 'lamp-screenbar',
    productUrl: placeholderSearchUrl('모니터 스크린바'),
    img: '/desk/dev/lamp-screenbar.png',
    x: 50,
    y: 28,
    w: 30,
    z: 3,
  },
  {
    id: 'stand-laptop',
    name: '알루미늄 노트북 스탠드',
    price: '3만 원대',
    slug: 'stand-laptop',
    productUrl: placeholderSearchUrl('알루미늄 노트북 스탠드'),
    img: '/desk/dev/stand-laptop.png',
    x: 22,
    y: 58,
    w: 22,
    z: 3,
  },
  {
    id: 'kbd-keychron-k8',
    name: '기계식 키보드',
    price: '12만 원대',
    slug: 'kbd-keychron-k8',
    productUrl: placeholderSearchUrl('기계식 키보드'),
    img: '/desk/dev/kbd-keychron-k8.png',
    x: 48,
    y: 70,
    w: 34,
    z: 4,
  },
  {
    id: 'mouse-mx-master',
    name: '무선 마우스',
    price: '8만 원대',
    slug: 'mouse-mx-master',
    productUrl: placeholderSearchUrl('무선 마우스'),
    img: '/desk/dev/mouse-mx-master.png',
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
