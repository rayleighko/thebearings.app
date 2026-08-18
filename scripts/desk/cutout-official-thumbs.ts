/**
 * Operator script — background-remove official Coupang CDN thumbnails.
 *
 * Crop / resize / rembg only. Does not reshape the product. Does not call
 * image-generation APIs. Does not open affiliate `link.coupang.com` URLs.
 *
 * Not part of `pnpm build`.
 *
 * Usage (repo root):
 *   pnpm desk:cutout-thumbs
 *   pnpm desk:cutout-thumbs -- --sku=arm-nb-f80
 *   pnpm desk:cutout-thumbs -- --no-update-concepts
 */

import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { DEV_OFFICIAL_CDN_THUMBS, getConcept } from '../../src/data/concepts';

const CONCEPT_SLUG = 'dev';
const CDN_HOSTS = new Set(['thumbnail.coupangcdn.com', 'image.coupangcdn.com']);
const AFFILIATE_HOST = 'link.coupang.com';
const TARGET_WIDTH = 800;
const OUTPUT_PUBLIC = path.resolve(process.cwd(), 'public/desk/dev');
const WORK_ROOT = path.resolve(process.cwd(), 'tmp/desk-cutout');
const SRC_DIR = path.join(WORK_ROOT, 'src');
const ALPHA_DIR = path.join(WORK_ROOT, 'alpha');
const CONCEPTS_PATH = path.resolve(process.cwd(), 'src/data/concepts.ts');
const USER_AGENT = 'thebearings-desk-cutout/1.0 (operator; official CDN thumbs only)';

type RembgCmd = { bin: string; prefix: string[] };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(argv: string[]): {
  sku?: string;
  updateConcepts: boolean;
} {
  let sku: string | undefined;
  let updateConcepts = true;
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg === '--no-update-concepts') {
      updateConcepts = false;
    } else if (arg.startsWith('--sku=')) {
      sku = arg.slice('--sku='.length).trim() || undefined;
    }
  }
  return { sku, updateConcepts };
}

function printHelp(): void {
  console.log(`Official Coupang CDN thumb cutouts (operator).

  pnpm desk:cutout-thumbs
  pnpm desk:cutout-thumbs -- --sku=arm-nb-f80
  pnpm desk:cutout-thumbs -- --no-update-concepts

Downloads thumbnail.coupangcdn.com URLs already in the catalog, runs local
rembg, writes public/desk/dev/{id}.png (~${TARGET_WIDTH}px wide).

Never opens link.coupang.com. Never generates a GPT product-scene composite.`);
}

function missingRembgMessage(): string {
  return `rembg is not installed (or has no ONNX backend).

Official Coupang thumbs were not cut out. This script does not invent
product pixels with GPT or any image-generation API.

Install (pick one), then re-run pnpm desk:cutout-thumbs:

  pipx install "rembg[cpu,cli]"

  uv tool install "rembg[cpu,cli]" --python 3.11

Verify:

  rembg --help
  python -m rembg --help

Then:

  rembg d u2net
  rembg i -m u2net input.jpg output.png

Need both extras: [cpu] (onnxruntime) and [cli]. Bare \`rembg\` cannot cut out.
Do not run bare \`rembg d\` — that downloads every model.`;
}

function which(bin: string): string | null {
  const result = spawnSync('which', [bin], { encoding: 'utf8' });
  const loc = result.stdout.trim();
  return result.status === 0 && loc ? loc : null;
}

function rembgLooksBroken(text: string): boolean {
  return (
    /No onnxruntime backend found/i.test(text) ||
    /CLI dependencies are not installed/i.test(text)
  );
}

function rembgWorks(bin: string, prefix: string[]): boolean {
  const result = spawnSync(bin, [...prefix, '--help'], {
    encoding: 'utf8',
    timeout: 120_000,
  });
  const text = `${result.stdout}\n${result.stderr}`;
  if (rembgLooksBroken(text)) return false;
  if (result.status !== 0) return false;
  return /usage:|rembg/i.test(text);
}

