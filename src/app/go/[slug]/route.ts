import { NextResponse, type NextRequest } from 'next/server';
import { getSlugTarget } from '@/data/concepts';
import { logClick } from '@/lib/desk/log-click';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function goNotFoundResponse(): NextResponse {
  return new NextResponse(
    `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Desk</title></head><body><p>링크를 찾을 수 없습니다.</p></body></html>`,
    {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    },
  );
}

/**
 * go.thebearings.app/:slug — log click, 302 to Coupang.
 * Unknown slug → 404 (never a random Coupang URL).
 * Insert failure must never block the redirect.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug: raw } = await context.params;
  const slug = decodeURIComponent(raw ?? '').trim();

  if (!slug || !SLUG_RE.test(slug)) {
    return goNotFoundResponse();
  }

  const target = getSlugTarget(slug);
  if (!target) {
    return goNotFoundResponse();
  }

  try {
    await logClick({
      slug: target.slug,
      concept: target.concept,
      referrer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
      country: request.headers.get('x-vercel-ip-country'),
    });
  } catch {
    // Logging must never block the 302.
  }

  return NextResponse.redirect(target.productUrl, 302);
}
