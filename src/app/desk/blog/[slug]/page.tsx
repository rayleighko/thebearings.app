import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { DeskBrand } from '@/components/desk/DeskBrand';
import { JsonLd } from '@/components/desk/JsonLd';
import { getDeskBlogPost, listDeskBlogPosts } from '@/lib/desk/blog';
import { deskBlogPostingJsonLd, DESK_PUBLIC_ORIGIN, publicOriginForHost } from '@/lib/desk/seo';
import { deskBlogHref, deskBlogPostHref, deskIndexHref } from '@/lib/desk/urls';

type PageProps = {
  params: Promise<{ slug: string }>;
};

function renderBlogParagraphs(body: string) {
  const linkRe = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  return body.split(/\n{2,}/).map((paragraph, index) => {
    const nodes: ReactNode[] = [];
    let last = 0;
    const re = new RegExp(linkRe.source, 'g');
    let match: RegExpExecArray | null;
    while ((match = re.exec(paragraph)) !== null) {
      if (match.index > last) {
        nodes.push(paragraph.slice(last, match.index));
      }
      nodes.push(
        <Link
          key={`${index}-${match.index}`}
          href={match[2]}
          className="underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
        >
          {match[1]}
        </Link>,
      );
      last = match.index + match[0].length;
    }
    if (last < paragraph.length) {
      nodes.push(paragraph.slice(last));
    }
    return (
      <p key={index} className="mt-4 text-base text-cohort-ink-70">
        {nodes}
      </p>
    );
  });
}

export function generateStaticParams() {
  return listDeskBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getDeskBlogPost(slug);
  if (!post) {
    return { title: { absolute: '살까말까 연구소' } };
  }
  return {
    title: { absolute: `${post.title} — 살까말까 연구소` },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function DeskBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getDeskBlogPost(slug);
  if (!post) {
    notFound();
  }
  const host = (await headers()).get('host') ?? '';
  const origin = publicOriginForHost(host);
  const pageUrl = `${origin}${deskBlogPostHref(host, post.slug)}`;

  return (
    <main className="mx-auto min-h-screen max-w-xl break-keep bg-cohort-ivory px-5 py-10 text-cohort-ink-90">
      <JsonLd
        data={deskBlogPostingJsonLd({
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          url: pageUrl.startsWith('http') ? pageUrl : `${DESK_PUBLIC_ORIGIN}/blog/${post.slug}`,
        })}
      />
      <header>
        <DeskBrand href={deskIndexHref(host)} />
      </header>
      <nav className="mt-2 flex flex-wrap gap-x-4">
        <Link
          href={deskIndexHref(host)}
          className="inline-flex min-h-[44px] items-center text-sm text-cohort-ink-50 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
        >
          책상 물건
        </Link>
        <Link
          href={deskBlogHref(host)}
          className="inline-flex min-h-[44px] items-center text-sm text-cohort-ink-50 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
        >
          모든 글
        </Link>
      </nav>
      <article>
        <h1 className="mt-6 text-2xl font-semibold">{post.title}</h1>
        <p className="mt-2 text-sm text-cohort-ink-50">{post.date}</p>
        {renderBlogParagraphs(post.body)}
      </article>
    </main>
  );
}
