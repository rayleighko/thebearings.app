import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AFFILIATE_DISCLOSURE } from '@/components/desk/AffiliateDisclosure';
import { DeskChrome } from '@/components/desk/DeskChrome';

describe('DeskChrome', () => {
  it('renders one-lab header, YouTube, disclosure, and no legal-entity fields', () => {
    render(
      <DeskChrome
        homeHref="/"
        shopHref="https://desk.thebearings.app/"
        blogHref="https://desk.thebearings.app/blog"
        archiveHref="/regime"
      >
        <p>본문</p>
      </DeskChrome>,
    );

    expect(screen.getByRole('link', { name: '살까말까 연구소' })).toBeDefined();
    expect(screen.getAllByRole('link', { name: '책상 물건' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: '글' })).toBeDefined();
    expect(screen.getByRole('link', { name: /YouTube @sal-kka-lab/ })).toBeDefined();
    expect(screen.getByRole('link', { name: '보관됨' }).getAttribute('href')).toBe(
      '/regime',
    );
    expect(screen.getByTestId('affiliate-disclosure').textContent).toBe(
      AFFILIATE_DISCLOSURE,
    );
    expect(document.body.textContent).toContain('[광고]');
    expect(document.body.textContent).not.toContain('사업자등록번호');
    expect(document.body.textContent).not.toContain('사업자 정보는 준비 중');
    expect(document.body.textContent).not.toContain('추천');
    expect(screen.getByRole('link', { name: '본문으로' })).toBeDefined();
  });
});
