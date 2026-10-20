import 'server-only'
import { notFound } from 'next/navigation'
import { daysBetween, isReleased } from './date'
import { getEntry, getEntrySummaries, getSeason, getToday, isDraftMode } from './content'
import type { Season } from './types'

export function totalDays(season: Pick<Season, 'startDate' | 'endDate'> | null | undefined) {
  if (!season) return 26
  return daysBetween(season.startDate, season.endDate) + 1
}

export function seasonPhase(season: Season, today: string): 'before' | 'during' | 'after' {
  if (today < season.startDate) return 'before'
  if (today > season.endDate) return 'after'
  return 'during'
}

/** Everything a day page needs. Calls notFound() for unreleased days unless in Draft Mode. */
export async function loadDay(year: number, day: number) {
  const [season, entry, summaries, today, draft] = await Promise.all([
    getSeason(year),
    getEntry(year, day),
    getEntrySummaries(year),
    getToday(),
    isDraftMode(),
  ])
  if (!season || !entry) notFound()
  if (!isReleased(entry.date, today) && !draft) notFound()
  const i = summaries.findIndex((s) => s.dayNumber === day)
  return {
    season,
    entry,
    today,
    draft,
    total: totalDays(season),
    prev: i > 0 ? summaries[i - 1] : undefined,
    next: i >= 0 && i < summaries.length - 1 ? summaries[i + 1] : undefined,
  }
}

export function parseYear(raw: string) {
  return /^\d{4}$/.test(raw) ? Number(raw) : null
}

export function parseDay(raw: string) {
  return /^\d{1,2}$/.test(raw) ? Number(raw) : null
}
