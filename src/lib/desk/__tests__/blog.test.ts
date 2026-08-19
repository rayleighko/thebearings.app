import { describe, expect, it } from 'vitest';
import { getDeskBlogPost, listDeskBlogPosts, parseDeskBlogMarkdown } from '@/lib/desk/blog';

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
    });
  });

  it('loads the shipped stub post', () => {
    const posts = listDeskBlogPosts();
    expect(posts.some((post) => post.slug === 'preparing')).toBe(true);
    expect(getDeskBlogPost('preparing')?.title).toBe('이 블로그는 준비 중');
    expect(getDeskBlogPost('preparing')?.body).not.toContain('추천');
    expect(getDeskBlogPost('missing')).toBeUndefined();
  });
});
