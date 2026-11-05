/**
 * H Heuristics — site-wide settings.
 * Edit this file to change the brand line, navigation or topic list.
 */
export const SITE = {
  name: 'H Heuristics',
  tagline: 'Clear explanations of complex systems',
  description:
    'H Heuristics publishes rigorous, readable explainers on climate, risk, development, technology and the systems that connect them.',
  author: 'Hunter Hughes',
  authorRole: 'Founder, H Heuristics',
  locale: 'en-GB',
};

export const NAV = [
  { href: '/', label: 'Latest' },
  { href: '/topics/', label: 'Topics' },
  { href: '/archive/', label: 'Archive' },
  { href: '/about/', label: 'About' },
];

/**
 * Topics are the top-level sections of the site. Every article must use one
 * of these `id`s in its `topic` frontmatter field. Add new topics here.
 */
export const TOPICS = [
  {
    id: 'climate-energy',
    name: 'Climate & Energy',
    blurb: 'Emissions, energy transitions, adaptation and the economics of a warming world.',
  },
  {
    id: 'risk-resilience',
    name: 'Risk & Resilience',
    blurb: 'Cascading shocks, polycrisis dynamics and how systems absorb and recover from stress.',
  },
  {
    id: 'economy-development',
    name: 'Economy & Development',
    blurb: 'Growth, inequality, finance and the paths countries take to prosperity.',
  },
  {
    id: 'technology-ai',
    name: 'Technology & AI',
    blurb: 'How new technologies diffuse, what they change, and who benefits.',
  },
  {
    id: 'systems-science',
    name: 'Systems & Science',
    blurb: 'The underlying architecture of nature, mathematics and civilisation.',
  },
] as const;

export type TopicId = (typeof TOPICS)[number]['id'];

export const topicById = (id: string) => TOPICS.find((t) => t.id === id);
