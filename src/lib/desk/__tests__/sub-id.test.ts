import { describe, expect, it } from 'vitest';
import { buildSubId } from '@/lib/desk/sub-id';

describe('buildSubId', () => {
  it('formats {concept}-{slug}-{YYYYMMDD} in UTC', () => {
    expect(buildSubId('dev', 'arm-nb-f80', new Date('2026-08-17T15:00:00Z'))).toBe(
      'dev-arm-nb-f80-20260817',
    );
  });

  it('pads month and day', () => {
    expect(buildSubId('dev', 'kbd-keychron-k8', new Date('2026-01-05T00:00:00Z'))).toBe(
      'dev-kbd-keychron-k8-20260105',
    );
  });
});
