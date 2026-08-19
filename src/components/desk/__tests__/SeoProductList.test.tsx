import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DeskProductCards } from '@/components/desk/DeskProductCards';
import { orderDeskItems } from '@/data/concepts';
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

  it('emits product cards with sponsored rel', () => {
    const dev = getConcept('dev');
    expect(dev).toBeDefined();
    const items = orderDeskItems(dev!.items);
    render(<DeskProductCards items={items} heading="이 책상의 물건" />);
    for (const item of items) {
      const link = screen.getByRole('link', { name: new RegExp(item.name) });
      expect(link.getAttribute('rel')).toBe(AFFILIATE_REL);
    }
  });

  it('hides catalog price bands on cards', () => {
    const dev = getConcept('dev');
    const items = orderDeskItems(dev!.items);
    render(<DeskProductCards items={items} heading="이 책상의 물건" />);
    for (const item of items) {
      expect(screen.queryByText(item.price)).toBeNull();
    }
  });

  it('does not claim 이 영상 without explicit featuredSlug', () => {
    const dev = getConcept('dev');
    const items = orderDeskItems(dev!.items);
    render(<DeskProductCards items={items} heading="이 책상의 물건" />);
    expect(screen.queryByText('이 영상')).toBeNull();
  });

  it('shows 이 영상 only when featuredSlug is passed', () => {
    const dev = getConcept('dev');
    const items = orderDeskItems(dev!.items, 'arm-nb-f80');
    render(
      <DeskProductCards
        items={items}
        heading="이 책상의 물건"
        featuredSlug="arm-nb-f80"
      />,
    );
    expect(screen.getByText('이 영상')).toBeDefined();
  });
});
