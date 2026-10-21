import Link from 'next/link'
import { CandleProgress } from './CandleProgress'
import { ListenBar } from './ListenBar'
import { RichText } from './RichText'
import { ShareButton } from './ShareButton'
import { Stanzas, pickStanzas } from './Stanzas'
import { TrackOnMount, TrackWhenVisible, TrackedLink } from './Track'
import { formatLong, isReleased } from '@/lib/date'
import { bibleUrl, dayPath, formatDuration } from '@/lib/site'
import type { Entry, EntrySummary, HymnRef, Week } from '@/lib/types'

export function attribution(h: HymnRef) {
  const author = [h.textAuthor, h.textYear ? `(${h.textYear})` : null].filter(Boolean).join(' ')
  const parts = [author, h.translator ? `tr. ${h.translator}` : null].filter(Boolean).join('; ')
  return [parts, h.tune ? `Tune: ${h.tune}` : null].filter(Boolean).join(' · ')
}

function stripAmen(text: string) {
  return text.replace(/\s*Amen\.?\s*$/i, '')
}

export function DayEntry({
  entry,
  totalDays,
  weeks,
  prev,
  next,
  today,
}: {
  entry: Entry
  totalDays: number
  weeks: Week[]
  prev?: EntrySummary
  next?: EntrySummary
  today: string
}) {
  const { hymn } = entry
  const recording = entry.recordingOverride?.youtubeId ? entry.recordingOverride : hymn.defaultRecording
  const stanzas = pickStanzas(hymn.stanzas, entry.featuredStanzas)
  const secondary = entry.secondaryHymn ? pickStanzas(entry.secondaryHymn.stanzas, entry.secondaryStanzas) : []
  const collect = entry.collectOverride?.text || entry.week?.collect?.text
  const label = [`Day ${entry.dayNumber} of ${totalDays}`, entry.liturgicalLabel].filter(Boolean).join(' · ')
  const weekNumber = entry.week?.number ?? 1
  const candleColors = [1, 2, 3, 4].map((n) => weeks.find((w) => w.number === n)?.candleColor)
  const nextReleased = next && isReleased(next.date, today)
  const path = dayPath(entry.year, entry.dayNumber)

  return (
    <article className="measure flex flex-col gap-7 pb-8 pt-10 sm:pt-14">
      <TrackOnMount event="entry_viewed" properties={{ dayNumber: entry.dayNumber, hymn: hymn.title, year: entry.year }} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label label-rubric text-[15px]! tracking-[0.18em]!">{label}</p>
        <CandleProgress lit={weekNumber} colors={candleColors} />
      </div>

      <header className="flex flex-col gap-2.5">
        <p className="text-[18px] text-ink-muted">
          <time dateTime={entry.date}>{formatLong(entry.date)}</time>
        </p>
        <h1 className="text-[40px] font-medium leading-[1.05] text-balance sm:text-[52px]">{hymn.title}</h1>
        {attribution(hymn) && <p className="text-[17px] italic leading-snug text-ink-muted">{attribution(hymn)}</p>}
      </header>

      {recording?.youtubeId && (
        <ListenBar
          youtubeId={recording.youtubeId}
          label={recording.label}
          duration={formatDuration(recording.durationSeconds)}
          hymnTitle={hymn.title}
          dayNumber={entry.dayNumber}
        />
      )}

      {entry.antiphon?.latin && (
        <section aria-labelledby="antiphon-heading" className="flex flex-col gap-3 border-l-2 border-rubric pl-5">
          <h2 id="antiphon-heading" className="label label-rubric">
            The O Antiphon
          </h2>
          <p lang="la" className="text-[21px] italic leading-[1.5]">
            {entry.antiphon.latin}
          </p>
          {entry.antiphon.english && <p className="text-[19px] leading-[1.55] text-ink">{entry.antiphon.english}</p>}
          {secondary.length > 0 && entry.secondaryHymn && (
            <div className="mt-2 flex flex-col gap-2">
              <p className="text-[16px] italic text-ink-muted">
                From{' '}
                <Link href={`/hymns/${entry.secondaryHymn.slug}`} className="text-ink-muted">
                  {entry.secondaryHymn.title}
                </Link>
              </p>
              <Stanzas stanzas={secondary} className="py-0!" />
            </div>
          )}
        </section>
      )}

      {stanzas.length > 0 && (
        <section aria-label="Hymn text">
          <Stanzas stanzas={stanzas} />
          {hymn.stanzas && hymn.stanzas.length > stanzas.length && (
            <p className="mt-2 text-[16px]">
              <Link href={`/hymns/${hymn.slug}`}>Read the full hymn</Link>
            </p>
          )}
        </section>
      )}

      {entry.scriptureRef && (
        <div className="flex flex-col gap-3 border-y border-rule py-4">
          <div className="flex items-baseline gap-3.5">
            <h2 className="label">Read</h2>
            <a href={bibleUrl(entry.scriptureRef)} className="text-[20px]" rel="noopener noreferrer">
              {entry.scriptureRef}
              <span className="sr-only"> (opens the NRSV at Oremus Bible Browser)</span>
            </a>
          </div>
          {entry.scriptureText && (
            <blockquote className="text-[18px] italic leading-[1.55] text-ink">
              {entry.scriptureText} <span className="not-italic text-ink-muted">(KJV)</span>
            </blockquote>
          )}
        </div>
      )}

      <section aria-labelledby="reflect-heading" className="flex flex-col gap-[18px]">
        <h2 id="reflect-heading" className="label font-medium">
          Reflect
        </h2>
        {entry.reflection?.length ? (
          <RichText value={entry.reflection} className="reading drop-cap" />
        ) : (
          <p className="reading italic text-ink-muted">The reflection for this day is still being written.</p>
        )}
      </section>

      {entry.traditionQuote?.text && (
        <figure className="my-3 flex flex-col gap-3 border border-rule bg-paper-raised px-6 py-7 sm:px-8">
          <p className="label">From the tradition</p>
          <blockquote className="text-[22px] italic leading-[1.45] sm:text-[24px]">“{entry.traditionQuote.text.replace(/^[“"]|[”"]$/g, '')}”</blockquote>
          {(entry.traditionQuote.author || entry.traditionQuote.source) && (
            <figcaption className="text-[17px] text-ink-muted">
              {[entry.traditionQuote.author, entry.traditionQuote.source].filter(Boolean).join(', ')}
            </figcaption>
          )}
        </figure>
      )}

      {entry.question && (
        <section aria-labelledby="carry-heading" className="flex flex-col gap-2.5 border-t-2 border-rubric py-6">
          <h2 id="carry-heading" className="label label-rubric">
            Carry this
          </h2>
          <p className="text-[22px] leading-[1.45] sm:text-[24px]">{entry.question}</p>
        </section>
      )}

      {collect && (
        <section aria-labelledby="pray-heading" className="flex flex-col gap-2.5">
          <h2 id="pray-heading" className="label">
            Pray
          </h2>
          <p className="text-[19px] italic leading-[1.6] sm:text-[20px]">
            {stripAmen(collect)} <span className="not-italic text-rubric">Amen.</span>
          </p>
        </section>
      )}

      {/* Reaching the prayer counts as finishing the day. */}
      <TrackWhenVisible event="entry_finished" properties={{ dayNumber: entry.dayNumber, hymn: hymn.title, year: entry.year }} />

      <div className="flex justify-end">
        <ShareButton title={`Day ${entry.dayNumber}: ${hymn.title}`} path={path} dayNumber={entry.dayNumber} />
      </div>

      <nav aria-label="Day navigation" className="flex flex-wrap justify-between gap-4 border-t border-rule pt-6 text-[18px]">
        {prev ? (
          <Link href={dayPath(prev.year, prev.dayNumber)} className="text-ink-muted no-underline hover:text-rubric" rel="prev">
            ← Day {prev.dayNumber} · {prev.hymnTitle}
          </Link>
        ) : (
          <Link href="/about" className="text-ink-muted no-underline hover:text-rubric">
            ← About this journey
          </Link>
        )}
        {next && nextReleased ? (
          <TrackedLink
            href={dayPath(next.year, next.dayNumber)}
            event="next_day_clicked"
            properties={{ from: entry.dayNumber, to: next.dayNumber }}
            className="no-underline"
            rel="next"
          >
            Day {next.dayNumber} · {next.hymnTitle} →
          </TrackedLink>
        ) : next ? (
          <span className="text-ink-muted">Day {next.dayNumber} opens tomorrow</span>
        ) : (
          <Link href={`/${entry.year}`} className="no-underline">
            All {totalDays} days →
          </Link>
        )}
      </nav>
    </article>
  )
}
