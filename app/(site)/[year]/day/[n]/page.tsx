import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DayEntry } from '@/components/DayEntry'
import { getCurrentSeason, getEntry, getEntrySummaries, getSeason, getToday, isDraftMode } from '@/lib/content'
import { chicagoMidnight, isReleased } from '@/lib/date'
import { blocksToPlainText } from '@/lib/portable-text'
import { loadDay, parseDay, parseYear } from '@/lib/season'
import { absoluteUrl, dayPath, site } from '@/lib/site'

// Render unknown params completely before responding, so notFound() sends a real 404.
export const ensureStatic = 'navigation'

export async function generateStaticParams() {
  const season = await getCurrentSeason()
  if (!season) return [{ year: '2026', n: '1' }]
  const days = await getEntrySummaries(season.year)
  if (!days.length) return [{ year: String(season.year), n: '1' }]
  return days.map((d) => ({ year: String(season.year), n: String(d.dayNumber) }))
}

export async function generateMetadata({ params }: PageProps<'/[year]/day/[n]'>): Promise<Metadata> {
  const { year: y, n: d } = await params
  const year = parseYear(y)
  const day = parseDay(d)
  if (!year || !day) return {}
  const [entry, today, draft] = await Promise.all([getEntry(year, day), getToday(), isDraftMode()])
  if (!entry || (!isReleased(entry.date, today) && !draft)) return { title: 'Not yet', robots: { index: false } }
  const title = `Day ${day}: ${entry.hymn.title}`
  const description =
    entry.question ||
    blocksToPlainText(entry.reflection as never).split('\n')[0]?.slice(0, 200) ||
    `Day ${day} of Journey to Advent: ${entry.hymn.title}.`
  const path = dayPath(year, day)
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: `${title} · ${site.name}`,
      description,
      url: path,
      publishedTime: chicagoMidnight(entry.date).toISOString(),
      ...(entry.shareImageUrl ? { images: [{ url: `${entry.shareImageUrl}?w=1200&h=630&fit=crop` }] } : {}),
    },
  }
}

export default async function DayPage({ params }: PageProps<'/[year]/day/[n]'>) {
  const { year: y, n: d } = await params
  const year = parseYear(y)
  const day = parseDay(d)
  if (!year || !day) notFound()
  const { entry, season, total, prev, next, today } = await loadDay(year, day)
  const full = await getSeason(season.year)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Day ${day}: ${entry.hymn.title}`,
    datePublished: chicagoMidnight(entry.date).toISOString(),
    author: { '@type': 'Person', name: site.author },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    mainEntityOfPage: absoluteUrl(dayPath(year, day)),
    image: absoluteUrl(`${dayPath(year, day)}/opengraph-image`),
    about: { '@type': 'CreativeWork', name: entry.hymn.title, url: absoluteUrl(`/hymns/${entry.hymn.slug}`) },
    isPartOf: { '@type': 'CreativeWorkSeries', name: season.title || site.name, url: absoluteUrl(`/${year}`) },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <DayEntry entry={entry} totalDays={total} weeks={full?.weeks ?? []} prev={prev} next={next} today={today} />
    </>
  )
}
