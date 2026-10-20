import 'server-only'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { DAYS, EMMANUEL, HYMNS, SEASON_2026, WEEKS, ids, slugify, weekForDay } from '@/content/lineup'
import { parseWeekMarkdown, type ParsedDay } from './parse-seed'
import { paragraphsToBlocks } from './portable-text'
import type { Entry, Hymn, Season, Week } from './types'

// Sample content used when NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Built from
// the season lineup plus any Markdown in content/seed/.

const LO_HE_COMES_STANZAS = [
  { number: 1, lines: 'Lo! he comes with clouds descending,\nonce for favored sinners slain;\nthousand thousand saints attending\nswell the triumph of his train:\n*Alleluia! Alleluia!*\nGod appears on earth to reign.' },
  { number: 2, lines: 'Every eye shall now behold him\nrobed in dreadful majesty;\nthose who set at naught and sold him,\npierced, and nailed him to the tree,\ndeeply wailing, deeply wailing,\nshall the true Messiah see.' },
  { number: 3, lines: 'Those dear tokens of his passion\nstill his dazzling body bears,\ncause of endless exultation\nto his ransomed worshipers;\nwith what rapture, with what rapture\ngaze we on those glorious scars!' },
  { number: 4, lines: 'Yea, Amen! let all adore thee,\nhigh on thine eternal throne;\nSavior, take the power and glory,\nclaim the kingdom for thine own:\n*Alleluia! Alleluia!*\nThou shalt reign, and thou alone.' },
]

function readSeedDays(): ParsedDay[] {
  try {
    const dir = join(process.cwd(), 'content/seed')
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .flatMap((f) => parseWeekMarkdown(readFileSync(join(dir, f), 'utf8')))
  } catch {
    return []
  }
}

function build() {
  const year = SEASON_2026.year
  const season: Season = {
    _id: ids.season(year),
    year,
    title: SEASON_2026.title,
    startDate: SEASON_2026.startDate,
    endDate: SEASON_2026.endDate,
    intro: paragraphsToBlocks([
      'For twenty-six mornings, from the First Sunday of Advent to Christmas Eve, open one hymn. Read a short passage of Scripture, a brief reflection, and a word from the Christian tradition. Carry one question through the day, and close with the collect for the week.',
      'It takes about ten minutes. Sing if you like.',
    ], 'intro'),
  }

  const hymns = new Map<string, Hymn>()
  for (const h of HYMNS) {
    const slug = slugify(h.title)
    hymns.set(h.title, {
      _id: ids.hymn(h.title),
      title: h.title,
      slug,
      textAuthor: h.textAuthor,
      translator: h.translator,
      textYear: h.textYear,
      tune: h.tune,
      meter: h.meter,
      stanzas: h.title === 'Lo! He Comes with Clouds Descending' ? LO_HE_COMES_STANZAS : [],
      copyright: { status: h.copyright ?? 'public-domain-worldwide', notes: h.copyrightNotes },
    })
  }

  const weeks: Week[] = WEEKS.map((w) => ({
    _id: ids.week(year, w.number),
    number: w.number,
    title: w.title,
    candleColor: w.candleColor,
    collect: w.collect,
  }))

  const seeded = new Map(readSeedDays().map((d) => [d.day, d]))

  const entries: Entry[] = DAYS.map((d) => {
    const s = seeded.get(d.day)
    const hymn = hymns.get(d.hymn)!
    const week = weeks[weekForDay(d.day) - 1]
    return {
      _id: ids.entry(year, d.day),
      year,
      date: d.date,
      dayNumber: d.day,
      liturgicalLabel: d.label,
      hymn,
      featuredStanzas: s?.stanzas.filter((x) => !x.refrain).map((x) => x.number),
      secondaryHymn: d.antiphon ? hymns.get(EMMANUEL) : undefined,
      secondaryStanzas: d.antiphon ? [d.antiphon.emmanuelStanza] : undefined,
      antiphon: d.antiphon ? { latin: d.antiphon.latin, english: d.antiphon.english } : undefined,
      scriptureRef: s?.scriptureRef,
      reflection: s ? paragraphsToBlocks(s.reflection, `d${d.day}`) : undefined,
      traditionQuote: s?.quote,
      question: s?.question,
      status: s ? 'ready' : 'draft',
      week,
    } as Entry
  })

  return { seasons: [season], weeks, hymns: [...hymns.values()], entries }
}

let cache: ReturnType<typeof build> | null = null
export function fallback() {
  return (cache ??= build())
}
