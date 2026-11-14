import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false } }

const MESSAGES: Record<string, { title: string; body: string }> = {
  done: { title: 'You’re unsubscribed', body: 'You won’t get any more emails from Journey to Advent. The daily hymns stay on the site whenever you want them.' },
  invalid: { title: 'That link didn’t work', body: 'This unsubscribe link is invalid. Please use the link in your most recent email.' },
  error: { title: 'Something went wrong', body: 'We couldn’t unsubscribe you just now. Please try the link again in a few minutes.' },
}

// Unsubscribing takes a button press (a POST) so email link scanners can't
// unsubscribe someone by prefetching the link.
export default function UnsubscribePage({ searchParams }: PageProps<'/unsubscribe'>) {
  return (
    <div className="measure flex flex-col gap-6 pb-8 pt-10 sm:pt-14">
      <p className="label label-rubric">Subscription</p>
      <Suspense fallback={<p className="reading text-ink-muted">One moment…</p>}>
        <Body searchParams={searchParams} />
      </Suspense>
      <p className="text-[19px]">
        <Link href="/">Go to today</Link>
      </p>
    </div>
  )
}

async function Body({ searchParams }: Pick<PageProps<'/unsubscribe'>, 'searchParams'>) {
  const { token, status } = await searchParams
  if (typeof status === 'string' && status in MESSAGES) {
    const m = MESSAGES[status]
    return (
      <>
        <h1 className="text-[40px] font-medium italic leading-[1.05] sm:text-[52px]">{m.title}</h1>
        <p className="reading">{m.body}</p>
      </>
    )
  }
  const t = typeof token === 'string' ? token : ''
  if (!t) return <p className="reading">{MESSAGES.invalid.body}</p>
  return (
    <>
      <h1 className="text-[40px] font-medium leading-[1.05] sm:text-[52px]">Unsubscribe</h1>
      <form action="/api/unsubscribe" method="POST" className="flex flex-col items-start gap-4">
        <input type="hidden" name="token" value={t} />
        <p className="reading">Press the button and you won’t get any more emails from Journey to Advent.</p>
        <button type="submit" className="btn-rubric cursor-pointer border-0 px-6 py-3.5">
          Unsubscribe
        </button>
      </form>
    </>
  )
}
