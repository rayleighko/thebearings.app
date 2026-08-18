/**
 * Operator script — licensed Pexels Videos search + local cache.
 *
 * Not part of `pnpm build`. Missing PEXELS_API_KEY exits with a message
 * and does not affect the Next.js app.
 *
 * Official API only. No Xiaohongshu / Douyin / Instagram / TikTok / Coupang
 * scrapers. No watermark stripping. No unsigned downloads.
 *
 * Usage (repo root):
 *   pnpm desk:fetch-stock
 *   pnpm desk:fetch-stock -- --no-download
 *   pnpm desk:fetch-stock -- --sku=arm-nb-f80
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { getConcept } from '../../src/data/concepts';
import {
  DEV_STOCK_CONCEPT,
  queriesForSku,
} from '../../src/data/desk-stock-queries';

const PEXELS_SEARCH = 'https://api.pexels.com/v1/videos/search';
const PEXELS_HOME = 'https://www.pexels.com';
const OUTPUT_ROOT = path.resolve(process.cwd(), 'tmp/desk-stock');
const CACHE_DIR = path.join(OUTPUT_ROOT, 'cache');
const CLIPS_DIR = path.join(OUTPUT_ROOT, 'clips');
const MANIFEST_PATH = path.join(OUTPUT_ROOT, 'manifest.json');
const REQUEST_GAP_MS = 800;
const MAX_CLIPS_PER_SKU = 8;
const SEARCH_PER_PAGE = 8;
const USER_AGENT = 'thebearings-desk-stock/1.0 (operator; licensed Pexels cache)';

type VideoFile = {
  id: number;
  quality: string;
  file_type: string;
  width?: number;
  height?: number;
  link: string;
};

type PexelsVideo = {
  id: number;
  width: number;
  height: number;
  url: string;
  duration: number;
  image?: string;
  user?: { id?: number; name?: string; url?: string };
  video_files?: VideoFile[];
};

type SearchResponse = {
  page?: number;
  per_page?: number;
  total_results?: number;
  videos?: PexelsVideo[];
};

type ManifestVideo = {
  pexelsId: number;
  query: string;
  photographer: string;
  photographerUrl: string;
  pexelsUrl: string;
  attribution: string;
  durationSec: number;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
  previewFile: string | null;
};

type ManifestItem = {
  sku: string;
  name: string;
  queries: string[];
  videos: ManifestVideo[];
};

type Manifest = {
  generatedAt: string;
  source: 'pexels';
  licenseNote: string;
  items: ManifestItem[];
};

function loadDotEnvLocal(): void {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;
  for (const raw of readFileSync(envPath, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(argv: string[]): { sku?: string; download: boolean } {
  let sku: string | undefined;
  let download = true;
  for (const arg of argv) {
    if (arg === '--no-download') {
      download = false;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith('--sku=')) {
      sku = arg.slice('--sku='.length).trim() || undefined;
    }
  }
  return { sku, download };
}

function printHelp(): void {
  console.log(`Licensed Pexels stock fetch (operator).

  pnpm desk:fetch-stock
  pnpm desk:fetch-stock -- --no-download
  pnpm desk:fetch-stock -- --sku=arm-nb-f80

Requires PEXELS_API_KEY in .env.local. Not used by the Next.js build.
Writes tmp/desk-stock/ (gitignored).`);
}

function missingKeyMessage(): string {
  return `Missing PEXELS_API_KEY.

This operator script searches the official Pexels Videos API for licensed
desk B-roll. It is not part of the Next.js build — the app starts without it.

1. Create a free key: https://www.pexels.com/api/
2. Add to .env.local only (never commit):
   PEXELS_API_KEY=your_key_here
3. Re-run: pnpm desk:fetch-stock`;
}

function slugifyQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function cachePath(sku: string, query: string): string {
  return path.join(CACHE_DIR, `${sku}__${slugifyQuery(query)}.json`);
}

function orientationOf(width: number, height: number): ManifestVideo['orientation'] {
  if (height > width) return 'portrait';
  if (width > height) return 'landscape';
  return 'square';
}

function attributionFor(video: PexelsVideo): string {
  const name = video.user?.name?.trim() || 'a Pexels contributor';
  return `Video by ${name} on Pexels`;
}

function isBodyQuery(query: string): boolean {
  return /neck|posture|stretch|looking down|rubbing|eye level|upright|head/i.test(
    query,
  );
}

function isEastAsianQuery(query: string): boolean {
  return /asian|east asian/i.test(query);
}

function scoreVideo(video: PexelsVideo, query: string): number {
  let score = 0;
  if (video.height > video.width) score += 3;
  if (video.duration >= 4 && video.duration <= 25) score += 2;
  else if (video.duration > 0 && video.duration < 45) score += 1;
  // Prefer interoception / posture hits over pretty-desk B-roll.
  if (isBodyQuery(query)) score += 4;
  // Founder: Western office B-roll reads off for a Korean audience.
  // Still licensed Pexels only — query bias, not a scrape of CN apps.
  if (isEastAsianQuery(query)) score += 3;
  return score;
}

function pickPreviewFile(files: VideoFile[] | undefined): VideoFile | undefined {
  const mp4 = (files ?? []).filter(
    (file) => file.file_type === 'video/mp4' && Boolean(file.link),
  );
  if (mp4.length === 0) return undefined;

  const sd = mp4
    .filter((file) => file.quality === 'sd')
    .sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  const usableSd = sd.find((file) => (file.width ?? 0) >= 480) ?? sd[0];
  if (usableSd) return usableSd;

  const hd = mp4
    .filter((file) => file.quality === 'hd')
    .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))[0];
  if (hd) return hd;

  // Newer Pexels files often have quality: null — pick a mid-size mp4.
  const byWidth = [...mp4].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  return (
    byWidth.find((file) => (file.width ?? 0) >= 540 && (file.width ?? 0) <= 1280) ??
    byWidth[byWidth.length - 1]
  );
}

async function pexelsGet(
  url: string,
  apiKey: string,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: apiKey,
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
      ...init?.headers,
    },
  });
  return response;
}

async function searchPexels(
  apiKey: string,
  query: string,
  sku: string,
): Promise<SearchResponse> {
  const file = cachePath(sku, query);
  if (existsSync(file)) {
    return JSON.parse(readFileSync(file, 'utf8')) as SearchResponse;
  }

  const url = new URL(PEXELS_SEARCH);
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(SEARCH_PER_PAGE));
  url.searchParams.set('page', '1');

  await sleep(REQUEST_GAP_MS);
  const response = await pexelsGet(url.toString(), apiKey);
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('retry-after') ?? '5');
    console.warn(`Pexels 429 — waiting ${retryAfter}s then retrying once.`);
    await sleep(Math.max(retryAfter, 1) * 1000);
    const retry = await pexelsGet(url.toString(), apiKey);
    if (!retry.ok) {
      throw new Error(`Pexels search failed after retry: HTTP ${retry.status}`);
    }
    const payload = (await retry.json()) as SearchResponse;
    writeFileSync(file, JSON.stringify(payload, null, 2));
    return payload;
  }
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pexels search failed: HTTP ${response.status} ${body.slice(0, 200)}`);
  }

  const payload = (await response.json()) as SearchResponse;
  writeFileSync(file, JSON.stringify(payload, null, 2));
  const remaining = response.headers.get('x-ratelimit-remaining');
  if (remaining) {
    console.log(`  cache miss "${query}" (remaining this month: ${remaining})`);
  } else {
    console.log(`  cache miss "${query}"`);
  }
  return payload;
}

async function downloadPreview(
  file: VideoFile,
  dest: string,
  apiKey: string,
): Promise<void> {
  if (existsSync(dest)) return;
  await sleep(REQUEST_GAP_MS);
  const response = await fetch(file.link, {
    headers: {
      Authorization: apiKey,
      'User-Agent': USER_AGENT,
    },
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(`Download failed HTTP ${response.status} → ${dest}`);
  }
  writeFileSync(dest, Buffer.from(await response.arrayBuffer()));
}

function printMissingKeyAndExit(): never {
  console.error(missingKeyMessage());
  process.exit(2);
}

async function main(): Promise<void> {
  loadDotEnvLocal();
  const { sku: skuFilter, download } = parseArgs(process.argv.slice(2));
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) {
    printMissingKeyAndExit();
  }

  const concept = getConcept(DEV_STOCK_CONCEPT);
  if (!concept) {
    throw new Error(`Published concept "${DEV_STOCK_CONCEPT}" is missing.`);
  }

  const items = concept.items.filter((item) =>
    skuFilter ? item.slug === skuFilter : true,
  );
  if (skuFilter && items.length === 0) {
    throw new Error(`Unknown SKU "${skuFilter}". Check src/data/concepts.ts`);
  }

  mkdirSync(CACHE_DIR, { recursive: true });
  mkdirSync(CLIPS_DIR, { recursive: true });

  console.log('Licensed Pexels stock fetch (operator). No scrape. No watermark strip.');
  console.log(`Output: ${OUTPUT_ROOT}`);
  console.log(`Clips: ${download ? `up to ${MAX_CLIPS_PER_SKU} preview(s) per SKU` : 'skipped (--no-download)'}`);
  console.log(`Videos provided by Pexels (${PEXELS_HOME})\n`);

  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    source: 'pexels',
    licenseNote:
      'Pexels license + credit photographer when possible. Link to Pexels. See https://www.pexels.com/api/documentation/#guidelines',
    items: [],
  };

  for (const item of items) {
    const queries = queriesForSku(item.slug);
    if (!queries?.length) {
      console.warn(`Skipping ${item.slug}: no stock queries mapped.`);
      continue;
    }

    console.log(`→ ${item.slug} (${item.name})`);
    const seen = new Set<number>();
    const ranked: { video: PexelsVideo; query: string }[] = [];

    for (const query of queries) {
      const cached = existsSync(cachePath(item.slug, query));
      if (cached) {
        console.log(`  cache hit  "${query}"`);
      }
      const result = await searchPexels(apiKey, query, item.slug);
      for (const video of result.videos ?? []) {
        if (seen.has(video.id)) continue;
        seen.add(video.id);
        ranked.push({ video, query });
      }
    }

    ranked.sort(
      (a, b) => scoreVideo(b.video, b.query) - scoreVideo(a.video, a.query),
    );
    const chosen = ranked.slice(0, MAX_CLIPS_PER_SKU);
    const videos: ManifestVideo[] = [];

    for (const { video, query } of chosen) {
      const photographer = video.user?.name?.trim() || 'unknown';
      const photographerUrl = video.user?.url ?? PEXELS_HOME;
      const entry: ManifestVideo = {
        pexelsId: video.id,
        query,
        photographer,
        photographerUrl,
        pexelsUrl: video.url,
        attribution: attributionFor(video),
        durationSec: video.duration,
        width: video.width,
        height: video.height,
        orientation: orientationOf(video.width, video.height),
        previewFile: null,
      };

      if (download) {
        const preview = pickPreviewFile(video.video_files);
        if (!preview) {
          console.warn(`  no mp4 for Pexels ${video.id}`);
        } else {
          const dest = path.join(CLIPS_DIR, `${item.slug}-${video.id}.mp4`);
          try {
            await downloadPreview(preview, dest, apiKey);
            entry.previewFile = path.relative(OUTPUT_ROOT, dest);
            console.log(`  saved ${entry.previewFile} (${entry.orientation}, ${video.duration}s)`);
          } catch (err) {
            console.warn(
              `  download skipped for ${video.id}: ${err instanceof Error ? err.message : err}`,
            );
          }
        }
      }

      videos.push(entry);
      console.log(`  ${entry.attribution} — ${entry.pexelsUrl}`);
    }

    if (chosen.length === 0) {
      console.warn(`  no Pexels hits for ${item.slug}`);
    }

    manifest.items.push({
      sku: item.slug,
      name: item.name,
      queries: [...queries],
      videos,
    });
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest: ${path.relative(process.cwd(), MANIFEST_PATH)}`);
  console.log('\n=== Attribution (include in descriptions) ===');
  for (const item of manifest.items) {
    for (const video of item.videos) {
      console.log(`${item.sku}\t${video.attribution}\t${video.pexelsUrl}`);
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
