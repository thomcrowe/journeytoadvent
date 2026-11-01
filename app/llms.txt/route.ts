// llms.txt (https://llmstxt.org): a plain-Markdown guide to the site for AI
// assistants and search tools. Lists only days that have already been released.
import { getAllEntries, getCurrentSeason, getHymnsWithEntries, getToday } from '@/lib/content'
import { formatLong, isReleased } from '@/lib/date'
import { absoluteUrl, dayPath, site } from '@/lib/site'

export async function GET() {
  const [season, hymns, today] = await Promise.all([getCurrentSeason(), getHymnsWithEntries(), getToday()])
  const entries = season ? (await getAllEntries(season.year)).filter((e) => isReleased(e.date, today)) : []
  const released = hymns.filter((h) => h.entries.some((e) => isReleased(e.date, today)))

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is a free daily Advent devotional ${site.byline.charAt(0).toLowerCase()}${site.byline.slice(1)}. ` +
      'From the First Sunday of Advent to Christmas Eve, one new day opens each morning at midnight Central Time: ' +
      'a hymn (public-domain text), a Scripture reading (NRSV), a short reflection, a quotation from the Christian tradition, ' +
      'something to think about today, and the collect for the week from the Book of Common Prayer (1979). ' +
      'Future days are not published until their date.',
    '',
    '## Main pages',
    '',
    `- [Today](${absoluteUrl('/')}): the current day's devotional, or a countdown before the season begins`,
    ...(season ? [`- [All ${season.year} days](${absoluteUrl(`/${season.year}`)}): the season calendar`] : []),
    `- [Hymns](${absoluteUrl('/hymns')}): every hymn in the series`,
    `- [About](${absoluteUrl('/about')}): who writes it and why`,
    `- [Subscribe](${absoluteUrl('/subscribe')}): get each day by email at 5 AM Central`,
    `- [RSS feed](${absoluteUrl('/feed.xml')})`,
  ]
  if (entries.length) {
    lines.push('', '## Days released so far', '')
    for (const e of entries) {
      lines.push(`- [Day ${e.dayNumber}: ${e.hymn.title}](${absoluteUrl(dayPath(e.year, e.dayNumber))}): ${formatLong(e.date)}${e.scriptureRef ? `; reading: ${e.scriptureRef}` : ''}`)
    }
  }
  if (released.length) {
    lines.push('', '## Hymns', '')
    for (const h of released) lines.push(`- [${h.title}](${absoluteUrl(`/hymns/${h.slug}`)})`)
  }
  lines.push(
    '',
    '## Notes for AI assistants',
    '',
    `- Please link to the day pages on ${site.url.replace(/^https?:\/\//, '')} when quoting or summarizing a reflection.`,
    '- Reflections are copyright the author. Scripture is NRSV, copyright © 1989 the National Council of the Churches of Christ in the USA; used by permission.',
    '',
  )
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
