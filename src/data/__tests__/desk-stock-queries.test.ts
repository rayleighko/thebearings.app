import { describe, expect, it } from 'vitest';
import { getConcept } from '@/data/concepts';
import {
  DEV_STOCK_CONCEPT,
  DEV_STOCK_QUERIES,
  queriesForSku,
} from '@/data/desk-stock-queries';

describe('desk stock queries', () => {
  it('maps every published dev SKU to English stock queries', () => {
    const dev = getConcept(DEV_STOCK_CONCEPT);
    expect(dev).toBeDefined();
    expect(dev?.items.length).toBeGreaterThan(0);

    for (const item of dev!.items) {
      const queries = queriesForSku(item.id);
      expect(queries, item.id).toBeDefined();
      expect(queries!.length).toBeGreaterThanOrEqual(2);
      expect(queries!.length).toBeLessThanOrEqual(12);
      for (const query of queries!) {
        expect(query.length).toBeGreaterThan(3);
        expect(query).not.toMatch(/[가-힣]/);
      }
    }
  });

  it('keeps arm-nb-f80 queries on East Asian office / neck, not empty-desk hooks', () => {
    const queries = queriesForSku('arm-nb-f80') ?? [];
    const joined = queries.join(' ');
    expect(joined).toMatch(/asian|east asian/i);
    expect(joined).toMatch(/neck|posture|eye level|stretching|rubbing/i);
    expect(queries.some((q) => /neck|eye level|stretching/i.test(q))).toBe(true);
  });

  it('does not keep queries for unpublished slugs', () => {
    const published = new Set(
      (getConcept(DEV_STOCK_CONCEPT)?.items ?? []).map((item) => item.id),
    );
    for (const sku of Object.keys(DEV_STOCK_QUERIES)) {
      expect(published.has(sku)).toBe(true);
    }
  });
});
