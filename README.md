# H Heuristics — explainer platform

A static publishing site for H Heuristics explainers. Each article is one Markdown/MDX file;
push it to GitHub and Cloudflare rebuilds and publishes the site.

Built with [Astro](https://astro.build) (static output), full-text search by
[Pagefind](https://pagefind.app), and server-rendered, JavaScript-free charts.

---

## Publishing a new article

```bash
npm run new -- "Why heat is a labour-market problem" --topic climate-energy
```

This creates `src/content/articles/why-heat-is-a-labour-market-problem.mdx` as a **draft**.

1. Write the piece (see the frontmatter reference below).
2. Preview it locally with `npm run dev` → http://localhost:4321 (drafts are visible locally).
3. When ready, set `draft: false`, then commit and push:

```bash
git add -A && git commit -m "Publish: Why heat is a labour-market problem" && git push
```

Cloudflare rebuilds automatically; the article goes live in about a minute.

The URL is the file name: `src/content/articles/my-slug.mdx` → `/articles/my-slug/`.
Don't rename files after publishing, or the old links will break.

### Frontmatter reference

```yaml
---
title: "Headline"                       # required
dek: "One- or two-sentence standfirst." # required, shown under the headline and in previews
kicker: "Cooling access"                # optional label above the headline
topic: climate-energy                   # required, one of the ids in src/site.config.ts
tags: [heat, cooling]                   # optional
date: 2026-11-05                        # required, publication date
updated: 2026-12-01                     # optional, shows "Updated …"
author: "Hunter Hughes"                 # optional, defaults to Hunter Hughes
featured: true                          # optional, pins the piece to the home-page lead slot
draft: false                            # drafts never ship to production
takeaways:                              # optional "In brief" box (basic HTML allowed)
  - "First point."
sources:                                # optional numbered source list
  - title: "Report title"
    publisher: "Publisher"
    year: 2025
    url: "https://…"
---
```

**Issue numbers** (`No. 001`, `No. 002`…) are assigned automatically in date order.
Giving a new article an earlier date than existing ones will renumber the later pieces.
When publishing twice on the same day, give the later one a time (`date: 2026-11-05T18:00:00Z`)
so it sorts after the first instead of tying on file name.

### Two page formats: articles and guides

Every page is either an **article** (long-form, narrative; the default) or a **guide**
(a scannable reference page). Set it in the frontmatter:

```yaml
format: guide          # omit for a normal article
stats:                 # optional "at a glance" number strip (up to 4)
  - value: "1999"
    label: "Year the term was coined"
```

Guides use a wider layout, a "Jump to" bar built from your `##` headings, no drop cap, and show
"Quick reference" instead of a reading time. They share numbering, the archive, topics, search
and RSS with articles, and are tagged "Guide" in lists. Search has a Format filter.
The draft `src/content/articles/polycrisis-field-guide.mdx` shows the format in use.

Guide-friendly components (all take plain data, no imports):

| Component | Use |
| --- | --- |
| `<Cards cols={3} tone="tint" items={[{label, title, text}]} />` | Grid of short cards: options, mechanisms, steps |
| `<Timeline items={[{when, title, text}]} />` | Vertical timeline |
| `<FAQ items={[{q, a}]} />` | Expandable questions and answers |
| `<Glossary items={[{term, def}]} />` | Alphabetical two-column term list |

Text fields in these accept basic HTML (`<strong>`, `<em>`, `<a href>`).

### Components available in any `.mdx` article

No imports needed. The draft article `src/content/articles/style-guide.mdx` shows every one
of them rendered. Run `npm run dev` and open `/articles/style-guide/`.

| Component | Use |
| --- | --- |
| `<BarChart data={[{label, value}]} highlight={[…]} unit="%" />` | Ranked horizontal bars |
| `<LineChart x={[…]} series={[{name, values}]} />` | Time series; add `kind="column"` for columns |
| `<KeyStats items={[{value, label, note}]} />` | Row of headline numbers |
| `<Callout type="definition" title="…">…</Callout>` | `note`, `definition`, `method`, `implication` |
| `<PullQuote cite="…">…</PullQuote>` | Large pull quote |
| `<Figure src="/images/x.png" alt="…" title="…" source="…" />` | Image in the house chart frame |

Every chart takes `title`, `subtitle`, `source`, `note`, `label` and `wide`.
Put images in `public/images/`.

Plain Markdown (headings, lists, tables, blockquotes, footnotes) is styled automatically.
`##` headings become the article's contents sidebar.

---

## Site settings

- **Brand, navigation, topics:** `src/site.config.ts`
- **Colours and typography:** `src/styles/global.css` (tokens at the top) and `src/styles/prose.css`
- **Logo:** `src/components/Logo.astro` and `public/favicon.svg`

---

## Deploying on Cloudflare

### Option A: Cloudflare Pages (simplest)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Choose the `Informative-webpage-platform` repository, production branch `main`.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Environment variables (Production and Preview):
   - `NODE_VERSION` = `24`
   - `SITE_URL` = your final URL, `https://explainers.hheuristics.com` (the default in `astro.config.mjs`; used for canonical links, RSS and the sitemap)
5. **Save and Deploy.** Add a custom domain under the project's **Custom domains** tab.

### Option B: Cloudflare Workers (static assets)

`wrangler.jsonc` is already configured. In the dashboard, **Create** → **Workers** →
**Import a repository**, set build command `npm run build` and deploy command
`npx wrangler deploy`, and add the same `SITE_URL` variable.

`public/_headers` sets long-lived caching for hashed assets and basic security headers on both options.

---

## Local commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server with drafts at http://localhost:4321 |
| `npm run build` | Build the production site to `dist/` and the search index |
| `npm run preview` | Serve the production build locally (search works here) |
| `npm run new -- "Title" --topic <id>` | Create a new draft article |
