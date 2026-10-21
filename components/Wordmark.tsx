import Link from 'next/link'

export function Wordmark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  if (size === 'lg') {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[17px] uppercase tracking-[0.32em] sm:text-[22px]">Journey to</span>
        <span className="text-[84px] italic leading-[0.95] tracking-[-0.01em] sm:text-[132px]">
          <span className="text-rubric">A</span>dvent
        </span>
      </div>
    )
  }
  // Title-page wordmark: small spaced caps over large capitals, centered.
  return (
    <Link href="/" className="flex flex-col items-center text-ink no-underline hover:text-ink">
      <span className="text-[11px] uppercase tracking-[0.42em] text-ink-muted sm:text-[13px]">Journey to</span>
      <span className="text-[30px] font-medium uppercase leading-[1.1] tracking-[0.14em] sm:text-[40px]">
        <span className="text-rubric">A</span>dvent
      </span>
    </Link>
  )
}

export function Monogram({ filled = false, size = 88 }: { filled?: boolean; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className={filled ? 'inline-flex items-center justify-center bg-rubric text-paper' : 'inline-flex items-center justify-center border-[1.5px] border-rubric text-rubric'}
      style={{ width: size, height: size, fontSize: size * 0.72, lineHeight: 1 }}
    >
      <span className="italic">J</span>
    </span>
  )
}
