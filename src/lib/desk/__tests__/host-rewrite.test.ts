import { describe, expect, it } from 'vitest';
import {
  DESK_MISSING_PATH,
  deskRewritePath,
  goRewritePath,
  singleSegmentSlug,
} from '@/lib/desk/host-rewrite';

describe('singleSegmentSlug', () => {
  it('accepts kebab slugs', () => {
    expect(singleSegmentSlug('/dev')).toBe('dev');
    expect(singleSegmentSlug('/arm-nb-f80')).toBe('arm-nb-f80');
  });

  it('rejects multi-segment and invalid shapes', () => {
    expect(singleSegmentSlug('/desk/dev')).toBeNull();
    expect(singleSegmentSlug('/')).toBeNull();
    expect(singleSegmentSlug('/Arm')).toBeNull();
    expect(singleSegmentSlug('/foo_bar')).toBeNull();
  });
});

describe('deskRewritePath', () => {
  it('rewrites host root and concept slugs', () => {
    expect(deskRewritePath('/')).toBe('/desk');
    expect(deskRewritePath('/dev')).toBe('/desk/dev');
  });

  it('passes through already-prefixed desk/go paths', () => {
    expect(deskRewritePath('/desk')).toBeNull();
    expect(deskRewritePath('/desk/dev')).toBeNull();
    expect(deskRewritePath('/go/arm-nb-f80')).toBeNull();
  });

  it('sends unmatched paths to the desk missing route', () => {
    expect(deskRewritePath('/foo/bar')).toBe(DESK_MISSING_PATH);
    expect(deskRewritePath('/not_valid')).toBe(DESK_MISSING_PATH);
  });
});

describe('goRewritePath', () => {
  it('rewrites host root and product slugs', () => {
    expect(goRewritePath('/')).toBe('/go');
    expect(goRewritePath('/arm-nb-f80')).toBe('/go/arm-nb-f80');
  });

  it('passes through already-prefixed /go paths', () => {
    expect(goRewritePath('/go')).toBeNull();
    expect(goRewritePath('/go/arm-nb-f80')).toBeNull();
  });

  it('sends unmatched paths to the go index (nested 404)', () => {
    expect(goRewritePath('/foo/bar')).toBe('/go');
  });
});
