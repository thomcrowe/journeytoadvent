import 'server-only'
import { render } from 'react-email'
import DailyEmail, { type DailyEmailProps } from '@/emails/DailyEmail'
import { attribution } from '@/components/DayEntry'
import { pickStanzas } from '@/components/Stanzas'
import { getSeason } from '@/lib/content'
import { formatLong } from '@/lib/date'
import { totalDays } from '@/lib/season'
import { absoluteUrl, bibleUrl, dayPath, site } from '@/lib/site'
import type { Blocks, Entry } from '@/lib/types'

function blocksToParagraphs(blocks?: Blocks): string[] {
  if (!blocks) return []
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) =>
      ((b as { children?: { text?: string; marks?: string[] }[] }).children ?? [])
        .map((c) => (c.marks?.includes('em') ? `*${c.text ?? ''}*` : c.text ?? ''))
        .join(''),
    )
    .filter(Boolean)
}

export async function buildDailyEmail(entry: Entry) {
  const season = await getSeason(entry.year)
  const total = totalDays(season)
  const url = absoluteUrl(dayPath(entry.year, entry.dayNumber))
  const recording = entry.recordingOverride?.youtubeId || entry.hymn.defaultRecording?.youtubeId
  const props: DailyEmailProps = {
    siteUrl: site.url,
    dayUrl: url,
    dayLabel: [`Day ${entry.dayNumber} of ${total}`, entry.liturgicalLabel].filter(Boolean).join(' · '),
    dateLabel: formatLong(entry.date),
    hymnTitle: entry.hymn.title,
    attribution: attribution(entry.hymn) || undefined,
    antiphon: entry.antiphon,
    stanzas: [
      ...(entry.secondaryHymn ? pickStanzas(entry.secondaryHymn.stanzas, entry.secondaryStanzas) : []),
      ...pickStanzas(entry.hymn.stanzas, entry.featuredStanzas),
    ],
    scriptureRef: entry.scriptureRef,
    scriptureUrl: entry.scriptureRef ? bibleUrl(entry.scriptureRef) : undefined,
    reflection: blocksToParagraphs(entry.reflection),
    quote: entry.traditionQuote,
    question: entry.question,
    collect: (entry.collectOverride?.text || entry.week?.collect?.text)?.replace(/\s*Amen\.?\s*$/i, ''),
    hasRecording: Boolean(recording),
  }
  const element = DailyEmail(props)
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })])
  return {
    subject: `Day ${entry.dayNumber}: ${entry.hymn.title}`,
    previewText: entry.question ?? entry.hymn.title,
    html,
    text,
  }
}
