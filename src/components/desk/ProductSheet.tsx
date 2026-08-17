'use client';

import { useEffect, useId, useRef } from 'react';
import type { Item } from '@/data/concepts';
import { AFFILIATE_REL, getAffiliateHref } from '@/lib/desk/urls';

type ProductSheetProps = {
  item: Item;
  onClose: () => void;
};

export function ProductSheet({ item, onClose }: ProductSheetProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/40 motion-safe:transition-opacity motion-reduce:transition-none"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-t-2xl bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-lg sm:rounded-2xl sm:px-6 sm:py-6"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-cohort-ink-10 sm:hidden" />
        <h2 id={titleId} className="break-keep text-xl font-semibold text-cohort-ink-90">
          {item.name}
        </h2>
        <p className="mt-2 text-base text-cohort-ink-70">{item.price}</p>
        <p className="mt-1 text-sm text-cohort-ink-50">가격은 변동될 수 있습니다.</p>
        <a
          href={getAffiliateHref(item.slug)}
          rel={AFFILIATE_REL}
          target="_blank"
          className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-cohort-charcoal px-4 text-base font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-charcoal"
        >
          쿠팡에서 보기
        </a>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-cohort-ink-10 px-4 text-base text-cohort-ink-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cohort-ink-90"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
