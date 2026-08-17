/**
 * Fair Trade Commission disclosure — exact wording, every desk page.
 * Conditional phrasing ("받을 수 있습니다") is forbidden.
 */
export const AFFILIATE_DISCLOSURE =
  '이 페이지는 쿠팡 파트너스 활동의 일환으로,\n이에 따른 일정액의 수수료를 제공받습니다.';

export function AffiliateDisclosure({ className = '' }: { className?: string }) {
  return (
    <p
      className={`break-keep whitespace-pre-line text-sm leading-relaxed ${className}`}
      data-testid="affiliate-disclosure"
    >
      {AFFILIATE_DISCLOSURE}
    </p>
  );
}
