import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = { title: 'Confirm your subscription', robots: { index: false } }

// The confirmation email links here. Confirming takes a button press (a POST) so
// that email link scanners can't subscribe someone by prefetching the link.
export default function ConfirmPage({ searchParams }: PageProps<'/subscribe/confirm'>) {
  return (
    <div className="measure flex flex-col gap-6 pb-8 pt-10 sm:pt-14">
      <p className="label label-rubric">One more step</p>
      <h1 className="text-[40px] font-medium leading-[1.05] sm:text-[52px]">Confirm your subscription</h1>
      <Suspense fallback={<p className="reading text-ink-muted">One moment…</p>}>
        <ConfirmForm searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function ConfirmForm({ searchParams }: Pick<PageProps<'/subscribe/confirm'>, 'searchParams'>) {
  const { token } = await searchParams
  const t = typeof token === 'string' ? token : ''
  if (!t) return <p className="reading">This confirmation link is missing its code. Please use the link in your email, or subscribe again.</p>
  return (
    <form action="/api/subscribe/confirm" method="POST" className="flex flex-col items-start gap-4">
      <input type="hidden" name="token" value={t} />
      <p className="reading">Press the button to start receiving Journey to Advent each morning.</p>
      <button type="submit" className="btn-rubric cursor-pointer border-0 px-6 py-3.5">
        Confirm my subscription
      </button>
    </form>
  )
}
