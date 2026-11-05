/** Components available in every .mdx article without importing them. */
import BarChart from './BarChart.astro';
import LineChart from './LineChart.astro';
import KeyStats from './KeyStats.astro';
import Callout from './Callout.astro';
import PullQuote from './PullQuote.astro';
import Figure from './Figure.astro';

export const mdxComponents = { BarChart, LineChart, KeyStats, Callout, PullQuote, Figure };
