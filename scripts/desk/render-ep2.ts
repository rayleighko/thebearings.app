/**
 * Episode 2 render — ffmpeg 9:16 + Typecast VO. Not part of `pnpm build`.
 *
 *   pnpm desk:render-ep2
 *
 * Distinct clips from ep1. No on-screen [광고]. Does not upload.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const VO = path.resolve(ROOT, 'content/desk/uploads/02-arm-nb-f80/vo.wav');
const STICKER = path.resolve(ROOT, 'public/desk/dev/arm-nb-f80.png');
const PLATE_SWIFT = path.resolve(ROOT, 'scripts/desk/render-caption-plate.swift');
const CLIPS = path.resolve(ROOT, 'tmp/desk-stock/clips');
const OUT = path.resolve(ROOT, 'tmp/desk-stock/out');
const PLATES = path.join(OUT, 'ep2-plates');
const PROXY = path.join(OUT, 'ep2-arm-nb-f80.proxy.mp4');
const FINAL = path.join(OUT, 'ep2-arm-nb-f80-vo.mp4');
const PACK = path.resolve(ROOT, 'content/desk/uploads/02-arm-nb-f80/video.mp4');

const SCALE =
  'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30';

/** Shared 9:16 file — raised so Naver Shopping Connect card + Shorts chrome do not cover copy. */
const CAPTION_SAFE_BOTTOM = 720;
const STICKER_SAFE_BOTTOM = 800;

type Shot = {
  file: string;
  sourceStart: number;
  duration: number;
};

const SHOTS: Shot[] = [
  { file: 'arm-nb-f80-27430390.mp4', sourceStart: 3.5, duration: 2.2 },
  { file: 'arm-nb-f80-4629777.mp4', sourceStart: 1.0, duration: 2.8 },
  { file: 'arm-nb-f80-8480480.mp4', sourceStart: 1.0, duration: 3.0 },
  { file: 'arm-nb-f80-6177723.mp4', sourceStart: 0.4, duration: 2.2 },
];

const CAPTIONS = [
  { file: 'cap0.png', text: '목 아픈데 의자만 바꿔요?', start: 0, end: 2.2 },
  {
    file: 'cap1.png',
    text: '모니터가 아래면 고개가 따라 내려가요',
    start: 2.2,
    end: 5.0,
  },
  { file: 'cap2.png', text: '눈높이만 맞추면 돼요', start: 5.0, end: 8.0 },
  { file: 'cap3.png', text: '링크는 댓글에 있어요', start: 8.0, end: 10.2 },
] as const;

function die(message: string): never {
  console.error(message);
  process.exit(1);
}

function run(bin: string, args: string[]): void {
  const result = spawnSync(bin, args, {
    encoding: 'utf8',
    cwd: ROOT,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) {
    die(`${bin} failed\n${result.stdout}\n${result.stderr}`);
  }
}

function probe(file: string, entries: string): string {
  const result = spawnSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      entries,
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      file,
    ],
    { encoding: 'utf8' },
  );
  return (result.stdout || '').trim();
}

function ensure(): void {
  if (!existsSync(VO)) die(`Missing VO: ${VO}`);
  if (!existsSync(STICKER)) die(`Missing sticker: ${STICKER}`);
  for (const shot of SHOTS) {
    const loc = path.join(CLIPS, shot.file);
    if (!existsSync(loc)) die(`Missing clip ${loc}`);
  }
}

function plates(): void {
  mkdirSync(PLATES, { recursive: true });
  for (const cap of CAPTIONS) {
    const out = path.join(PLATES, cap.file);
    run('swift', [
      PLATE_SWIFT,
      '--text',
      cap.text,
      '--out',
      out,
      '--width',
      '1080',
      '--height',
      '1920',
      '--safe-bottom',
      String(CAPTION_SAFE_BOTTOM),
    ]);
    if (!existsSync(out)) die(`plate missing ${out}`);
  }
}

function concatVideo(): void {
  mkdirSync(OUT, { recursive: true });
  const args: string[] = ['-y'];
  for (const shot of SHOTS) {
    args.push(
      '-ss',
      String(shot.sourceStart),
      '-t',
      String(shot.duration),
      '-i',
      path.join(CLIPS, shot.file),
    );
  }
  const parts = SHOTS.map((_, i) => `[${i}:v]${SCALE}[v${i}]`).join(';');
  const concat = `${SHOTS.map((_, i) => `[v${i}]`).join('')}concat=n=${SHOTS.length}:v=1:a=0[vout]`;
  args.push(
    '-filter_complex',
    `${parts};${concat}`,
    '-map',
    '[vout]',
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '20',
    '-pix_fmt',
    'yuv420p',
    PROXY,
  );
  run('ffmpeg', args);
}

function burnAndMux(): void {
  const args: string[] = ['-y', '-i', PROXY, '-i', STICKER, '-i', VO];
  for (const cap of CAPTIONS) {
    args.push('-i', path.join(PLATES, cap.file));
  }

  const chain: string[] = [
    `[0:v][1:v]overlay=W-w-36:H-h-${STICKER_SAFE_BOTTOM}:enable='gte(t,5)'[vs]`,
  ];
  let last = '[vs]';
  CAPTIONS.forEach((cap, i) => {
    const next = i === CAPTIONS.length - 1 ? '[vout]' : `[c${i}]`;
    chain.push(
      `${last}[${i + 3}:v]overlay=0:0:enable='between(t,${cap.start},${cap.end})'${next}`,
    );
    last = next;
  });

  args.push(
    '-filter_complex',
    chain.join(';'),
    '-map',
    '[vout]',
    '-map',
    '2:a',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '20',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    '-shortest',
    '-movflags',
    '+faststart',
    FINAL,
  );
  run('ffmpeg', args);
}

function verify(): void {
  const duration = Number(probe(FINAL, 'format=duration'));
  const size = probe(FINAL, 'stream=width,height');
  const hasAudio = probe(FINAL, 'stream=codec_type');
  if (Number.isNaN(duration) || duration < 9.5 || duration > 11) {
    die(`duration out of range: ${duration}`);
  }
  if (!size.includes('1080') || !hasAudio.includes('audio')) {
    die(`probe failed size=${size} types=${hasAudio}`);
  }
  copyFileSync(FINAL, PACK);
  writeFileSync(
    path.join(OUT, 'ep2-arm-nb-f80.json'),
    `${JSON.stringify(
      {
        output: FINAL,
        pack: PACK,
        durationSec: duration,
        clips: SHOTS.map((s) => s.file),
        vo: '예슬 / 일반 / 1.0x',
        notes: [
          'No ep1 clip reuse',
          'Sticker from 5.0s, above Shopping Connect card',
          'Captions at safe-bottom 720 (YouTube + Naver shared)',
          'No on-screen [광고]',
        ],
      },
      null,
      2,
    )}\n`,
  );
  console.log(`OK  ${FINAL}`);
  console.log(`    ${PACK}`);
  console.log(`    ${duration.toFixed(2)}s  1080x1920  audio=yes`);
}

function main(): void {
  ensure();
  plates();
  concatVideo();
  burnAndMux();
  verify();
}

main();
