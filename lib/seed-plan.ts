// Builds the documents that load the 2026 season into Sanity: the season, four
// weeks, every hymn in the lineup, all daily entries, then the written weeks in
// content/seed on top. Shared by scripts/seed.ts and the Studio's "Load content" tool.
//
// IDs are deterministic (season-2026, week-2026-1, hymn-<slug>, entry-2026-day-1),
// so creates are safe to repeat.
import type { IdentifiedSanityDocumentStub as SanityDocumentStub } from '@sanity/client'
import { BONUS_DAY, DAYS, EMMANUEL, HYMNS, SEASON_2026, WEEKS, ids, slugify, weekForDay } from '../content/lineup'
import { seedWeeks } from '../content/seed'
import { parseWeekMarkdown } from './parse-seed'
import { paragraphsToBlocks } from './portable-text'

export interface SeedPatch { id: string; set?: Record<string, unknown>; setIfMissing?: Record<string, unknown> }
export interface SeedPlan { creates: SanityDocumentStub[]; patches: SeedPatch[]; log: string[] }

export function buildSeedPlan({ bonus = false }: { bonus?: boolean } = {}): SeedPlan {
  const ref = (_ref: string) => ({ _type: 'reference' as const, _ref })
  const norm = (s?: string) => (s ?? '').replace(/\s+/g, ' ').replace(/\s*Amen\.?$/i, '').trim()

  const year = SEASON_2026.year
  const seasonId = ids.season(year)
  const days = bonus ? [...DAYS, BONUS_DAY] : DAYS

  const creates: SanityDocumentStub[] = []
  const patches: SeedPatch[] = []
  const log: string[] = []

  creates.push({
    _id: seasonId,
    _type: 'season',
    year,
    title: SEASON_2026.title,
    startDate: SEASON_2026.startDate,
    endDate: bonus ? SEASON_2026.bonusDate : SEASON_2026.endDate,
  })
  if (bonus) patches.push({ id: seasonId, set: { endDate: SEASON_2026.bonusDate } })

  for (const w of WEEKS) {
    creates.push({
      _id: ids.week(year, w.number),
      _type: 'week',
      season: ref(seasonId),
      number: w.number,
      title: w.title,
      candleColor: w.candleColor,
      collect: { _type: 'collect', ...w.collect },
    })
  }

  for (const h of HYMNS) {
    creates.push({
      _id: ids.hymn(h.title),
      _type: 'hymn',
      title: h.title,
      slug: { _type: 'slug', current: slugify(h.title) },
      textAuthor: h.textAuthor,
      translator: h.translator,
      textYear: h.textYear,
      tune: h.tune,
      meter: h.meter,
      copyright: { status: h.copyright ?? 'public-domain-worldwide', notes: h.copyrightNotes ?? 'Verify text and attribution against Hymnary.org before publishing.' },
    })
  }

  for (const d of days) {
    creates.push({
      _id: ids.entry(year, d.day),
      _type: 'entry',
      season: ref(seasonId),
      week: ref(ids.week(year, weekForDay(d.day))),
      date: d.date,
      dayNumber: d.day,
      liturgicalLabel: d.label,
      hymn: ref(ids.hymn(d.hymn)),
      status: 'draft',
      ...(d.antiphon
        ? {
            antiphon: { latin: d.antiphon.latin, english: d.antiphon.english },
            secondaryHymn: ref(ids.hymn(EMMANUEL)),
            secondaryStanzas: [d.antiphon.emmanuelStanza],
          }
        : {}),
    })
  }

  // Markdown content on top of the calendar.
      for (const { name: file, markdown } of seedWeeks) {
    for (const p of parseWeekMarkdown(markdown)) {
      const day = days.find((d) => d.day === p.day)
      if (!day) {
        log.push(`${file}: Day ${p.day} is not in the lineup; skipped`)
        continue
      }
      if (p.hymnTitle && slugify(p.hymnTitle) !== slugify(day.hymn)) {
        log.push(`${file}: Day ${p.day} hymn "${p.hymnTitle}" differs from the lineup ("${day.hymn}"); using the lineup hymn`)
      }
      const week = WEEKS[weekForDay(p.day) - 1]
      const set: Record<string, unknown> = {}
      if (p.stanzas.length) set.featuredStanzas = p.stanzas.filter((s) => !s.refrain).map((s) => s.number)
      if (p.scriptureRef) set.scriptureRef = p.scriptureRef
      if (p.reflection.length) set.reflection = paragraphsToBlocks(p.reflection, `d${p.day}`)
      if (p.quote?.text) set.traditionQuote = { text: p.quote.text, author: p.quote.author, source: p.quote.source }
      if (p.question) set.question = p.question
      if (p.collect && norm(p.collect) !== norm(week.collect.text)) set.collectOverride = { _type: 'collect', text: p.collect }
      patches.push({ id: ids.entry(year, p.day), set })
      if (p.stanzas.length) {
        patches.push({
          id: ids.hymn(day.hymn),
          setIfMissing: { stanzas: p.stanzas.map((s, i) => ({ _key: `s${i}-${s.number}`, _type: 'stanza', number: s.number, lines: s.lines, refrain: s.refrain })) },
        })
      }
      log.push(`${file}: Day ${p.day} · ${day.hymn} (${Object.keys(set).join(', ') || 'no content'})`)
    }
  }
  return { creates, patches, log }
}
