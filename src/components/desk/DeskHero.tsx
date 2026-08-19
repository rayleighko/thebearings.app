import Image from 'next/image';

type DeskHeroProps = {
  src: string;
  alt: string;
};

/** Optional desk photo. Concept pages omit this until there is a real operator photo. */
export function DeskHero({ src, alt }: DeskHeroProps) {
  return (
    <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-xl bg-cohort-ink-10">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 960px"
        className="object-cover"
      />
    </div>
  );
}
