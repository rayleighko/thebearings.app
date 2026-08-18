import Image from 'next/image';
import Link from 'next/link';

type DeskBrandProps = {
  href: string;
};

/** Channel mark — full wordmark (scale + 살까말까 연구소). */
export function DeskBrand({ href }: DeskBrandProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
    >
      <Image
        src="/desk/logo.png"
        alt="살까말까 연구소"
        width={1024}
        height={1024}
        priority
        className="h-auto w-36 sm:w-44"
      />
    </Link>
  );
}
