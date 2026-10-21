import Link from 'next/link'
import { DayEntry } from '@/components/DayEntry'
import { Landing } from '@/components/Landing'
import { SeasonCalendar } from '@/components/SeasonCalendar'
import { getCurrentSeason, getEntry, getEntrySummaries, getSeason, getToday, isDraftMode } from '@/lib/content'
import { daysBetween } from '@/lib/date'
import { loadDay, seasonPhase, totalDays } from '@/lib/season'

export default async function Home() {
  const [current, today, draft] = await Promise.all([getCurrentSeason(), getToday(), isDraftMode()])
  if (!current) {
    return (
      <div className="measure py-20">
        <p className="reading">Journey to Advent is being prepared. Please check back soon.</p>
      </div>
    )
  }
  const season = (await getSeason(current.year))!
  const phase = seasonPhase(season, today)

  if (phase === 'before') {
    const sample = await getEntry(season.year, 1)
    return <Landing season={season} sample={sample} weeks={season.weeks} today={today} />
  }

  if (phase === 'after') {
    const entries = await getEntrySummaries(season.year)
    return (
      <div className="wide flex flex-col gap-10 pb-8 pt-10 sm:pt-14">
        <header className="flex max-w-[680px] flex-col gap-4">
          <p className="label label-rubric">Advent {season.year} · The journey is complete</p>
          <h1 className="text-[44px] font-medium italic leading-[1.05] sm:text-[60px]">
            <span className="text-rubric">A</span> blessed Christmas
          </h1>
          <p className="reading">
            The Word became flesh and dwelt among us. Thank you for walking these {totalDays(season)} days. Every hymn and reflection is still here: return to any day below, or browse <Link href="/hymns">the hymns</Link>.
          </p>
        </header>
        <SeasonCalendar entries={entries} weeks={season.weeks} today={today} draft={draft} />
      </div>
    )
  }

  const day = daysBetween(season.startDate, today) + 1
  const entry = await getEntry(season.year, day)
  if (!entry) {
    return (
      <div className="measure py-20">
        <p className="reading">
          Today&rsquo;s entry isn&rsquo;t ready yet. In the meantime, <Link href={`/${season.year}`}>see all the days so far</Link>.
        </p>
      </div>
    )
  }
  const data = await loadDay(season.year, day)
  return (
    <>
      <div className="border-b border-rule bg-paper-raised">
        <p className="measure py-3 text-[17px] text-ink-muted">
          You&rsquo;re on <span className="text-ink">Day {day}</span> of {data.total}.{' '}
          {day > 1 && (
            <>
              Missed a day? <Link href={`/${season.year}`}>See all {data.total} days</Link>.
            </>
          )}
        </p>
      </div>
      <DayEntry entry={data.entry} totalDays={data.total} weeks={season.weeks} prev={data.prev} next={data.next} today={today} />
    </>
  )
}
