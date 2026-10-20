import type { MetadataRoute } from 'next'
import { getAllEntries, getHymnsWithEntries, getSeasons, getToday } from '@/lib/content'
import { chicagoMidnight, isReleased } from '@/lib/date'
import { absoluteUrl, dayPath } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seasons, hymns, today] = await Promise.all([getSeasons(), getHymnsWithEntries(), getToday()])
  const entries = (await Promise.all(seasons.map((s) => getAllEntries(s.year)))).flat().filter((e) => isReleased(e.date, today))
  return [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly' },
    { url: absoluteUrl('/subscribe'), changeFrequency: 'yearly' },
    { url: absoluteUrl('/hymns'), changeFrequency: 'daily' },
    ...seasons.map((s) => ({ url: absoluteUrl(`/${s.year}`), changeFrequency: 'daily' as const })),
    ...entries.map((e) => ({ url: absoluteUrl(dayPath(e.year, e.dayNumber)), lastModified: chicagoMidnight(e.date), changeFrequency: 'yearly' as const })),
    // Hymn pages are evergreen search assets; list each once its first day has arrived.
    ...hymns
      .filter((h) => h.entries.some((e) => isReleased(e.date, today)))
      .map((h) => ({ url: absoluteUrl(`/hymns/${h.slug}`), changeFrequency: 'yearly' as const, priority: 0.8 })),
  ]
}
