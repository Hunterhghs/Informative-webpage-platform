import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';

export type Article = CollectionEntry<'articles'> & {
  number: number;
  readingMinutes: number;
  url: string;
};

let cache: Article[] | null = null;

/** All published articles, newest first, each with a sequential issue number. */
export async function getArticles(): Promise<Article[]> {
  if (cache) return cache;
  const showDrafts = import.meta.env.DEV;
  const entries = await getCollection('articles', (e) => showDrafts || !e.data.draft);

  const oldestFirst = [...entries].sort(
    (a, b) => a.data.date.getTime() - b.data.date.getTime() || a.id.localeCompare(b.id),
  );

  const numbered = oldestFirst.map((e, i) => ({
    ...e,
    number: i + 1,
    readingMinutes: readingTime(e.body ?? ''),
    url: `/articles/${e.id}/`,
  }));

  cache = numbered.reverse();
  return cache;
}

export function readingTime(text: string): number {
  const words = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>{}[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export const issueNo = (n: number) => `No. ${String(n).padStart(3, '0')}`;

export function formatDate(d: Date, style: 'long' | 'short' = 'long'): string {
  if (style === 'short') {
    return d.toLocaleDateString(SITE.locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  const day = d.getUTCDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const month = d.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
  return `${month} ${day}${suffix} ${d.getUTCFullYear()}`;
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
