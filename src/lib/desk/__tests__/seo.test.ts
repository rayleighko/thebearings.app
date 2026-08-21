import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildRobotsForHost,
  buildSitemapForHost,
  DESK_NAVER_SITE_VERIFICATION,
  deskItemListJsonLd,
  deskVerificationMetadata,
} from '@/lib/desk/seo';

describe('host-aware sitemap', () => {
  it('lists only desk public URLs on desk.thebearings.app', () => {
    const urls = buildSitemapForHost('desk.thebearings.app').map((row) => row.url);
    expect(urls).toContain('https://desk.thebearings.app/');
    expect(urls).not.toContain('https://desk.thebearings.app/dev');
    expect(urls).toContain('https://desk.thebearings.app/blog');
    expect(urls).toContain('https://desk.thebearings.app/blog/모니터-조명-천장불');
    expect(urls).not.toContain('https://desk.thebearings.app/blog/preparing');
    expect(urls.every((url) => !url.includes('?'))).toBe(true);
    expect(urls.every((url) => !url.includes('go.thebearings.app'))).toBe(true);
    expect(urls).not.toContain('https://desk.thebearings.app/minimal');
  });

  it('uses /desk paths on preview hosts', () => {
    const urls = buildSitemapForHost('thebearings-app-abc.vercel.app').map((row) => row.url);
    expect(urls).toContain('https://thebearings-app-abc.vercel.app/desk');
    expect(urls).not.toContain('https://thebearings-app-abc.vercel.app/desk/dev');
    expect(urls).toContain('https://thebearings-app-abc.vercel.app/desk/blog');
    expect(urls).toContain(
      'https://thebearings-app-abc.vercel.app/desk/blog/모니터-조명-천장불',
    );
  });

  it('returns no go URLs', () => {
    expect(buildSitemapForHost('go.thebearings.app')).toEqual([]);
  });

  it('keeps the existing Bearings list on www', () => {
    const urls = buildSitemapForHost('www.thebearings.app').map((row) => row.url);
    expect(urls).toEqual([
      'https://www.thebearings.app/',
      'https://www.thebearings.app/waitlist',
      'https://www.thebearings.app/privacy',
      'https://www.thebearings.app/terms',
    ]);
    expect(urls).not.toContain('https://www.thebearings.app/regime');
  });

  it('does not redirect apex/www / to /regime', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'next.config.mjs'), 'utf8');
    expect(src).not.toMatch(/destination:\s*'\/regime'/);
  });

  it('does not rewrite Cohort hosts onto desk URLs', () => {
    const urls = buildSitemapForHost('cohort.co.kr').map((row) => row.url);
    expect(urls[0]).toBe('https://cohort.co.kr/');
    expect(urls.every((url) => url.startsWith('https://cohort.co.kr'))).toBe(true);
  });
});

describe('host-aware robots', () => {
  it('disallows the entire go host', () => {
    expect(buildRobotsForHost('go.thebearings.app')).toEqual({
      rules: { userAgent: '*', disallow: '/' },
    });
  });

  it('points desk crawlers at the desk sitemap', () => {
    const robots = buildRobotsForHost('desk.thebearings.app');
    expect(robots.sitemap).toBe('https://desk.thebearings.app/sitemap.xml');
    expect(robots.rules).toEqual({ userAgent: '*', allow: '/' });
  });

  it('keeps the Bearings sitemap on www', () => {
    expect(buildRobotsForHost('www.thebearings.app').sitemap).toBe(
      'https://www.thebearings.app/sitemap.xml',
    );
  });
});

describe('desk verification env', () => {
  afterEach(() => {
    delete process.env.GOOGLE_SITE_VERIFICATION;
    delete process.env.NAVER_SITE_VERIFICATION;
  });

  it('always emits the desk Naver HTML-tag token', () => {
    delete process.env.GOOGLE_SITE_VERIFICATION;
    expect(deskVerificationMetadata()).toEqual({
      other: {
        'naver-site-verification': DESK_NAVER_SITE_VERIFICATION,
      },
    });
    expect(DESK_NAVER_SITE_VERIFICATION).toBe(
      '4a88cabec7e8636b0c46680b39411390990786fc',
    );
  });

  it('adds Google only when the operator env is set', () => {
    process.env.GOOGLE_SITE_VERIFICATION = 'g-token';
    expect(deskVerificationMetadata()).toEqual({
      google: 'g-token',
      other: {
        'naver-site-verification': DESK_NAVER_SITE_VERIFICATION,
      },
    });
  });
});

describe('JSON-LD', () => {
  it('emits Product ItemList without prices or go URLs', () => {
    const data = deskItemListJsonLd({
      name: '이 책상의 물건',
      pageUrl: 'https://desk.thebearings.app/dev',
      items: [
        {
          id: 'arm-nb-f80',
          name: '싱글 모니터암',
          price: '4만 원대',
          slug: 'arm-nb-f80',
          productUrl: 'https://link.coupang.com/a/example',
          img: '/desk/dev/arm-nb-f80.png',
          x: 50,
          y: 40,
          w: 42,
          z: 2,
        },
      ],
    });
    const json = JSON.stringify(data);
    expect(json).toContain('"@type":"Product"');
    expect(json).not.toContain('4만');
    expect(json).not.toContain('go.thebearings.app');
    expect(json).toContain('https://desk.thebearings.app/dev');
  });
});
