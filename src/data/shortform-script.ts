import { z } from 'zod';

export const SHORTFORM_VO_GENDERS = ['female', 'male'] as const;
export const SHORTFORM_PICTURE_GENDERS = ['female', 'male'] as const;

export const shortformScriptSchema = z.object({
  episode: z.number().int().positive(),
  sku: z.string().min(1),
  title: z.string().min(1).max(40),
  durationSec: z.number().min(8).max(12),
  vo: z.object({
    gender: z.enum(SHORTFORM_VO_GENDERS),
    actor: z.literal('예슬'),
    language: z.literal('kor'),
    speed: z.literal(1),
    emotion: z.literal('normal'),
    pauseSec: z.literal(0.2),
    register: z.literal('해요체'),
    lines: z.array(z.string().min(1)).length(4),
  }),
  picture: z.object({
    hookGender: z.enum(SHORTFORM_PICTURE_GENDERS),
    productFromSec: z.number().min(2).max(8),
    notes: z.string().min(1),
  }),
  youtube: z.object({
    title: z.string().min(1).max(100),
    /** One line after `[광고]`. No raw pause tags. */
    descriptionLead: z.string().min(1).max(80),
    productUrl: z
      .string()
      .regex(/^https:\/\/link\.coupang\.com\//, 'YouTube CTA must be a Coupang deeplink'),
    tags: z.array(z.string().min(1)).min(4).max(12),
    hashtags: z.array(z.string().regex(/^#[^\s#]+$/)).min(3).max(6),
    category: z.literal('노하우 및 스타일'),
    language: z.literal('한국어'),
    playlist: z.literal('데스크'),
    madeForKids: z.literal(false),
    paidPromotion: z.literal(true),
    comments: z.literal('on'),
    showLikeCount: z.literal(true),
    thumbnail: z.literal('from-video'),
  }),
});

export type ShortformScript = z.infer<typeof shortformScriptSchema>;

export function parseShortformScript(raw: unknown): ShortformScript {
  return shortformScriptSchema.parse(raw);
}

/** Four lines only — paste into the Typecast editor. No pause tags. */
export function formatTypecastPaste(script: ShortformScript): string {
  return script.vo.lines.join('\n');
}

/** Operator settings. Do not paste this block into the script field. */
export function formatTypecastStudioSettings(script: ShortformScript): string {
  const genderKo = script.vo.gender === 'female' ? '여성' : '남성';
  const hookKo = script.picture.hookGender === 'female' ? '여성' : '남성';
  return [
    `배우: ${script.vo.actor} (${genderKo})`,
    `감정: 일반`,
    `배속: ${script.vo.speed.toFixed(1)}`,
    `쉼: 문장마다 스튜디오 [0.2s 추가] — 대본에 쓰지 말 것`,
    `화면 첫 인물: ${hookKo}`,
  ].join('\n');
}

export function formatTypecastStudioBlock(script: ShortformScript): string {
  return `${formatTypecastStudioSettings(script)}\n\n${formatTypecastPaste(script)}`;
}

export function formatYoutubeDescription(script: ShortformScript): string {
  return [
    `[광고] ${script.youtube.descriptionLead}`,
    '',
    '링크는 여기',
    script.youtube.productUrl,
    '',
    script.youtube.hashtags.join(' '),
  ].join('\n');
}

/** Shorts comments stay on. Do not pin — a pin is not a hook. */
export function formatYoutubePinnedComment(_script: ShortformScript): string {
  return '하지 말 것 (댓글은 켜 둠)';
}

/** YouTube Studio paste — title, description, tags, locked toggles. */
export function formatYoutubeUploadBlock(script: ShortformScript): string {
  const yt = script.youtube;
  return [
    `제목: ${yt.title}`,
    '',
    '설명:',
    formatYoutubeDescription(script),
    '',
    `태그: ${yt.tags.join(', ')}`,
    `카테고리: ${yt.category}`,
    `언어: ${yt.language}`,
    `재생목록: ${yt.playlist}`,
    `시청자: ${yt.madeForKids ? '아동용' : '아동용 아님'}`,
    `유료 광고 포함: ${yt.paidPromotion ? '켜기' : '끄기'}`,
    `댓글: ${yt.comments === 'on' ? '켜짐 / 모든 사용자' : '끄기'}`,
    `좋아요 수 표시: ${yt.showLikeCount ? '켜기' : '끄기'}`,
    `썸네일: 동영상에서 선택`,
    '',
    '고정 댓글:',
    formatYoutubePinnedComment(script),
  ].join('\n');
}
