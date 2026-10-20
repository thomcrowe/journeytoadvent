/**
 * Seeds Sanity with the 2026 season: the season, four weeks, every hymn in the
 * lineup, and all 26 daily entries (empty, ready for the author to fill in).
 * Then applies any Markdown in content/seed/*.md (e.g. week-1.md) on top.
 *
 *   npm run seed                 # write to Sanity
 *   npm run seed -- --dry-run    # print what would be written
 *   npm run seed -- --bonus      # also create Day 27 (Christmas Day)
 *
 * Re-runnable: IDs are deterministic (season-2026, week-2026-1, hymn-<slug>,
 * entry-2026-day-1). Calendar documents are only created if missing, so edits
 * made in the Studio are never overwritten. Markdown content does overwrite the
 * fields it contains (reflection, quote, question, scripture), so the Markdown
 * stays the source of truth for whatever it covers until you stop re-running it.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createClient, type IdentifiedSanityDocumentStub as SanityDocumentStub } from '@sanity/client'
import { BONUS_DAY, DAYS, EMMANUEL, HYMNS, SEASON_2026, WEEKS, ids, slugify, weekForDay } from '../content/lineup'
import { parseWeekMarkdown } from '../lib/parse-seed'
import { paragraphsToBlocks } from '../lib/portable-text'

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const bonus = args.has('--bonus')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!dryRun && (!projectId || !token)) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (e.g. in .env.local), or pass --dry-run.')
  process.exit(1)
}

const ref = (_ref: string) => ({ _type: 'reference' as const, _ref })
const norm = (s?: string) => (s ?? '').replace(/\s+/g, ' ').replace(/\s*Amen\.?$/i, '').trim()

const year = SEASON_2026.year
const seasonId = ids.season(year)
const days = bonus ? [...DAYS, BONUS_DAY] : DAYS

const creates: SanityDocumentStub[] = []
const patches: { id: string; set?: Record<string, unknown>; setIfMissing?: Record<string, unknown> }[] = []

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
const seedDir = join(process.cwd(), 'content/seed')
const files = readdirSync(seedDir).filter((f) => f.endsWith('.md'))
for (const file of files) {
  for (const p of parseWeekMarkdown(readFileSync(join(seedDir, file), 'utf8'))) {
    const day = days.find((d) => d.day === p.day)
    if (!day) {
      console.warn(`${file}: Day ${p.day} is not in the lineup; skipped`)
      continue
    }
    if (p.hymnTitle && slugify(p.hymnTitle) !== slugify(day.hymn)) {
      console.warn(`${file}: Day ${p.day} hymn "${p.hymnTitle}" differs from the lineup ("${day.hymn}"); using the lineup hymn`)
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
    console.log(`${file}: Day ${p.day} · ${day.hymn} (${Object.keys(set).join(', ') || 'no content'})`)
  }
}

async function main() {
  console.log(`\n${creates.length} calendar documents, ${patches.length} content patches${dryRun ? ' (dry run)' : ''}`)
  if (dryRun) return
  const client = createClient({ projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false })
  const tx = client.transaction()
  for (const doc of creates) tx.createIfNotExists(doc)
  for (const p of patches) {
    tx.patch(p.id, (patch) => {
      let q = patch
      if (p.setIfMissing) q = q.setIfMissing(p.setIfMissing)
      if (p.set && Object.keys(p.set).length) q = q.set(p.set)
      return q
    })
  }
  const res = await tx.commit({ visibility: 'sync' })
  console.log(`Done. Transaction ${res.transactionId}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
