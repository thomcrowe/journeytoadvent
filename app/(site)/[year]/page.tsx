import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SeasonCalendar } from '@/components/SeasonCalendar'
import { getEntrySummaries, getSeason, getSeasons, getToday, isDraftMode } from '@/lib/content'
import { formatMonthDay } from '@/lib/date'
import { parseYear, totalDays } from '@/lib/season'

// Render unknown params completely before responding, so notFound() sends a real 404.
export const ensureStatic = 'navigation'

export async function generateStaticParams() {
  const seasons = await getSeasons()
  return seasons.length ? seasons.map((s) => ({ year: String(s.year) })) : [{ year: '2026' }]
}

export async function generateMetadata({ params }: PageProps<'/[year]'>): Promise<Metadata> {
  const { year } = await params
  return {
    title: `All the days of Advent ${year}`,
    description: `The full calendar for Journey to Advent ${year}: one hymn a day from the First Sunday of Advent to Christmas Eve.`,
    alternates: { canonical: `/${year}` },
  }
}

export default async function SeasonPage({ params }: PageProps<'/[year]'>) {
  const year = parseYear((await params).year)
  if (!year) notFound()
  const [season, entries, today, draft] = await Promise.all([getSeason(year), getEntrySummaries(year), getToday(), isDraftMode()])
  if (!season) notFound()
  const total = totalDays(season)
  return (
    <div className="wide flex flex-col gap-10 pb-8 pt-10 sm:pt-14">
      <header className="flex max-w-[680px] flex-col gap-3">
        <p className="label label-rubric">Advent {year}</p>
        <h1 className="text-[40px] font-medium leading-[1.05] sm:text-[52px]">All {total} days</h1>
        <p className="text-[19px] text-ink-muted">
          {formatMonthDay(season.startDate)} to {formatMonthDay(season.endDate)}. Each day opens at midnight, Central time.
        </p>
      </header>
      <SeasonCalendar entries={entries} weeks={season.weeks} today={today} draft={draft} />
    </div>
  )
}
