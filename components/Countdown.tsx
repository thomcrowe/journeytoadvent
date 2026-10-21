'use client'

import { useSyncExternalStore } from 'react'
import { chicagoMidnight } from '@/lib/date'

function subscribe(onChange: () => void) {
  const t = setInterval(onChange, 1000)
  return () => clearInterval(t)
}

// Rounded to the second so repeated reads within a tick return the same snapshot.
const clientNow = () => Math.floor(Date.now() / 1000) * 1000

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Live countdown to midnight (Chicago) on the First Sunday of Advent.
 * The server renders the day count (`initialDays`), so the countdown appears
 * even before JavaScript loads; the browser then ticks every second.
 */
export function Countdown({ startDate, initialDays }: { startDate: string; initialDays: number }) {
  const now = useSyncExternalStore(subscribe, clientNow, () => null)
  const target = chicagoMidnight(startDate).getTime()
  const ms = now === null ? null : Math.max(0, target - now)

  if (ms === 0) {
    return <p className="text-[28px] italic text-rubric">Advent has begun. Refresh for Day 1.</p>
  }

  const d = ms === null ? initialDays : Math.floor(ms / 86_400_000)
  const cells =
    ms === null
      ? [{ n: String(d), unit: d === 1 ? 'day' : 'days' }]
      : [
          { n: String(d), unit: d === 1 ? 'day' : 'days' },
          { n: pad(Math.floor((ms % 86_400_000) / 3_600_000)), unit: 'hours' },
          { n: pad(Math.floor((ms % 3_600_000) / 60_000)), unit: 'minutes' },
          { n: pad(Math.floor((ms % 60_000) / 1000)), unit: 'seconds' },
        ]

  return (
    <div className="flex flex-col gap-3">
      {/* Screen readers get one stable sentence instead of a ticking clock. */}
      <p className="sr-only">
        {d} {d === 1 ? 'day' : 'days'} until Advent begins.
      </p>
      <div aria-hidden="true" className="grid max-w-[440px] grid-cols-4 gap-2 sm:gap-3">
        {cells.map((c) => (
          <div key={c.unit} className="flex min-w-0 flex-col items-center border border-rule bg-paper-raised px-1 py-3 sm:px-3 sm:py-4">
            <span className="text-[34px] font-medium leading-none tabular-nums sm:text-[56px]">{c.n}</span>
            <span className="label mt-2 text-[11px]! tracking-[0.12em]! sm:text-[13px]! sm:tracking-[0.2em]!">{c.unit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
