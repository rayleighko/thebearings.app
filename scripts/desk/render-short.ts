/**
 * Operator script — episode 1 (arm-nb-f80) via unofficial capcut-cli + ffmpeg proxy.
 *
 * Not part of `pnpm build`. Does not read `.env.local`. Does not upload.
 *
 *   pnpm desk:render-ep1
 *
 * Flow:
 *   1. npx capcut-cli doctor
 *   2. compile scripts/desk/ep1-arm-spec.json → tmp/desk-stock/drafts/ep1-arm-nb-f80
 *   3. capcut-cli render --scale 1 --all-video-tracks (ffmpeg proxy; no CapCut app)
 *   4. Overlay Korean caption plates (this Homebrew ffmpeg has no drawtext)
 */

import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SPEC_PATH = path.resolve(ROOT, 'scripts/desk/ep1-arm-spec.json');
const PLATE_SWIFT = path.resolve(ROOT, 'scripts/desk/render-caption-plate.swift');
const STICKER = path.resolve(ROOT, 'public/desk/dev/arm-nb-f80.png');
const CLIPS_DIR = path.resolve(ROOT, 'tmp/desk-stock/clips');
const DRAFT_DIR = path.resolve(ROOT, 'tmp/desk-stock/drafts/ep1-arm-nb-f80');
const OUT_DIR = path.resolve(ROOT, 'tmp/desk-stock/out');
const PROXY_MP4 = path.join(OUT_DIR, 'ep1-arm-nb-f80.proxy.mp4');
const FINAL_MP4 = path.join(OUT_DIR, 'ep1-arm-nb-f80.mp4');
const PLATES_DIR = path.join(OUT_DIR, 'caption-plates');

const REQUIRED_CLIPS = [
  'arm-nb-f80-8519534.mp4',
  'arm-nb-f80-7489592.mp4',
  'arm-nb-f80-12894329.mp4',
  'arm-nb-f80-7653215.mp4',
] as const;

type Plate = {
  file: string;
  text: string;
  start: number;
  end: number;
};

const PLATES: Plate[] = [
  {
    file: 'cap0.png',
    text: '고개 앞으로 나감',
    start: 0,
    end: 2,
  },
  {
    file: 'cap1.png',
    text: '오후엔 목부터',
    start: 2,
    end: 8,
  },
  {
    file: 'cap2.png',
    text: '높이만 맞추면 됨',
    start: 8,
    end: 14,
  },
  {
    file: 'cap3.png',
    text: '링크는 프로필에',
    start: 14,
    end: 20,
  },
];

function die(message: string, code = 1): never {
  console.error(message);
  process.exit(code);
}

function run(
  bin: string,
  args: string[],
  opts: { cwd?: string; inherit?: boolean } = {},
): SpawnSyncReturns<string> {
  const result = spawnSync(bin, args, {
    encoding: 'utf8',
    cwd: opts.cwd ?? ROOT,
    stdio: opts.inherit ? 'inherit' : 'pipe',
    timeout: 600_000,
    maxBuffer: 64 * 1024 * 1024,
  });
  return result;
}

function capcut(args: string[], inherit = false): SpawnSyncReturns<string> {
  return run('npx', ['--yes', 'capcut-cli', ...args], { inherit });
}

function requireBin(name: string): void {
  const result = spawnSync('which', [name], { encoding: 'utf8' });
  if (result.status !== 0 || !result.stdout.trim()) {
    die(`Missing ${name}. Install with: brew install ${name}`);
  }
}

function printHelp(): void {
  console.log(`Render episode 1 (arm-nb-f80) via capcut-cli compile + ffmpeg proxy.

  pnpm desk:render-ep1

Writes:
  tmp/desk-stock/drafts/ep1-arm-nb-f80/   CapCut draft (open in the app later)
  tmp/desk-stock/out/ep1-arm-nb-f80.mp4   watchable 9:16 proxy

Does not upload. Does not read .env.local.`);
}

function ensureInputs(): void {
  if (!existsSync(SPEC_PATH)) die(`Missing compile spec: ${SPEC_PATH}`);
  if (!existsSync(STICKER)) die(`Missing official cutout: ${STICKER}`);
  if (!existsSync(PLATE_SWIFT)) die(`Missing caption plate helper: ${PLATE_SWIFT}`);
  for (const clip of REQUIRED_CLIPS) {
    const loc = path.join(CLIPS_DIR, clip);
    if (!existsSync(loc)) {
      die(`Missing licensed clip ${loc}\nRun: pnpm desk:fetch-stock -- --sku=arm-nb-f80`);
    }
  }
}

function doctor(): void {
  const result = capcut(['doctor']);
  const text = `${result.stdout}\n${result.stderr}`.trim();
  if (result.status !== 0) {
    die(`capcut-cli doctor failed (exit ${result.status}).\n${text}`);
  }
  console.log(text || 'capcut-cli doctor: ok');
  try {
    const parsed = JSON.parse(result.stdout) as {
      checks?: { name: string; status: string; detail?: string }[];
    };
    const ffmpeg = parsed.checks?.find((c) => c.name === 'ffmpeg');
    if (ffmpeg?.detail) console.log(`ffmpeg capabilities: ${ffmpeg.detail}`);
  } catch {
    /* doctor already printed */
  }
}

