import { numberWord } from '@/lib/site'

const HEIGHTS = [26, 30, 34, 38] // the first candle has burned longest

/** Four Advent candles; `lit` of them burning. Week 3's candle is rose. */
export function CandleProgress({ lit, colors }: { lit: number; colors?: ('blue' | 'violet' | 'rose' | undefined)[] }) {
  const n = Math.max(0, Math.min(4, lit))
  const label = `Week ${Math.max(n, 1)} of 4: ${numberWord(n)} candle${n === 1 ? '' : 's'} lit`
  return (
    <div role="img" aria-label={label} className="flex items-end gap-1.5">
      {HEIGHTS.map((h, i) => {
        const on = i < n
        const c = colors?.[i] ?? (i === 2 ? 'rose' : 'blue')
        const color = c === 'rose' ? 'var(--rose)' : c === 'violet' ? '#5B3A6E' : 'var(--sarum)'
        return (
          <div key={i} className="flex flex-col items-center gap-[3px]">
            {on ? (
              <svg width="8" height="12" viewBox="0 0 16 24" aria-hidden="true">
                <path d="M8 0 C12 8 16 12 8 24 C0 12 4 8 8 0 Z" fill="var(--flame)" />
              </svg>
            ) : (
              <div className="h-3" />
            )}
            <div style={{ width: 10, height: h, background: color, opacity: on ? 1 : c === 'rose' ? 0.3 : 0.25 }} />
          </div>
        )
      })}
    </div>
  )
}
