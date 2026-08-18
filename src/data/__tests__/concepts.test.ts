import { describe, expect, it } from 'vitest';
import {
  CONCEPTS,
  DEV_OFFICIAL_CDN_THUMBS,
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

  it('keeps official Coupang CDN thumbs as rembg source pixels', () => {
    const slugs = (CONCEPTS.find((c) => c.slug === 'dev')?.items ?? []).map(
      (i) => i.slug,
    );
    expect(Object.keys(DEV_OFFICIAL_CDN_THUMBS).sort()).toEqual([...slugs].sort());
    for (const slug of slugs) {
      expect(DEV_OFFICIAL_CDN_THUMBS[slug]).toMatch(
        /^https:\/\/thumbnail\.coupangcdn\.com\//,
      );
      expect(DEV_OFFICIAL_CDN_THUMBS[slug]).not.toMatch(/link\.coupang\.com/);
    }
    expect(DEV_OFFICIAL_CDN_THUMBS['stand-laptop']).not.toBe(
      DEV_OFFICIAL_CDN_THUMBS['lamp-screenbar'],
    );
  });

  it('points published dev overlays at local rembg cutouts', () => {
    const bySlug = Object.fromEntries(
      (CONCEPTS.find((c) => c.slug === 'dev')?.items ?? []).map((i) => [i.slug, i]),
    );

    for (const slug of [
      'arm-nb-f80',
      'lamp-screenbar',
      'stand-laptop',
      'kbd-keychron-k8',
      'mouse-mx-master',
    ]) {
      expect(bySlug[slug]?.img).toBe(`/desk/dev/${slug}.png`);
    }
  });

  it('keeps Coupang Partners productUrl deeplinks on every published item', () => {
    for (const concept of listPublishedConcepts()) {
      for (const item of concept.items) {
        expect(item.productUrl).toMatch(/^https:\/\/link\.coupang\.com\//);
      }
    }
  });
});
