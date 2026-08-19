import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { DeskBrand } from '@/components/desk/DeskBrand';
import { listDeskBlogPosts } from '@/lib/desk/blog';
import { deskBlogPostHref, deskIndexHref } from '@/lib/desk/urls';

export const metadata: Metadata = {
  title: { absolute: '글 — 살까말까 연구소' },
  description: '살까말까 연구소 글. 지금은 준비 중입니다. 책상 물건은 목록에서 볼 수 있습니다.',
  alternates: { canonical: '/blog' },
};

export default async function DeskBlogIndexPage() {
  const host = (await headers()).get('host') ?? '';
  const posts = listDeskBlogPosts();

  return (
    <main className="mx-auto min-h-screen max-w-xl break-keep bg-cohort-ivory px-5 py-10 text-cohort-ink-90">
      <header>
        <DeskBrand href={deskIndexHref(host)} />
      </header>
      <nav className="mt-2">
        <Link
          href={deskIndexHref(host)}
          className="inline-flex min-h-[44px] items-center text-sm text-cohort-ink-50 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
        >
          책상 물건
        </Link>
      </nav>
      <h1 className="mt-6 text-2xl font-semibold">글</h1>
      <p className="mt-2 text-base text-cohort-ink-70">
        후기를 쌓는 자리입니다. 지금은 준비 중이고, 물건은 책상 목록에서 고릅니다.
      </p>
      <ul className="mt-8 space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={deskBlogPostHref(host, post.slug)}
              className="flex min-h-[44px] flex-col justify-center rounded-xl border border-cohort-ink-10 bg-white px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
            >
              <span className="font-medium">{post.title}</span>
              <span className="mt-1 text-sm text-cohort-ink-50">{post.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
