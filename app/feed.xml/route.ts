import { getAllEntries, getCurrentSeason, getToday } from '@/lib/content'
import { chicagoMidnight, isReleased } from '@/lib/date'
import { blocksToPlainText } from '@/lib/portable-text'
import { absoluteUrl, dayPath, site } from '@/lib/site'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const [season, today] = await Promise.all([getCurrentSeason(), getToday()])
  const entries = season ? (await getAllEntries(season.year)).filter((e) => isReleased(e.date, today)).reverse() : []
  const items = entries
    .map((e) => {
      const url = absoluteUrl(dayPath(e.year, e.dayNumber))
      const text = blocksToPlainText(e.reflection as never)
      const description = [e.scriptureRef ? `Read: ${e.scriptureRef}` : '', text, e.question ? `Carry this: ${e.question}` : ''].filter(Boolean).join('\n\n')
      return `    <item>
      <title>${esc(`Day ${e.dayNumber}: ${e.hymn.title}`)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${chicagoMidnight(e.date).toUTCString()}</pubDate>
      <description>${esc(description)}</description>
    </item>`
    })
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${site.url}</link>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>${esc(site.description)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } })
}
