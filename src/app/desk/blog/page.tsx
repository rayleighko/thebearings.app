import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { DeskChrome } from '@/components/desk/DeskChrome';
import { listIndexableDeskBlogPosts } from '@/lib/desk/blog';
import { DESK_ABOUT } from '@/lib/desk/brand';
import { deskBlogPostHref, deskChromeHrefs } from '@/lib/desk/urls';

export const metadata: Metadata = {
  title: { absolute: '글 — 살까말까 연구소' },
  description:
    '살까말까 연구소 글. 후기나 순위는 없습니다. 책상 물건은 목록에서 볼 수 있습니다.',
  alternates: { canonical: '/blog' },
};

export default async function DeskBlogIndexPage() {
  const host = (await headers()).get('host') ?? '';
  const posts = listIndexableDeskBlogPosts();
  const { homeHref, shopHref, blogHref } = deskChromeHrefs(host);

  return (
    <DeskChrome homeHref={homeHref} shopHref={shopHref} blogHref={blogHref} current="blog">
      <h1 className="mt-8 text-2xl font-semibold">글</h1>
      <p className="mt-4 text-base text-cohort-ink-70">{DESK_ABOUT}</p>
      <p className="mt-3 text-base text-cohort-ink-70">
        후기나 순위는 없습니다. 결정 한 줄만 적습니다.
      </p>
      {posts.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-cohort-ink-10 bg-white px-4 py-3 text-sm text-cohort-ink-70">
          준비 중
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={deskBlogPostHref(host, post.slug)}
                className="flex min-h-[44px] flex-col justify-center rounded-xl border border-cohort-ink-10 bg-white px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
              >
                <span className="font-medium">{post.title}</span>
                <span className="mt-1 text-sm text-cohort-ink-70">{post.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={shopHref}
        className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-cohort-ink-10 bg-white px-4 py-3 text-base font-medium text-cohort-ink-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
      >
        책상 물건 보기
      </Link>
    </DeskChrome>
  );
}
