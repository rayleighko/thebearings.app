/**
 * English Pexels Videos search queries for published `dev` desk SKUs.
 * Keys are catalog ids (`item.id`), not public go slugs.
 *
 * Korean targeting belongs in captions later. Do not scrape KR-creator files
 * or search non-licensed platforms for B-roll.
 */

export const DEV_STOCK_CONCEPT = 'dev' as const;

export const DEV_STOCK_QUERIES: Record<string, readonly string[]> = {
  'arm-nb-f80': [
    'asian man laptop neck',
    'asian office worker computer',
    'east asian sitting desk',
    'asian woman laptop office',
    'asian rubbing neck office',
    'east asian office neck',
    'asian sitting stretching neck',
    'asian monitor eye level',
    'asian man computer posture',
    'east asian office worker laptop',
  ],
  'lamp-screenbar': [
    'monitor light bar',
    'computer screen lamp desk',
    'monitor hanging light workspace',
    'desk monitor lighting',
  ],
  'stand-laptop': [
    'laptop stand desk',
    'aluminum laptop riser',
    'laptop stand workspace',
    'ergonomic laptop stand office',
  ],
  'kbd-keychron-k8': [
    'mechanical keyboard desk',
    'typing on mechanical keyboard',
    'wireless keyboard workspace',
    'compact keyboard close up',
  ],
  'mouse-mx-master': [
    'wireless computer mouse',
    'ergonomic mouse desk',
    'office mouse close up',
    'desktop mouse workspace',
  ],
};

export function queriesForSku(slug: string): readonly string[] | undefined {
  return DEV_STOCK_QUERIES[slug];
}