function resolveRembg(): RembgCmd | null {
  const rembgBin = which('rembg');
  if (rembgBin) return { bin: rembgBin, prefix: [] };

  const candidates: RembgCmd[] = [];
  for (const py of ['python3.11', 'python3', 'python']) {
    if (which(py)) candidates.push({ bin: py, prefix: ['-m', 'rembg'] });
  }
  const uvBin = which('uv');
  if (uvBin) {
    candidates.push({ bin: uvBin, prefix: ['tool', 'run', 'rembg'] });
  }

  for (const cmd of candidates) {
    if (rembgWorks(cmd.bin, cmd.prefix)) return cmd;
  }
  return null;
}

function isAffiliateUrl(value: string): boolean {
  try {
    return new URL(value).hostname === AFFILIATE_HOST;
  } catch {
    return value.includes(AFFILIATE_HOST);
  }
}

function isOfficialCdnThumb(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && CDN_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function preferLargerThumb(url: string): string {
  return url.replace(/\/\d+x\d+ex\//, `/${TARGET_WIDTH}x${TARGET_WIDTH}ex/`);
}

function sourceUrlFor(id: string, img: string): string | null {
  if (isAffiliateUrl(img)) return null;
  if (isOfficialCdnThumb(img)) return img;
  const stored = DEV_OFFICIAL_CDN_THUMBS[id];
  if (stored && !isAffiliateUrl(stored) && isOfficialCdnThumb(stored)) {
    return stored;
  }
  return null;
}

function assertCdnResponseUrl(finalUrl: string): void {
  if (isAffiliateUrl(finalUrl)) {
    throw new Error(`Refused affiliate redirect: ${finalUrl}`);
  }
  if (!isOfficialCdnThumb(finalUrl)) {
    throw new Error(`Refused non-CDN redirect: ${finalUrl}`);
  }
}

async function downloadCdn(url: string, dest: string): Promise<string> {
  const candidates = [preferLargerThumb(url), url].filter(
    (value, index, all) => all.indexOf(value) === index,
  );
  let lastError: Error | null = null;

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        headers: {
          Accept: 'image/*',
          'User-Agent': USER_AGENT,
        },
        redirect: 'follow',
      });
      assertCdnResponseUrl(response.url);
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status} for ${candidate}`);
        continue;
      }
      const type = response.headers.get('content-type') ?? '';
      if (type && !type.startsWith('image/')) {
        lastError = new Error(`Non-image content-type ${type}`);
        continue;
      }
      writeFileSync(dest, Buffer.from(await response.arrayBuffer()));
      return candidate;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error(`Download failed for ${url}`);
}

function runRembg(cmd: RembgCmd, input: string, output: string): void {
  const result = spawnSync(
    cmd.bin,
    [...cmd.prefix, 'i', '-m', 'u2net', input, output],
    {
      encoding: 'utf8',
      timeout: 180_000,
    },
  );
  const text = `${result.stdout}\n${result.stderr}`;
  if (rembgLooksBroken(text)) {
    throw new Error(missingRembgMessage());
  }
  if (result.status !== 0 || !existsSync(output)) {
    throw new Error(
      `rembg failed (${result.status}): ${text.slice(0, 400)}`,
    );
  }
}

function resizeToTargetWidth(input: string, output: string): void {
  const sipsBin = which('sips');
  if (sipsBin) {
    const result = spawnSync(
      sipsBin,
      ['--resampleWidth', String(TARGET_WIDTH), input, '--out', output],
      { encoding: 'utf8', timeout: 30_000 },
    );
    if (result.status !== 0 || !existsSync(output)) {
      throw new Error(`sips resize failed: ${result.stderr || result.stdout}`);
    }
    return;
  }

  writeFileSync(output, readFileSync(input));
  console.warn(
    `  sips not found — wrote rembg output as-is (no ~${TARGET_WIDTH}px resize).`,
  );
  console.warn('  Fallback: install sharp as a one-off, or use macOS sips.');
}

function pngLooksLikePng(file: string): boolean {
  const buf = readFileSync(file);
  return buf.length > 8 && buf.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
}

function patchConceptsImg(id: string, localPath: string): boolean {
  const src = readFileSync(CONCEPTS_PATH, 'utf8');
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    `(id: '${escaped}',[\\s\\S]*?img: )'[^']+'`,
  );
  if (!re.test(src)) {
    console.warn(`  could not patch concepts.ts img for ${id}`);
    return false;
  }
  writeFileSync(CONCEPTS_PATH, src.replace(re, `$1'${localPath}'`));
  return true;
}

