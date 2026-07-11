import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.thebearings.app';

/**
 * Served at /sitemap.xml. Add new public routes here as they ship
 * (e.g. /regime content pages from M1 issue #11).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/waitlist`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
