/**
 * Operator script — Typecast API TTS for desk short-form VO.
 *
 * Not part of `pnpm build`. Missing TYPECAST_API_KEY exits with a message
 * and does not affect the Next.js app.
 *
 * Official REST only:
 *   POST https://api.typecast.ai/v1/text-to-speech
 *   GET  https://api.typecast.ai/v1/users/me/subscription
 *   GET  https://api.typecast.ai/v2/voices
 * Auth header: X-API-KEY (documented). Do not invent endpoints.
 *
 * Studio Basic / Pro / Business is a *web* plan. It does not include API
 * access. API plans are separate (Free 30k credits / Lite / Plus):
 *   https://typecast.ai/pricing/api/
 * Console (sign-in): https://studio.typecast.ai/developers/api
 *
 * Usage (repo root):
 *   pnpm desk:typecast-tts
 *   pnpm desk:typecast-tts -- --plan
 *   pnpm desk:typecast-tts -- --list-voices
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const API_BASE = 'https://api.typecast.ai';
const TTS_URL = `${API_BASE}/v1/text-to-speech`;
const PLAN_URL = `${API_BASE}/v1/users/me/subscription`;
const VOICES_URL = `${API_BASE}/v2/voices`;
const OUTPUT_WAV = path.resolve(
  process.cwd(),
  'tmp/desk-stock/vo/ep1-arm-nb-f80.api.wav',
);

/** Downloaded Typecast Studio SRT for ep1 (one continuous take). */
const EP1_SCRIPT = [
  '고개 앞으로 나감.',
  '오후엔 목부터.',
  '높이만 맞추면 됨.',
  '링크는 프로필에 있어요.',
].join(' ');

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

function printHelp(): void {
  console.log(`Typecast API TTS (operator).

  pnpm desk:typecast-tts
  pnpm desk:typecast-tts -- --plan
  pnpm desk:typecast-tts -- --list-voices

Requires TYPECAST_API_KEY and TYPECAST_VOICE_ID in .env.local.
Studio web Basic does not grant API access — see https://typecast.ai/pricing/api/
Writes tmp/desk-stock/vo/ep1-arm-nb-f80.api.wav (gitignored).`);
}

function missingKeyMessage(): string {
  return `Missing TYPECAST_API_KEY.

This operator script calls the official Typecast TTS API. It is not part of
the Next.js build — the app starts without it.

Studio Basic/Pro/Business (web) and Typecast API plans are billed separately.
A web Basic subscription does not include an API key.

1. Open the API console (sign-in): https://studio.typecast.ai/developers/api
2. Subscribe to an API plan if needed: https://typecast.ai/pricing/api/
   (Free tier is 30k credits/month — not the Studio Basic plan.)
3. Add to .env.local only (never commit, never paste in chat):
   TYPECAST_API_KEY=
   TYPECAST_VOICE_ID=
4. Voice IDs: pnpm desk:typecast-tts -- --list-voices
   or https://studio.typecast.ai/developers/api/voices
5. Re-run: pnpm desk:typecast-tts

Until then, mux the Studio-exported wav already in tmp/desk-stock/vo/.`;
}

function parseArgs(argv: string[]): { plan: boolean; listVoices: boolean } {
  let plan = false;
  let listVoices = false;
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg === '--plan') {
      plan = true;
    } else if (arg === '--list-voices') {
      listVoices = true;
    }
  }
  return { plan, listVoices };
}

function apiHeaders(apiKey: string): Record<string, string> {
  return {
    'X-API-KEY': apiKey,
    Accept: 'application/json',
  };
}

function explainHttp(status: number, body: string): string {
  const trimmed = body.trim().slice(0, 400);
  if (status === 401) {
    return `401 invalid/missing API key. Studio web login is not enough — create a key at https://studio.typecast.ai/developers/api`;
  }
  if (status === 402) {
    return `402 insufficient API credits. Check https://typecast.ai/pricing/api/`;
  }
  if (status === 403) {
    return `403 forbidden. Common causes (official docs): web-plan credentials used as an API key, legacy Starter key, dormant account, or a copied key with whitespace. Studio Basic does not grant API access.`;
  }
  return `${status}${trimmed ? `: ${trimmed}` : ''}`;
}

async function readErrorBody(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

async function checkPlan(apiKey: string): Promise<void> {
  const res = await fetch(PLAN_URL, { headers: apiHeaders(apiKey) });
  if (!res.ok) {
    throw new Error(explainHttp(res.status, await readErrorBody(res)));
  }
  const json: unknown = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

async function listVoices(apiKey: string): Promise<void> {
  const url = new URL(VOICES_URL);
  url.searchParams.set('model', 'ssfm-v30');
  const res = await fetch(url, { headers: apiHeaders(apiKey) });
  if (!res.ok) {
    throw new Error(explainHttp(res.status, await readErrorBody(res)));
  }
  const json: unknown = await res.json();
  const rows = Array.isArray(json)
    ? json
    : json && typeof json === 'object' && 'voices' in json
      ? (json as { voices: unknown }).voices
      : null;
  if (!Array.isArray(rows)) {
    console.log(JSON.stringify(json, null, 2));
    return;
  }
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const rec = row as Record<string, unknown>;
    const id = typeof rec.voice_id === 'string' ? rec.voice_id : '';
    const name = typeof rec.voice_name === 'string' ? rec.voice_name : '';
    if (id) console.log(`${id}\t${name}`);
  }
}

async function synthesize(apiKey: string, voiceId: string): Promise<void> {
  const res = await fetch(TTS_URL, {
    method: 'POST',
    headers: {
      ...apiHeaders(apiKey),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: EP1_SCRIPT,
      model: 'ssfm-v30',
      voice_id: voiceId,
      language: 'kor',
      prompt: { emotion_type: 'smart' },
      output: { audio_format: 'wav' },
    }),
  });
  if (!res.ok) {
    throw new Error(explainHttp(res.status, await readErrorBody(res)));
  }
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(path.dirname(OUTPUT_WAV), { recursive: true });
  writeFileSync(OUTPUT_WAV, buf);
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_WAV)} (${buf.length} bytes)`);
  console.log('Does not overwrite the Studio-exported ep1-arm-nb-f80.wav.');
}

async function main(): Promise<void> {
  loadDotEnvLocal();
  const { plan, listVoices: list } = parseArgs(process.argv.slice(2));
  const apiKey = process.env.TYPECAST_API_KEY?.trim();
  if (!apiKey) {
    console.error(missingKeyMessage());
    process.exit(1);
  }

  if (plan) {
    await checkPlan(apiKey);
    return;
  }
  if (list) {
    await listVoices(apiKey);
    return;
  }

  const voiceId = process.env.TYPECAST_VOICE_ID?.trim();
  if (!voiceId) {
    console.error(`Missing TYPECAST_VOICE_ID.

Pick a voice from the API library (sign-in):
  https://studio.typecast.ai/developers/api/voices
or: pnpm desk:typecast-tts -- --list-voices
then add TYPECAST_VOICE_ID=tc_... to .env.local.`);
    process.exit(1);
  }

  await synthesize(apiKey, voiceId);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
