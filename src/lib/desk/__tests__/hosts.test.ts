import { describe, expect, it } from 'vitest';
import {
  hostnameFromHostHeader,
  isBearingsPublicHost,
  isCohortArchiveHost,
  isDeskHost,
  isDeskOrGoHost,
  isGoHost,
  isPreviewOrLocalHost,
} from '@/lib/desk/hosts';

describe('desk/go hosts', () => {
  it('strips port from Host header', () => {
    expect(hostnameFromHostHeader('desk.thebearings.app:443')).toBe(
      'desk.thebearings.app',
    );
  });

  it('recognizes production desk and go hosts', () => {
    expect(isDeskHost('desk.thebearings.app')).toBe(true);
    expect(isGoHost('go.thebearings.app')).toBe(true);
    expect(isDeskHost('www.thebearings.app')).toBe(false);
    expect(isGoHost('www.thebearings.app')).toBe(false);
  });

  it('does not treat thebearings.app root as desk or go', () => {
    expect(isDeskHost('thebearings.app')).toBe(false);
    expect(isGoHost('thebearings.app')).toBe(false);
    expect(isDeskOrGoHost('www.thebearings.app')).toBe(false);
  });

  it('recognizes apex and www as Bearings public hosts', () => {
    expect(isBearingsPublicHost('thebearings.app')).toBe(true);
    expect(isBearingsPublicHost('www.thebearings.app')).toBe(true);
    expect(isBearingsPublicHost('desk.thebearings.app')).toBe(false);
    expect(isBearingsPublicHost('go.thebearings.app')).toBe(false);
  });

  it('treats Vercel preview and localhost as desk validation hosts', () => {
    expect(isPreviewOrLocalHost('thebearings-app-abc.vercel.app')).toBe(true);
    expect(isPreviewOrLocalHost('localhost:3000')).toBe(true);
    expect(isPreviewOrLocalHost('www.thebearings.app')).toBe(false);
    expect(isCohortArchiveHost('cohort.co.kr')).toBe(true);
    expect(isCohortArchiveHost('thebearings-app-abc.vercel.app')).toBe(false);
  });
});
