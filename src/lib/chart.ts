/** Small helpers for the server-rendered charts. */

export const SERIES_COLORS = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)'];

export function fmt(v: number, opts: { decimals?: number; prefix?: string; unit?: string } = {}) {
  const { decimals, prefix = '', unit = '' } = opts;
  const d = decimals ?? (Math.abs(v) < 10 && !Number.isInteger(v) ? 1 : 0);
  const n = v.toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  return `${v < 0 ? '−' : ''}${prefix}${n.replace('-', '')}${unit}`;
}

/** "Nice" axis ticks covering [min, max]. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) {
    max = min + 1;
  }
  const span = max - min;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step / 2; v += step) ticks.push(Number(v.toFixed(10)));
  return ticks;
}
