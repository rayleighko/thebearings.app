import { describe, expect, it } from 'vitest';
import {
  getDeskBlogPost,
  listDeskBlogPosts,
  listIndexableDeskBlogPosts,
  parseDeskBlogMarkdown,
} from '@/lib/desk/blog';

const SAMPLE = `---
slug: preparing
title: 이 블로그는 준비 중
description: 준비 중 설명
date: 2026-08-19
---

첫 문단입니다.

책상은 [개발자 데스크](/dev)에서 봅니다.
`;

describe('desk blog markdown', () => {
  it('parses frontmatter used by content/desk/blog', () => {
    expect(parseDeskBlogMarkdown(SAMPLE)).toEqual({
      slug: 'preparing',
      title: '이 블로그는 준비 중',
      description: '준비 중 설명',
      date: '2026-08-19',
      body: '첫 문단입니다.\n\n책상은 [개발자 데스크](/dev)에서 봅니다.',
      indexable: true,
    });
  });

  it('loads the shipped stub post', () => {
    const posts = listDeskBlogPosts();
    expect(posts.some((post) => post.slug === 'preparing')).toBe(true);
    expect(getDeskBlogPost('preparing')?.title).toBe('이 블로그는 준비 중');
    expect(getDeskBlogPost('preparing')?.body).not.toContain('추천');
    expect(getDeskBlogPost('preparing')?.indexable).toBe(false);
    expect(listIndexableDeskBlogPosts().some((post) => post.slug === 'preparing')).toBe(
      false,
    );
    expect(getDeskBlogPost('missing')).toBeUndefined();
  });

  it('ships one indexable search post without 스크린바 H1 or 추천', () => {
    const post = getDeskBlogPost('모니터-조명-천장불');
    expect(post?.indexable).toBe(true);
    expect(post?.date).toBe('2026-08-21');
    expect(post?.title).toContain('천장 불');
    expect(post?.title).not.toContain('스크린바');
    expect(post?.description).toContain('모니터 조명');
    expect(post?.body.startsWith('[광고]')).toBe(true);
    expect(post?.body).toContain('책상 물건');
    expect(post?.body).toContain('](/)');
    expect(post?.body).not.toContain('추천');
    expect(post?.body).not.toContain('별점');
    expect(listIndexableDeskBlogPosts().some((row) => row.slug === '모니터-조명-천장불')).toBe(
      true,
    );
  });

  it('honors index: false in frontmatter', () => {
    const post = parseDeskBlogMarkdown(`---
slug: later
title: 나중에
description: 설명
date: 2026-08-19
index: false
---

본문
`);
    expect(post.indexable).toBe(false);
  });
});
