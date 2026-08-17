import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { getSlugTarget } from '@/data/concepts';

const { logClick } = vi.hoisted(() => ({
  logClick: vi.fn(async () => {}),
}));

vi.mock('@/lib/desk/log-click', () => ({
  logClick,
}));

import { GET } from '../route';

function makeRequest(path: string, headers?: Record<string, string>) {
  return new NextRequest(`http://localhost${path}`, { headers });
}

afterEach(() => {
  logClick.mockReset();
  logClick.mockResolvedValue(undefined);
});

describe('GET /go/[slug]', () => {
  it('302s a known slug to its productUrl and logs the click', async () => {
    const target = getSlugTarget('arm-nb-f80');
    expect(target).toBeDefined();

    const res = await GET(
      makeRequest('/go/arm-nb-f80', {
        referer: 'https://desk.thebearings.app/dev',
        'user-agent': 'vitest',
        'x-vercel-ip-country': 'KR',
      }),
      { params: Promise.resolve({ slug: 'arm-nb-f80' }) },
    );

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe(target!.productUrl);
    expect(logClick).toHaveBeenCalledWith({
      slug: 'arm-nb-f80',
      concept: 'dev',
      referrer: 'https://desk.thebearings.app/dev',
      userAgent: 'vitest',
      country: 'KR',
    });
  });

  it('returns 404 for an unknown slug and does not log', async () => {
    const res = await GET(makeRequest('/go/not-a-real-product'), {
      params: Promise.resolve({ slug: 'not-a-real-product' }),
    });
    expect(res.status).toBe(404);
    expect(logClick).not.toHaveBeenCalled();
    const body = await res.text();
    expect(body).not.toMatch(/Cohort/i);
    expect(body).not.toMatch(/Aurora/i);
  });

  it('returns 404 for an invalid slug shape', async () => {
    const res = await GET(makeRequest('/go/../etc'), {
      params: Promise.resolve({ slug: '../etc' }),
    });
    expect(res.status).toBe(404);
    expect(logClick).not.toHaveBeenCalled();
    expect(await res.text()).not.toMatch(/Cohort/i);
  });

  it('still 302s when logging throws', async () => {
    logClick.mockRejectedValueOnce(new Error('supabase down'));
    const target = getSlugTarget('arm-nb-f80');

    const res = await GET(makeRequest('/go/arm-nb-f80'), {
      params: Promise.resolve({ slug: 'arm-nb-f80' }),
    });

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe(target!.productUrl);
  });
});
