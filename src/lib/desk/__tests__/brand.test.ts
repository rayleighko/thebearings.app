import { describe, expect, it } from 'vitest';
import {
  DESK_ABOUT,
  DESK_BRAND_NAME,
  DESK_BRAND_REWRITES,
  DESK_ICONS,
  DESK_LOGO_HEIGHT,
  DESK_LOGO_SRC,
  DESK_LOGO_WIDTH,
  DESK_OPEN_GRAPH,
  DESK_YOUTUBE_HREF,
  deskBrandRewritePath,
  isDeskPublicFile,
} from '@/lib/desk/brand';

describe('desk brand assets', () => {
  it('rewrites well-known Cohort leftovers to 살까말까 files', () => {
    expect(deskBrandRewritePath('/favicon.ico')).toBe('/desk/favicon-32.png');
    expect(deskBrandRewritePath('/apple-touch-icon.png')).toBe(
      '/desk/apple-touch-icon.png',
    );
    expect(deskBrandRewritePath('/site.webmanifest')).toBe('/desk.webmanifest');
    expect(deskBrandRewritePath('/dev')).toBeNull();
  });

  it('does not point desk icons at Cohort root leftovers', () => {
    const serialized = JSON.stringify(DESK_ICONS);
    expect(serialized).toContain('/desk/favicon-32.png');
    expect(serialized).toContain('/desk/apple-touch-icon.png');
    expect(serialized).not.toContain('"/favicon.ico"');
    expect(serialized).not.toContain('"/logo.png"');
    expect(DESK_LOGO_SRC).toBe('/desk/logo.png');
    expect(DESK_BRAND_NAME).toBe('살까말까 연구소');
    expect(isDeskPublicFile('/desk.webmanifest')).toBe(true);
  });

  it('keeps every rewrite destination under /desk', () => {
    for (const dest of Object.values(DESK_BRAND_REWRITES)) {
      expect(dest === '/desk.webmanifest' || dest.startsWith('/desk/')).toBe(
        true,
      );
    }
  });

  it('declares OG image size and YouTube without legal-entity fields', () => {
    expect(DESK_OPEN_GRAPH.images).toEqual([
      {
        url: DESK_LOGO_SRC,
        alt: DESK_BRAND_NAME,
        width: DESK_LOGO_WIDTH,
        height: DESK_LOGO_HEIGHT,
      },
    ]);
    expect(DESK_YOUTUBE_HREF).toBe('https://www.youtube.com/@sal-kka-lab');
    expect(DESK_ABOUT).not.toContain('사업자');
    expect(DESK_ABOUT).not.toContain('추천');
  });
});
