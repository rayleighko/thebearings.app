import fs from 'node:fs';
import path from 'node:path';

export type DeskBlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
};

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;

export function deskBlogDir(cwd = process.cwd()): string {
  return path.join(cwd, 'content/desk/blog');
}

export function parseDeskBlogMarkdown(raw: string): DeskBlogPost {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error('desk blog post is missing YAML frontmatter');
  }
  const fields: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  const { slug, title, description, date } = fields;
  if (!slug || !title || !description || !date) {
    throw new Error('desk blog post frontmatter needs slug, title, description, date');
  }
  return {
    slug,
    title,
    description,
    date,
    body: match[2].trim(),
  };
}

export function listDeskBlogPosts(cwd = process.cwd()): DeskBlogPost[] {
  const dir = deskBlogDir(cwd);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => parseDeskBlogMarkdown(fs.readFileSync(path.join(dir, name), 'utf8')))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getDeskBlogPost(
  slug: string,
  cwd = process.cwd(),
): DeskBlogPost | undefined {
  return listDeskBlogPosts(cwd).find((post) => post.slug === slug);
}
