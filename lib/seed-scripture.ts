// Passages written in content/seed, used when an entry in Sanity has the same
// reference but no passage yet (for example before "Load content" has been run),
// so the reading always shows on the page.
import { SEASON_2026 } from '@/content/lineup'
import { seedWeeks } from '@/content/seed'
import { parseWeekMarkdown } from './parse-seed'

const norm = (s?: string) => (s ?? '').replace(/[–—-]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase()

const byDay = new Map(
  seedWeeks
    .flatMap((w) => parseWeekMarkdown(w.markdown))
    .filter((d) => d.scriptureText)
    .map((d) => [d.day, d]),
)

type HasScripture = { year: number; dayNumber: number; scriptureRef?: string; scriptureText?: string }

export function withSeedScripture<T extends HasScripture | null>(entry: T): T {
  if (!entry || entry.scriptureText || entry.year !== SEASON_2026.year) return entry
  const seed = byDay.get(entry.dayNumber)
  if (!seed?.scriptureText) return entry
  // Only borrow the passage when the reference hasn't been changed in the Studio.
  if (entry.scriptureRef && norm(entry.scriptureRef) !== norm(seed.scriptureRef)) return entry
  return { ...entry, scriptureRef: entry.scriptureRef || seed.scriptureRef, scriptureText: seed.scriptureText }
}
