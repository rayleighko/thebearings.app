'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import type { Concept, Item } from '@/data/concepts';
import { ProductSheet } from '@/components/desk/ProductSheet';

type DeskSceneProps = {
  concept: Concept;
};

export function DeskScene({ concept }: DeskSceneProps) {
  const [open, setOpen] = useState<Item | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-xl bg-cohort-ink-10 aspect-[4/3]">
        <Image
          src={concept.bg}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
        />
        {concept.items.map((item) => {
          const eager = item.y < 55;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpen(item)}
              aria-label={item.name}
              className="absolute min-h-[44px] min-w-[44px] cursor-pointer rounded-sm bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.w}%`,
                zIndex: item.z,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Image
                src={item.img}
                alt=""
                width={800}
                height={800}
                className="pointer-events-none h-auto w-full"
                loading={eager ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 45vw, 30vw"
              />
            </button>
          );
        })}
      </div>
      {open ? <ProductSheet item={open} onClose={close} /> : null}
    </>
  );
}
