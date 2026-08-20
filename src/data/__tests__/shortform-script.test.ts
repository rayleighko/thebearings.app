import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  formatTypecastPaste,
  formatTypecastStudioBlock,
  formatYoutubeDescription,
  formatYoutubeUploadBlock,
  parseShortformScript,
} from '../shortform-script';

const ep2Path = path.resolve(
  process.cwd(),
  'content/desk/uploads/02-arm-nb-f80/script.json',
);

describe('shortform script pipeline', () => {
  const ep2 = parseShortformScript(JSON.parse(readFileSync(ep2Path, 'utf8')));

  it('requires vo gender and picture hook gender', () => {
    expect(ep2.vo.gender).toBe('female');
    expect(ep2.picture.hookGender).toBe('male');
  });

  it('emits four clean lines with no pause markup', () => {
    expect(formatTypecastPaste(ep2)).toBe(
      [
        '목 아픈데 의자만 바꿔요?',
        '모니터가 아래면 고개가 따라 내려가요.',
        '눈높이만 맞추면 돼요.',
        '링크는 댓글에 있어요.',
      ].join('\n'),
    );
    expect(formatTypecastPaste(ep2)).not.toMatch(/<\|[^|]+\|>/);
    expect(formatTypecastPaste(ep2)).not.toContain('[0.2s]');
  });

  it('prints studio settings separately from paste lines', () => {
    const block = formatTypecastStudioBlock(ep2);
    expect(block).toContain('배우: 예슬 (여성)');
    expect(block).toContain('감정: 일반');
    expect(block).toContain('화면 첫 인물: 남성');
    expect(block).not.toContain('<|0.2s|>');
  });

  it('rejects a script without vo.gender', () => {
    const raw = JSON.parse(readFileSync(ep2Path, 'utf8')) as Record<string, unknown>;
    delete (raw.vo as Record<string, unknown>).gender;
    expect(() => parseShortformScript(raw)).toThrow();
  });

  it('prints YouTube upload fields from the same script', () => {
    expect(formatYoutubeDescription(ep2)).toContain('[광고]');
    expect(formatYoutubeDescription(ep2)).toContain(
      'https://link.coupang.com/a/gi6GpRFFBI',
    );
    const block = formatYoutubeUploadBlock(ep2);
    expect(block).toContain('태그: 모니터암, 거북목, 데스크셋업, 재택근무, 살까말까연구소');
    expect(block).toContain('카테고리: 노하우 및 스타일');
    expect(block).toContain('유료 광고 포함: 켜기');
    expect(block).toContain('시청자: 아동용 아님');
    expect(block).not.toContain('go.thebearings.app');
    const pinned = block.split('고정 댓글:')[1] ?? '';
    expect(pinned).toContain('하지 말 것');
    expect(pinned).not.toContain('link.coupang.com');
  });
});
