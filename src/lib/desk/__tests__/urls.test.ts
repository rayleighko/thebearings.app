import { describe, expect, it } from 'vitest';
import { deskChromeHrefs, deskDevHref } from '@/lib/desk/urls';

describe('deskChromeHrefs', () => {
  it('points www/apex at the desk host so cards stay in one shop', () => {
    expect(deskChromeHrefs('www.thebearings.app')).toEqual({
      homeHref: '/',
      shopHref: 'https://desk.thebearings.app/',
      blogHref: 'https://desk.thebearings.app/blog',
      devHref: 'https://desk.thebearings.app/dev',
    });
    expect(deskChromeHrefs('thebearings.app')).toEqual(
      deskChromeHrefs('www.thebearings.app'),
    );
  });

  it('uses host-relative desk paths on desk.thebearings.app', () => {
    expect(deskChromeHrefs('desk.thebearings.app')).toEqual({
      homeHref: '/',
      shopHref: '/',
      blogHref: '/blog',
      devHref: '/dev',
    });
  });

  it('keeps /desk prefixes on preview', () => {
    expect(deskDevHref('thebearings-app-abc.vercel.app')).toBe('/desk/dev');
    expect(deskChromeHrefs('thebearings-app-abc.vercel.app').shopHref).toBe('/desk');
  });
});
