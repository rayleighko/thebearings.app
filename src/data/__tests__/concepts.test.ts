import { describe, expect, it } from 'vitest';
import {
  CONCEPTS,
  getSlugTarget,
  listPublishedConcepts,
} from '@/data/concepts';

describe('concepts catalog', () => {
  it('keeps slugs unique across published items', () => {
    const slugs = CONCEPTS.flatMap((c) => c.items.map((i) => i.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('maps each published slug to a productUrl', () => {
    for (const concept of listPublishedConcepts()) {
      for (const item of concept.items) {
        const target = getSlugTarget(item.slug);
        expect(target?.productUrl).toBe(item.productUrl);
        expect(target?.concept).toBe(concept.slug);
      }
    }
  });

  it('returns undefined for unknown slugs', () => {
    expect(getSlugTarget('not-a-real-product')).toBeUndefined();
  });

  it('does not use the reserved desk-missing slug', () => {
    expect(CONCEPTS.some((c) => c.slug === 'missing')).toBe(false);
  });

  it('publishes at least the dev concept with 5 items', () => {
    const dev = CONCEPTS.find((c) => c.slug === 'dev');
    expect(dev?.items).toHaveLength(5);
  });

  it('uses Coupang CDN thumbnails on every published dev item', () => {
    const bySlug = Object.fromEntries(
      (CONCEPTS.find((c) => c.slug === 'dev')?.items ?? []).map((i) => [i.slug, i]),
    );

    expect(bySlug['arm-nb-f80']?.img).toBe(
      'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/91721891173174-9f29666a-db34-4290-8088-8dd9d8190f7e.jpg',
    );
    expect(bySlug['stand-laptop']?.img).toBe(
      'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/162502830181035-1a21fc21-ba28-4766-b014-23ffdb407a20.jpg',
    );
    expect(bySlug['kbd-keychron-k8']?.img).toBe(
      'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/1025_amir_coupang_oct_80k/3521/906a07f8c5d1459c57c826cc79daa9270da92a7c14721033c4082ba1c89a.jpg',
    );
    expect(bySlug['mouse-mx-master']?.img).toBe(
      'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/987378244568031-c2e35266-fd66-430d-896d-0f06d6c3c00b.jpg',
    );
    // Founder-confirmed 스크린바 URL. stand-laptop was already wired to the
    // same CDN path as 노트북 스탠드 — left as-is (no mislabel comment).
    expect(bySlug['lamp-screenbar']?.img).toBe(
      'https://thumbnail.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/162502830181035-1a21fc21-ba28-4766-b014-23ffdb407a20.jpg',
    );
  });

  it('keeps Coupang Partners productUrl deeplinks on every published item', () => {
    for (const concept of listPublishedConcepts()) {
      for (const item of concept.items) {
        expect(item.productUrl).toMatch(/^https:\/\/link\.coupang\.com\//);
      }
    }
  });
});
