import type { Metadata } from 'next'
import Link from 'next/link'
import { getHymnsWithEntries, getToday, isDraftMode } from '@/lib/content'
import { isReleased } from '@/lib/date'

export const metadata: Metadata = {
  title: 'Hymns',
  description: 'Every hymn and carol in Journey to Advent, with public-domain texts, tunes, and the days that sing them.',
  alternates: { canonical: '/hymns' },
}

export default async function HymnsPage() {
  const [hymns, today, draft] = await Promise.all([getHymnsWithEntries(), getToday(), isDraftMode()])
  // Only list hymns whose day has arrived, so the calendar keeps its surprises.
  const visible = hymns
    .map((h) => ({ ...h, entries: h.entries.filter((e) => draft || isReleased(e.date, today)) }))
    .filter((h) => h.entries.length > 0)

  return (
    <div className="measure flex flex-col gap-8 pb-8 pt-10 sm:pt-14">
      <header className="flex flex-col gap-3">
        <p className="label label-rubric">The hymnal</p>
        <h1 className="text-[40px] font-medium leading-[1.05] sm:text-[52px]">Hymns</h1>
        <p className="reading text-ink-muted">
          Each hymn appears here on the day it is sung. Texts are in the public domain.
        </p>
      </header>
      {visible.length === 0 ? (
        <p className="reading italic text-ink-muted">The first hymn appears on the First Sunday of Advent.</p>
      ) : (
        <ul className="flex flex-col border-t border-rule">
          {visible.map((h) => (
            <li key={h._id} className="border-b border-rule py-4">
              <Link href={`/hymns/${h.slug}`} className="text-[22px] text-ink no-underline hover:text-rubric">
                {h.title}
              </Link>
              <p className="text-[16px] italic text-ink-muted">
                {[h.textAuthor, h.tune ? `Tune: ${h.tune}` : null].filter(Boolean).join(' · ')}
                {' · '}
                {h.entries.map((e) => `Day ${e.dayNumber}`).join(', ')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
