import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeoProductList } from '@/components/desk/SeoProductList';
import { AFFILIATE_DISCLOSURE } from '@/components/desk/AffiliateDisclosure';
import { AffiliateDisclosure } from '@/components/desk/AffiliateDisclosure';
import { getConcept } from '@/data/concepts';
import { AFFILIATE_REL } from '@/lib/desk/urls';

describe('desk compliance copy', () => {
  it('renders the exact disclosure wording', () => {
    render(<AffiliateDisclosure />);
    expect(screen.getByTestId('affiliate-disclosure').textContent).toBe(
      AFFILIATE_DISCLOSURE,
    );
    expect(AFFILIATE_DISCLOSURE).toContain('수수료를 제공받습니다');
    expect(AFFILIATE_DISCLOSURE).not.toContain('받을 수 있습니다');
  });

  it('emits a text product list with sponsored rel', () => {
    const dev = getConcept('dev');
    expect(dev).toBeDefined();
    render(<SeoProductList items={dev!.items} heading="이 책상의 물건" />);
    for (const item of dev!.items) {
      const link = screen.getByRole('link', { name: item.name });
      expect(link.getAttribute('rel')).toBe(AFFILIATE_REL);
    }
  });
});
