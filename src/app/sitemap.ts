import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { buildSitemapForHost } from '@/lib/desk/seo';

/**
 * Host-aware /sitemap.xml.
 * desk.thebearings.app lists desk + blog only.
 * go.thebearings.app is empty (do not submit).
 * www.thebearings.app and cohort.co.kr keep their own lists.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host') ?? '';
  return buildSitemapForHost(host);
}
