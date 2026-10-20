'use client'

import { useSyncExternalStore } from 'react'
import { chicagoMidnight } from '@/lib/date'

function parts(ms: number) {
  const d = Math.floor(ms / 86_400_000)
  const h = Math.floor((ms % 86_400_000) / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return { d, h, m }
}

function subscribe(onChange: () => void) {
  const t = setInterval(onChange, 15_000)
  return () => clearInterval(t)
}

// Rounded so repeated reads within a tick return the same snapshot.
const clientNow = () => Math.floor(Date.now() / 15_000) * 15_000

/** Counts down to midnight (Chicago) on the First Sunday of Advent. */
export function Countdown({ startDate }: { startDate: string }) {
  // Rendered only on the client (null on the server) to avoid hydration mismatches.
  const now = useSyncExternalStore(subscribe, clientNow, () => null)
  const target = chicagoMidnight(startDate).getTime()
  if (now === null || now >= target) return null
  const { d, h, m } = parts(target - now)
  const cells = [
    { n: d, unit: d === 1 ? 'day' : 'days' },
    { n: h, unit: h === 1 ? 'hour' : 'hours' },
    { n: m, unit: m === 1 ? 'minute' : 'minutes' },
  ]
  return (
    <div role="timer" aria-live="off" aria-label={`${d} days, ${h} hours, ${m} minutes until Advent begins`} className="flex gap-6">
      {cells.map((c) => (
        <div key={c.unit} className="flex flex-col">
          <span className="text-[44px] font-medium leading-none tabular-nums sm:text-[56px]">{c.n}</span>
          <span className="label mt-1">{c.unit}</span>
        </div>
      ))}
    </div>
  )
}
