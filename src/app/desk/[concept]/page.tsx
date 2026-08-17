import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AffiliateDisclosure } from '@/components/desk/AffiliateDisclosure';
import { DeskScene } from '@/components/desk/DeskScene';
import { SeoProductList } from '@/components/desk/SeoProductList';
import { CONCEPTS, getConcept } from '@/data/concepts';

type PageProps = {
  params: Promise<{ concept: string }>;
};

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ concept: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { concept: slug } = await params;
  const concept = getConcept(slug);
  if (!concept) {
    return { title: { absolute: 'Desk' } };
  }
  return {
    title: { absolute: `${concept.title} — Desk` },
    description: concept.note,
  };
}

export default async function DeskConceptPage({ params }: PageProps) {
  const { concept: slug } = await params;
  const concept = getConcept(slug);
  if (!concept) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl break-keep bg-cohort-ivory px-4 py-8 text-cohort-ink-90 sm:px-6">
      <AffiliateDisclosure className="rounded-lg border border-cohort-ink-10 bg-white px-4 py-3 text-cohort-ink-70" />
      <nav className="mt-6">
        <Link
          href="/desk"
          className="inline-flex min-h-[44px] items-center text-sm text-cohort-ink-50 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
        >
          모든 컨셉
        </Link>
      </nav>
      <h1 className="mt-4 text-2xl font-semibold">{concept.title}</h1>
      <p className="mt-2 text-base text-cohort-ink-70">{concept.note}</p>
      <p className="mt-2 text-sm text-cohort-ink-50">가격은 변동될 수 있습니다.</p>
      <div className="mt-6">
        <DeskScene concept={concept} />
      </div>
      {concept.items.length === 0 ? (
        <p className="mt-8 text-sm text-cohort-ink-50">
          이 컨셉의 제품 컷은 아직 없습니다. 배경만 미리 두었습니다.
        </p>
      ) : (
        <SeoProductList items={concept.items} heading="이 책상의 물건" />
      )}
    </main>
  );
}
