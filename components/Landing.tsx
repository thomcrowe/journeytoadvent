import Link from 'next/link'
import { Countdown } from './Countdown'
import { RichText } from './RichText'
import { Stanzas, pickStanzas } from './Stanzas'
import { SubscribeForm } from './SubscribeForm'
import { Wordmark } from './Wordmark'
import { daysBetween, formatLong, formatMonthDay } from '@/lib/date'
import { roman } from '@/lib/site'
import type { Entry, Season, Week } from '@/lib/types'

export function Landing({ season, sample, weeks, today }: { season: Season; sample: Entry | null; weeks: Week[]; today: string }) {
  const total = daysBetween(season.startDate, season.endDate) + 1
  const dayWords = ({ 26: 'Twenty-six', 27: 'Twenty-seven' } as Record<number, string>)[total] ?? String(total)
  const stanza = sample ? pickStanzas(sample.hymn.stanzas, sample.featuredStanzas).slice(0, 1) : []
  const meta = sample ? [sample.hymn.tune, sample.hymn.meter, sample.hymn.textAuthor?.replace(/;.*$/, '')].filter(Boolean).join(' · ') : ''
  return (
    <div className="flex flex-col">
      {/* Launch countdown: the first thing a visitor sees. */}
      <section aria-labelledby="countdown-heading" className="border-b border-rule bg-paper-raised">
        <div className="wide flex flex-col items-center gap-7 py-12 text-center sm:gap-9 sm:py-20">
          <p className="label label-rubric">A hymn a day · Advent {roman(season.year)}</p>
          <h1 id="countdown-heading" className="text-[30px] font-medium italic leading-tight sm:text-[44px]">
            Journey to Advent begins in
          </h1>
          <Countdown startDate={season.startDate} initialDays={Math.max(0, daysBetween(today, season.startDate) - 1)} />
          <p className="text-[18px] text-ink-muted sm:text-[20px]">
            {formatLong(season.startDate)}, at midnight Central time
          </p>
          <div className="flex w-full max-w-[560px] flex-col gap-3 text-left">
            <p className="text-center text-[19px] italic">Get Day 1 in your inbox at 5:00 that morning.</p>
            <SubscribeForm tone="light" source="landing-hero" />
          </div>
        </div>
      </section>

      <div className="wide flex flex-col gap-16 pb-4 pt-12 sm:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_440px] lg:gap-[72px]">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-1">
            <Wordmark size="lg" />
            <div className="mt-[18px] flex items-center gap-3.5">
              <div className="h-0.5 w-12 bg-rubric" />
              <p className="label text-[15px]! sm:text-[17px]!">{dayWords} days · {dayWords} hymns</p>
            </div>
          </div>

          <RichText value={season.intro} className="reading max-w-[560px]" />
        </div>

        {sample && (
          <aside aria-label="A taste of Day 1" className="flex flex-col gap-[18px] self-start border border-rule bg-paper-raised px-7 py-9 sm:px-11 sm:py-10">
            <div className="flex items-baseline justify-between">
              <p className="label label-rubric text-[15px]! tracking-[0.18em]!">Day 1 · Advent I</p>
              <p className="text-[15px] text-ink-muted">{formatMonthDay(sample.date).split(' ').reverse().join(' ')}</p>
            </div>
            <h2 className="text-[32px] font-medium leading-[1.1] sm:text-[36px]">{sample.hymn.title}</h2>
            {meta && <p className="text-[15px] italic text-ink-muted">{meta}</p>}
            <div className="h-px bg-rule" />
            <Stanzas stanzas={stanza} className="py-0! [&_.stanza]:text-[20px]!" />
            {sample.scriptureRef && (
              <p className="mt-auto text-[15px] text-ink-muted">
                <span className="text-rubric" aria-hidden="true">℟</span> Read: {sample.scriptureRef}
              </p>
            )}
          </aside>
        )}
      </div>

      {weeks.length > 0 && (
        <section aria-labelledby="shape-heading" className="flex flex-col gap-6 border-t border-rule pt-8">
          <h2 id="shape-heading" className="label">
            The shape of the season
          </h2>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {weeks.map((w) => (
              <li key={w._id} className="flex flex-col gap-1">
                <span className={`label label-rubric`}>Week {w.number}</span>
                <span className="text-[26px] italic leading-tight">{w.title}</span>
              </li>
            ))}
          </ol>
          <p className="text-[18px] text-ink-muted">
            <Link href="/about">How to use Journey to Advent</Link> · <Link href={`/${season.year}`}>See the calendar</Link>
          </p>
        </section>
      )}
      </div>
    </div>
  )
}
