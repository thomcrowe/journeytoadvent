import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { draftMode } from 'next/headers'
import { clients } from '@/sanity/client'
import { sanityConfigured } from '@/sanity/env'
import * as Q from '@/sanity/queries'
import { fallback } from './fallback-data'
import { releaseDate } from './date'
import type { Entry, EntrySummary, Hymn, HymnWithEntries, Season, Week } from './types'

// The one data-access module for the site. Pages never talk to Sanity directly,
// so the CMS can be swapped by rewriting this file.
//
// Everything here is cached with 'use cache' and tagged so the Sanity webhook
// (/api/revalidate) can refresh it. In Draft Mode, Next.js skips these caches and
// we read drafts with the preview client instead.

async function sanity<T>(query: string, params: Record<string, unknown>, tags: string[]): Promise<T> {
  'use cache'
  cacheLife('max')
  cacheTag('sanity', ...tags)
  const { isEnabled } = await draftMode()
  const client = isEnabled ? clients!.preview : clients!.published
  return client.fetch<T>(query, params)
}

/**
 * Today's release date in Chicago, cached briefly. The 00:05 cron expires the
 * 'release-clock' tag so new entries appear right after midnight; the short
 * revalidate window is a backstop if the cron is late.
 */
export async function getToday(): Promise<string> {
  'use cache'
  cacheTag('release-clock')
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 })
  return releaseDate()
}

export async function isDraftMode() {
  return (await draftMode()).isEnabled
}

const summarize = (e: Entry): EntrySummary => ({
  _id: e._id,
  year: e.year,
  date: e.date,
  dayNumber: e.dayNumber,
  liturgicalLabel: e.liturgicalLabel,
  hymnTitle: e.hymn.title,
  hymnSlug: e.hymn.slug,
  weekNumber: e.week.number,
})

export async function getSeasons(): Promise<Season[]> {
  if (!sanityConfigured) return fallback().seasons
  return sanity<Season[]>(Q.seasons, {}, ['type:season'])
}

/** The most recent season (the one the site is currently about). */
export async function getCurrentSeason(): Promise<Season | null> {
  const seasons = await getSeasons()
  return seasons.toSorted((a, b) => b.year - a.year)[0] ?? null
}

export async function getSeason(year: number): Promise<(Season & { weeks: Week[] }) | null> {
  if (!sanityConfigured) {
    const f = fallback()
    const s = f.seasons.find((x) => x.year === year)
    return s ? { ...s, weeks: f.weeks } : null
  }
  return sanity(Q.seasonByYear, { year }, [`season:${year}`, 'type:season', 'type:week'])
}

export async function getEntrySummaries(year: number): Promise<EntrySummary[]> {
  if (!sanityConfigured) return fallback().entries.filter((e) => e.year === year).map(summarize)
  return sanity<EntrySummary[]>(Q.entrySummaries, { year }, [`season:${year}`, 'type:entry', 'type:hymn', 'type:week'])
}

export async function getEntry(year: number, day: number): Promise<Entry | null> {
  if (!sanityConfigured) return fallback().entries.find((e) => e.year === year && e.dayNumber === day) ?? null
  return sanity<Entry | null>(Q.entryByDay, { year, day }, [`season:${year}`, `entry:${year}:${day}`, 'type:entry', 'type:hymn', 'type:week'])
}

export async function getEntryByDate(date: string): Promise<Entry | null> {
  if (!sanityConfigured) return fallback().entries.find((e) => e.date === date) ?? null
  return sanity<Entry | null>(Q.entryByDate, { date }, ['type:entry', 'type:hymn', 'type:week', 'type:season'])
}

/** Every entry with full content, oldest first (feed, email). */
export async function getAllEntries(year: number): Promise<Entry[]> {
  if (!sanityConfigured) return fallback().entries.filter((e) => e.year === year)
  return sanity<Entry[]>(Q.entriesFull, { year }, [`season:${year}`, 'type:entry', 'type:hymn', 'type:week'])
}

export async function getHymnsWithEntries(): Promise<HymnWithEntries[]> {
  if (!sanityConfigured) {
    const f = fallback()
    return f.hymns
      .map((h) => ({ ...h, entries: f.entries.filter((e) => e.hymn._id === h._id || e.secondaryHymn?._id === h._id).map(summarize) }))
      .toSorted((a, b) => a.title.localeCompare(b.title))
  }
  return sanity<HymnWithEntries[]>(Q.hymnsWithEntries, {}, ['type:hymn', 'type:entry'])
}

export async function getHymn(slug: string): Promise<HymnWithEntries | null> {
  if (!sanityConfigured) return (await getHymnsWithEntries()).find((h) => h.slug === slug) ?? null
  return sanity<HymnWithEntries | null>(Q.hymnBySlug, { slug }, [`hymn:${slug}`, 'type:hymn', 'type:entry'])
}

export type { Entry, EntrySummary, Hymn, HymnWithEntries, Season, Week }
