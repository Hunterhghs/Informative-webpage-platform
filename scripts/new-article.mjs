#!/usr/bin/env node
/**
 * Create a new article skeleton.
 *   npm run new -- "Why heat is a labour-market problem" --topic climate-energy
 */
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};
const topic = flag('topic');
const title = args.join(' ').trim();

const config = readFileSync(join(root, 'src/site.config.ts'), 'utf8');
const topics = [...config.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);

if (!title) {
  console.error('Usage: npm run new -- "Article title" --topic <topic-id>');
  console.error(`Topics: ${topics.join(', ')}`);
  process.exit(1);
}
if (topic && !topics.includes(topic)) {
  console.error(`Unknown topic "${topic}". Choose one of: ${topics.join(', ')}`);
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 80);
const file = join(root, 'src/content/articles', `${slug}.mdx`);

if (existsSync(file)) {
  console.error(`Already exists: src/content/articles/${slug}.mdx`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const esc = (s) => s.replace(/"/g, '\\"');

writeFileSync(
  file,
  `---
title: "${esc(title)}"
dek: "One or two sentences that tell the reader what they will learn."
kicker: ""
topic: ${topic ?? topics[0]}
tags: []
date: ${today}
draft: true
takeaways:
  - "First key point."
  - "Second key point."
  - "Third key point."
sources:
  - title: "Source title"
    publisher: "Publisher"
    year: ${today.slice(0, 4)}
---

Opening paragraph. State the question and why it matters now.

## The situation

## Why it matters

## What the evidence says

## What it implies
`,
);

console.log(`Created src/content/articles/${slug}.mdx`);
console.log('It is a draft: set "draft: false" when it is ready to publish.');
