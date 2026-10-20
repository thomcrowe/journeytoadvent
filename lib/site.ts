export const site = {
  name: 'Journey to Advent',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://journeytoadvent.com').replace(/\/$/, ''),
  tagline: 'A hymn a day from the First Sunday of Advent to Christmas Eve',
  description:
    'A daily Advent devotional: one hymn a day, with Scripture, a short reflection, a word from the Christian tradition, a question to carry, and the collect for the week.',
  author: 'The Rev. Thom Crowe',
  byline: 'Written by the Rev. Thom Crowe',
}

export function absoluteUrl(path: string) {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}

/** Oremus Bible Browser link (NRSV) for a reference like "Mark 13:24–37". */
export function bibleUrl(ref: string) {
  const passage = ref.replace(/[–—]/g, '-').trim()
  return `https://bible.oremus.org/?version=NRSVAE&passage=${encodeURIComponent(passage)}`
}

export function dayPath(year: number, day: number) {
  return `/${year}/day/${day}`
}

export function formatDuration(seconds?: number) {
  if (!seconds || seconds <= 0) return undefined
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const ROMAN: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
export function roman(n: number) {
  let out = ''
  for (const [v, r] of ROMAN) while (n >= v) { out += r; n -= v }
  return out
}

const WORDS = ['no', 'one', 'two', 'three', 'four']
export const numberWord = (n: number) => WORDS[n] ?? String(n)
