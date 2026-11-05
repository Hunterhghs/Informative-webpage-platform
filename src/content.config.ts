import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOPICS } from './site.config';

const topicIds = TOPICS.map((t) => t.id) as [string, ...string[]];

const articles = defineCollection({
  // Every .md / .mdx file in src/content/articles becomes /articles/<filename>/
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    /** One- or two-sentence standfirst shown under the headline. */
    dek: z.string(),
    /** Short label above the headline, e.g. "Cooling access". Defaults to the topic name. */
    kicker: z.string().optional(),
    /**
     * "article" = long-form explainer (default).
     * "guide"   = scannable reference page: wider layout, jump-to bar, key-number strip,
     *             and cards / timeline / FAQ / glossary components.
     */
    format: z.enum(['article', 'guide']).default('article'),
    topic: z.enum(topicIds),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Hunter Hughes'),
    /** Optional "at a glance" number strip under the headline (up to 4). */
    stats: z
      .array(z.object({ value: z.string(), label: z.string(), note: z.string().optional() }))
      .max(4)
      .default([]),
    /** Bullet points for the "In brief" box at the top of the article. */
    takeaways: z.array(z.string()).default([]),
    sources: z
      .array(
        z.object({
          title: z.string(),
          publisher: z.string().optional(),
          year: z.union([z.string(), z.number()]).optional(),
          url: z.string().url().optional(),
        }),
      )
      .default([]),
    /** Pin to the lead slot on the home page (most recent featured wins). */
    featured: z.boolean().default(false),
    /** Drafts are visible in `npm run dev` but never published. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
