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
});
