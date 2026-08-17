import Link from 'next/link';
import { headers } from 'next/headers';
import { DeskNotFound } from '@/components/desk/DeskNotFound';
import {
  isBearingsPublicHost,
  isDeskOrGoHost,
  isGoHost,
  isPreviewOrLocalHost,
} from '@/lib/desk/hosts';
import { deskIndexHref } from '@/lib/desk/urls';

export default async function NotFound() {
  const host = (await headers()).get('host') ?? '';

  if (isDeskOrGoHost(host)) {
    return (
      <DeskNotFound
        homeHref={
          isGoHost(host) ? 'https://desk.thebearings.app/' : deskIndexHref(host)
        }
        homeLabel="Desk로"
      />
    );
  }

  const homeHref =
    isBearingsPublicHost(host)
      ? '/regime'
      : isPreviewOrLocalHost(host)
        ? '/desk'
        : '/';

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm text-cohort-ink-50">The Bearings</p>
      <h1 className="mt-2 text-2xl font-bold text-cohort-charcoal">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-3 text-sm text-cohort-ink-50 break-keep">
        주소가 바뀌었거나 더 이상 제공하지 않는 페이지일 수 있어요.
      </p>
      <Link
        href={homeHref}
        className="mt-8 inline-flex min-h-[44px] items-center rounded-xl bg-cohort-charcoal px-6 text-base font-semibold text-cohort-ivory"
      >
        홈으로
      </Link>
    </main>
  );
}
