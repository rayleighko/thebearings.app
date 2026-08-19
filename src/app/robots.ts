import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { buildRobotsForHost } from '@/lib/desk/seo';

/**
 * Host-aware robots. Replaces public/robots.txt so desk / go / Bearings /
 * Cohort each get their own rules. go.thebearings.app is Disallow: /.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host') ?? '';
  return buildRobotsForHost(host);
}
