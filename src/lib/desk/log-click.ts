import { createAdminClient } from '@/lib/supabase/admin';
import { buildSubId } from '@/lib/desk/sub-id';

const LOG_TIMEOUT_MS = 1500;

export type ClickLogInput = {
  slug: string;
  concept: string;
  referrer: string | null;
  userAgent: string | null;
  country: string | null;
};

/**
 * Best-effort click insert. Never throws to the caller.
 * A hung or missing Supabase must not block the 302.
 */
export async function logClick(input: ClickLogInput): Promise<void> {
  const row = {
    slug: input.slug,
    concept: input.concept,
    sub_id: buildSubId(input.concept, input.slug),
    referrer: input.referrer,
    user_agent: input.userAgent,
    country: input.country,
  };

  try {
    await Promise.race([
      insertClick(row),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('click_log_timeout')), LOG_TIMEOUT_MS);
      }),
    ]);
  } catch {
    // Swallow — revenue path continues.
  }
}

async function insertClick(row: {
  slug: string;
  concept: string;
  sub_id: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from('clicks').insert(row);
  if (error) {
    throw error;
  }
}