function compileDraft(): void {
  if (existsSync(DRAFT_DIR)) {
    rmSync(DRAFT_DIR, { recursive: true, force: true });
  }
  mkdirSync(path.dirname(DRAFT_DIR), { recursive: true });

  const check = capcut(['compile', SPEC_PATH, '--check']);
  const checkText = `${check.stdout}\n${check.stderr}`.trim();
  if (check.status !== 0) {
    die(`capcut-cli compile --check failed.\n${checkText}`);
  }
  console.log(checkText);

  const built = capcut(['compile', SPEC_PATH, '--out', DRAFT_DIR]);
  const builtText = `${built.stdout}\n${built.stderr}`.trim();
  if (built.status !== 0) {
    die(`capcut-cli compile failed.\n${builtText}`);
  }
  console.log(builtText);
  if (!existsSync(path.join(DRAFT_DIR, 'draft_content.json'))) {
    die(`compile reported ok but draft_content.json is missing in ${DRAFT_DIR}`);
  }
}

function renderProxy(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const result = capcut([
    'render',
    DRAFT_DIR,
    '--out',
    PROXY_MP4,
    '--scale',
    '1',
    '--fps',
    '30',
    '--all-video-tracks',
  ]);
  const text = `${result.stdout}\n${result.stderr}`.trim();
  if (result.status !== 0) {
    die(`capcut-cli render failed.\n${text}`);
  }
  console.log(text);
  if (!existsSync(PROXY_MP4)) {
    die(`render reported ok but missing ${PROXY_MP4}`);
  }
}

function renderPlates(): void {
  mkdirSync(PLATES_DIR, { recursive: true });
  for (const plate of PLATES) {
    const out = path.join(PLATES_DIR, plate.file);
    const args = [
      PLATE_SWIFT,
      '--text',
      plate.text,
      '--out',
      out,
      '--width',
      '1080',
      '--height',
      '1920',
    ];
    // No --badge: founder keeps Coupang disclosure off the picture.
    const result = run('swift', args);
    if (result.status !== 0 || !existsSync(out)) {
      die(
        `caption plate failed (${plate.file}).\n${result.stdout}\n${result.stderr}`,
      );
    }
  }
}

function burnPlates(): void {
  const args = ['-y', '-i', PROXY_MP4];
  for (const plate of PLATES) {
    args.push('-i', path.join(PLATES_DIR, plate.file));
  }

  const chain: string[] = [];
  let last = '[0:v]';
  PLATES.forEach((plate, i) => {
    const next = i === PLATES.length - 1 ? '[vout]' : `[v${i + 1}]`;
    chain.push(
      `${last}[${i + 1}:v]overlay=0:0:enable='between(t,${plate.start},${plate.end})'${next}`,
    );
    last = next;
  });

  args.push(
    '-filter_complex',
    chain.join(';'),
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
    '-movflags',
    '+faststart',
    FINAL_MP4,
  );

  const result = run('ffmpeg', args);
  if (result.status !== 0 || !existsSync(FINAL_MP4)) {
    die(`ffmpeg caption overlay failed.\n${result.stdout}\n${result.stderr}`);
  }
}

function probeDuration(file: string): string {
  const result = run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    file,
  ]);
  return (result.stdout || '').trim() || 'unknown';
}

function writeSidecar(): void {
  const sidecar = {
    output: FINAL_MP4,
    durationSec: Number(probeDuration(FINAL_MP4)),
    draft: DRAFT_DIR,
    spec: SPEC_PATH,
    capcutCli: 'npx capcut-cli@0.19.x (unofficial; not ByteDance)',
    notes: [
      'Proxy encode — not CapCut app export.',
      'ffmpeg drawtext=false on this Mac; captions are PNG overlay.',
      'No on-screen [광고]; Coupang disclosure is description/pinned comment only.',
      'No Typecast VO muxed — founder re-exports a faster take separately.',
    ],
  };
  writeFileSync(
    path.join(OUT_DIR, 'ep1-arm-nb-f80.json'),
    `${JSON.stringify(sidecar, null, 2)}\n`,
  );
}

function main(): void {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  requireBin('ffmpeg');
  requireBin('ffprobe');
  requireBin('swift');
  ensureInputs();
  void readFileSync(SPEC_PATH, 'utf8');

  console.log('== capcut-cli doctor ==');
  doctor();

  console.log('== compile draft ==');
  compileDraft();

  console.log('== render proxy (scale 1, all video tracks) ==');
  renderProxy();

  console.log('== Korean caption plates + overlay ==');
  renderPlates();
  burnPlates();
  writeSidecar();

  const duration = probeDuration(FINAL_MP4);
  console.log(`\nOK  ${FINAL_MP4}`);
  console.log(`    duration ${duration}s`);
  console.log(`    draft    ${DRAFT_DIR}`);
}

main();
