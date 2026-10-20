import type { Stanza } from '@/lib/types'

function Line({ text }: { text: string }) {
  const m = text.match(/^\*(.+)\*$/) ?? text.match(/^_(.+)_$/)
  return m ? <span className="italic">{m[1]}</span> : <>{text}</>
}

/** Hymn stanzas: verse numbers in rubric, refrains in italic. Wrap a line in *asterisks* to italicize it. */
export function Stanzas({ stanzas, className = '' }: { stanzas: Stanza[]; className?: string }) {
  if (!stanzas.length) return null
  return (
    <div className={`flex flex-col gap-[22px] py-2 ${className}`}>
      {stanzas.map((s, i) => {
        const lines = (s.lines ?? '').split('\n')
        return (
          <div key={`${s.number}-${i}`} className="flex gap-4">
            <div className="w-5 shrink-0 text-[21px] leading-[1.5] text-rubric" aria-hidden={s.refrain ? undefined : true}>
              {s.refrain ? <span aria-label="Refrain">℟</span> : s.number}
            </div>
            <p className={`stanza ${s.refrain ? 'italic' : ''}`}>
              {s.refrain ? null : <span className="sr-only">Stanza {s.number}. </span>}
              {lines.map((l, j) => (
                <span key={j}>
                  <Line text={l} />
                  {j < lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export function pickStanzas(all: Stanza[] | undefined, numbers: number[] | undefined): Stanza[] {
  if (!all?.length) return []
  if (!numbers?.length) return all.slice(0, 1)
  return numbers.map((n) => all.find((s) => s.number === n)).filter((s): s is Stanza => Boolean(s))
}
