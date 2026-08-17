import Link from 'next/link';
import { AffiliateDisclosure } from '@/components/desk/AffiliateDisclosure';
import { CONCEPTS, listPublishedConcepts } from '@/data/concepts';

export default function DeskIndexPage() {
  const published = listPublishedConcepts();

  return (
    <main className="mx-auto min-h-screen max-w-xl break-keep bg-cohort-ivory px-5 py-10 text-cohort-ink-90">
      <AffiliateDisclosure className="rounded-lg border border-cohort-ink-10 bg-white px-4 py-3 text-cohort-ink-70" />
      <h1 className="mt-8 text-2xl font-semibold">Desk</h1>
      <p className="mt-3 text-base text-cohort-ink-70">
        책상 컨셉을 고르면 물건이 놓인 장면을 볼 수 있습니다. 탭하면 제품 정보와
        구매 링크가 열립니다.
      </p>
      <p className="mt-2 text-sm text-cohort-ink-50">가격은 변동될 수 있습니다.</p>
      <ul className="mt-8 space-y-3">
        {CONCEPTS.map((concept) => {
          const ready = concept.items.length > 0;
          return (
            <li key={concept.slug}>
              {ready ? (
                <Link
                  href={`/desk/${concept.slug}`}
                  className="flex min-h-[44px] items-center justify-between rounded-xl border border-cohort-ink-10 bg-white px-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
                >
                  <span>
                    <span className="block font-medium">{concept.title}</span>
                    <span className="mt-1 block text-sm text-cohort-ink-50">
                      {concept.note}
                    </span>
                  </span>
                  <span className="ml-3 text-sm text-cohort-ink-50" aria-hidden>
                    →
                  </span>
                </Link>
              ) : (
                <div className="rounded-xl border border-dashed border-cohort-ink-10 px-4 py-3">
                  <span className="block font-medium text-cohort-ink-70">
                    {concept.title}
                  </span>
                  <span className="mt-1 block text-sm text-cohort-ink-50">
                    준비 중 — 배경만 있습니다.
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {published.length === 0 ? (
        <p className="mt-8 text-sm text-cohort-ink-50">공개된 컨셉이 아직 없습니다.</p>
      ) : null}
    </main>
  );
}