async function main(): Promise<void> {
  const { sku: skuFilter, updateConcepts } = parseArgs(process.argv.slice(2));
  const rembg = resolveRembg();
  if (!rembg) {
    console.error(missingRembgMessage());
    process.exit(2);
  }

  const concept = getConcept(CONCEPT_SLUG);
  if (!concept) {
    throw new Error(`Published concept "${CONCEPT_SLUG}" is missing.`);
  }

  const items = concept.items.filter((item) =>
    skuFilter ? item.id === skuFilter : true,
  );
  if (skuFilter && items.length === 0) {
    throw new Error(`Unknown SKU "${skuFilter}". Check src/data/concepts.ts`);
  }

  mkdirSync(SRC_DIR, { recursive: true });
  mkdirSync(ALPHA_DIR, { recursive: true });
  mkdirSync(OUTPUT_PUBLIC, { recursive: true });

  console.log('Official Coupang CDN thumb cutouts (operator).');
  console.log('No GPT composite. No affiliate-page scrape. rembg + crop/resize only.');
  console.log(`rembg: ${rembg.bin} ${rembg.prefix.join(' ')} -m u2net`.trim());
  console.log(`Output: public/desk/dev/{id}.png (~${TARGET_WIDTH}px wide)\n`);

  const written: string[] = [];
  const patched: string[] = [];

  for (const item of items) {
    console.log(`→ ${item.id} (${item.name})`);
    const source = sourceUrlFor(item.id, item.img);
    if (!source) {
      if (isAffiliateUrl(item.img)) {
        console.warn('  skipped: affiliate link is not an image source');
      } else {
        console.warn('  skipped: no official thumbnail.coupangcdn.com URL');
      }
      continue;
    }

    const ext = path.extname(new URL(source).pathname) || '.jpg';
    const srcFile = path.join(SRC_DIR, `${item.id}${ext}`);
    const alphaFile = path.join(ALPHA_DIR, `${item.id}.png`);
    const destFile = path.join(OUTPUT_PUBLIC, `${item.id}.png`);
    const publicPath = `/desk/dev/${item.id}.png`;

    try {
      const fetched = await downloadCdn(source, srcFile);
      console.log(`  downloaded official CDN thumb`);
      if (fetched !== source) {
        console.log(`  used larger CDN size (${TARGET_WIDTH}x)`);
      }
      runRembg(rembg, srcFile, alphaFile);
      if (!pngLooksLikePng(alphaFile)) {
        throw new Error('rembg output is not a PNG');
      }
      resizeToTargetWidth(alphaFile, destFile);
      if (!pngLooksLikePng(destFile)) {
        throw new Error('resized output is not a PNG');
      }
      console.log(`  wrote ${path.relative(process.cwd(), destFile)}`);
      written.push(publicPath);

      if (updateConcepts && item.img !== publicPath) {
        if (patchConceptsImg(item.id, publicPath)) {
          patched.push(item.id);
          console.log(`  concepts.ts img → ${publicPath}`);
        }
      } else if (item.img === publicPath) {
        console.log(`  concepts.ts already points at ${publicPath}`);
      }
    } catch (err) {
      console.warn(
        `  failed: ${err instanceof Error ? err.message : err}`,
      );
    }

    await sleep(400);
  }

  console.log(`\nCutouts written: ${written.length}/${items.length}`);
  if (written.length) {
    console.log(written.map((p) => `  ${p}`).join('\n'));
  }
  if (updateConcepts) {
    console.log(`concepts.ts updated: ${patched.length} img path(s)`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
