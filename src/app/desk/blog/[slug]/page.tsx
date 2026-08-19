import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { DeskChrome } from '@/components/desk/DeskChrome';
import { JsonLd } from '@/components/desk/JsonLd';
import { getDeskBlogPost, listDeskBlogPosts } from '@/lib/desk/blog';
import { deskBlogPostingJsonLd, DESK_PUBLIC_ORIGIN, publicOriginForHost } from '@/lib/desk/seo';
import { deskBlogPostHref, deskChromeHrefs } from '@/lib/desk/urls';

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
    robots: post.indexable ? undefined : { index: false, follow: true },
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
  const { homeHref, shopHref, blogHref } = deskChromeHrefs(host);

  return (
    <DeskChrome homeHref={homeHref} shopHref={shopHref} blogHref={blogHref} current="blog">
      {post.indexable ? (
        <JsonLd
          data={deskBlogPostingJsonLd({
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            url: pageUrl.startsWith('http') ? pageUrl : `${DESK_PUBLIC_ORIGIN}/blog/${post.slug}`,
          })}
        />
      ) : null}
      <article>
        <h1 className="mt-8 text-2xl font-semibold">{post.title}</h1>
        <p className="mt-2 text-sm text-cohort-ink-70">{post.date}</p>
        {renderBlogParagraphs(post.body)}
      </article>
    </DeskChrome>
  );
}
