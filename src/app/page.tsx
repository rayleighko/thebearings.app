import { headers } from 'next/headers';
import { AffiliateHome } from '@/components/desk/AffiliateHome';
import CohortLanding from '@/components/marketing/CohortLanding';
import { isBearingsPublicHost } from '@/lib/desk/hosts';

/**
 * Host-gated root.
 * - www / apex → 살까말까 연구소 affiliate home (no /regime bounce)
 * - cohort.co.kr → archived Korean Cohort landing (untouched)
 * - preview / localhost `/` is redirected to /desk in next.config
 */
export default async function RootPage() {
  const host = (await headers()).get('host') ?? '';
  if (isBearingsPublicHost(host)) {
    return <AffiliateHome host={host} />;
  }
  return <CohortLanding />;
}
