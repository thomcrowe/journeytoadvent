import Link from 'next/link'
import { formatShort, formatWeekday, isReleased } from '@/lib/date'
import { dayPath } from '@/lib/site'
import type { EntrySummary, Week } from '@/lib/types'

export function SeasonCalendar({ entries, weeks, today, draft = false }: { entries: EntrySummary[]; weeks: Week[]; today: string; draft?: boolean }) {
  const byWeek = [1, 2, 3, 4].map((n) => ({ n, week: weeks.find((w) => w.number === n), days: entries.filter((e) => e.weekNumber === n) }))
  return (
    <div className="flex flex-col gap-12">
      {byWeek
        .filter((w) => w.days.length)
        .map(({ n, week, days }) => (
          <section key={n} aria-labelledby={`week-${n}`} className="flex flex-col gap-4">
            <h2 id={`week-${n}`} className="flex flex-wrap items-baseline gap-x-3 border-b border-rule pb-2">
              <span className={`label label-rubric`}>Week {n}</span>
              {week?.title && <span className="text-[26px] font-medium italic">{week.title}</span>}
            </h2>
            <ol className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
              {days.map((d) => {
                const open = isReleased(d.date, today)
                const isToday = d.date === today
                const inner = (
                  <>
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={`text-[28px] font-medium leading-none ${open ? 'text-rubric' : 'text-ink-muted'}`}>{d.dayNumber}</span>
                      <span className="text-[14px] text-ink-muted">
                        {formatWeekday(d.date)} {formatShort(d.date)}
                      </span>
                    </span>
                    {open || draft ? (
                      <span className="text-[17px] leading-snug text-ink">{d.hymnTitle}</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[15px] italic text-ink-muted">
                        <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true">
                          <rect x="0.5" y="5.5" width="10" height="7" fill="none" stroke="currentColor" />
                          <path d="M2.5 5.5V3.5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" />
                        </svg>
                        Opens {formatShort(d.date)}
                      </span>
                    )}
                    {isToday && <span className="label label-rubric text-[12px]!">Today</span>}
                  </>
                )
                const cls = `flex h-full min-h-[120px] flex-col gap-2 border p-3.5 ${isToday ? 'border-rubric' : 'border-rule'} ${open ? 'bg-paper-raised' : 'bg-transparent'}`
                return (
                  <li key={d._id}>
                    {open || draft ? (
                      <Link href={dayPath(d.year, d.dayNumber)} className={`${cls} no-underline hover:border-rubric`} aria-label={`Day ${d.dayNumber}, ${formatShort(d.date)}: ${d.hymnTitle}${isToday ? ' (today)' : ''}`}>
                        {inner}
                      </Link>
                    ) : (
                      <div className={cls} aria-label={`Day ${d.dayNumber}, opens ${formatShort(d.date)}`}>
                        {inner}
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
    </div>
  )
}
