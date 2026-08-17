import { afterEach, describe, expect, it, vi } from 'vitest';

const insert = vi.fn(async () => ({ error: null as { message: string } | null }));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({ insert })),
  })),
}));

import { logClick } from '@/lib/desk/log-click';

afterEach(() => {
  insert.mockReset();
  insert.mockResolvedValue({ error: null });
});

describe('logClick', () => {
  it('inserts a clicks row', async () => {
    await logClick({
      slug: 'arm-nb-f80',
      concept: 'dev',
      referrer: null,
      userAgent: 'vitest',
      country: 'KR',
    });
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'arm-nb-f80',
        concept: 'dev',
        sub_id: expect.stringMatching(/^dev-arm-nb-f80-\d{8}$/),
      }),
    );
  });

  it('swallows insert errors', async () => {
    insert.mockResolvedValueOnce({ error: { message: 'rls' } });
    await expect(
      logClick({
        slug: 'arm-nb-f80',
        concept: 'dev',
        referrer: null,
        userAgent: null,
        country: null,
      }),
    ).resolves.toBeUndefined();
  });

  it('swallows missing admin client', async () => {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    vi.mocked(createAdminClient).mockImplementationOnce(() => {
      throw new Error('missing env');
    });
    await expect(
      logClick({
        slug: 'arm-nb-f80',
        concept: 'dev',
        referrer: null,
        userAgent: null,
        country: null,
      }),
    ).resolves.toBeUndefined();
  });
});
