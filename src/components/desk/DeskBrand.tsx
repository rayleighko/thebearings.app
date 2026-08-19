import Image from 'next/image';
import Link from 'next/link';
import { DESK_BRAND_NAME, DESK_LOGO_SRC } from '@/lib/desk/brand';

type DeskBrandProps = {
  href: string;
};

/**
 * Header lockup — existing /desk/logo.png scale mark + HTML wordmark.
 * The image is decorative; the visible name is the accessible name.
 */
export function DeskBrand({ href }: DeskBrandProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-cohort-ink-10">
        <Image
          src={DESK_LOGO_SRC}
          alt=""
          width={112}
          height={112}
          priority
          sizes="56px"
          className="h-14 w-14 object-contain"
        />
      </span>
      <span className="break-keep text-lg font-semibold text-cohort-ink-90">
        {DESK_BRAND_NAME}
      </span>
    </Link>
  );
}
