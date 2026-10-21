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
 * Launch countdown to midnight (Chicago) on the First Sunday of Advent.
 * The server renders the whole-day count (`initialDays`) so something real shows
 * before JavaScript loads; the browser then ticks every second.
 */
export function Countdown({ startDate, initialDays }: { startDate: string; initialDays: number }) {
  const now = useSyncExternalStore(subscribe, clientNow, () => null)
  const target = chicagoMidnight(startDate).getTime()
  const ms = now === null ? null : Math.max(0, target - now)

  if (ms === 0) {
    return <p className="text-[32px] italic text-rubric">Advent has begun. Refresh for Day 1.</p>
  }

  const d = ms === null ? initialDays : Math.floor(ms / 86_400_000)
  const cells = [
    { n: String(d), unit: d === 1 ? 'Day' : 'Days' },
    { n: ms === null ? '··' : pad(Math.floor((ms % 86_400_000) / 3_600_000)), unit: 'Hours' },
    { n: ms === null ? '··' : pad(Math.floor((ms % 3_600_000) / 60_000)), unit: 'Minutes' },
    { n: ms === null ? '··' : pad(Math.floor((ms % 60_000) / 1000)), unit: 'Seconds' },
  ]

  return (
    <div className="w-full">
      {/* Screen readers get one stable sentence instead of a ticking clock. */}
      <p className="sr-only">
        {d} {d === 1 ? 'day' : 'days'} until Advent begins.
      </p>
      <div aria-hidden="true" className="mx-auto grid max-w-[760px] grid-cols-4">
        {cells.map((c, i) => (
          <div key={c.unit} className={`flex flex-col items-center px-1 ${i > 0 ? 'border-l border-rule' : ''}`}>
            <span className={`font-medium leading-none tabular-nums text-[44px] min-[420px]:text-[56px] sm:text-[88px] lg:text-[112px] ${i === 0 ? 'text-rubric' : 'text-ink'}`}>
              {c.n}
            </span>
            <span className="label mt-3 text-[11px]! tracking-[0.14em]! sm:text-[14px]! sm:tracking-[0.22em]!">{c.unit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
