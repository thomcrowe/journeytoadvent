import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { TrackOnMount } from '@/components/Track'

export const metadata: Metadata = { title: 'Subscribed', robots: { index: false } }

const MESSAGES: Record<string, { title: string; body: string }> = {
  ok: { title: 'You’re on the journey', body: 'Your subscription is confirmed. Look for a welcome email now, and the first hymn at five in the morning on the First Sunday of Advent.' },
  invalid: { title: 'That link didn’t work', body: 'This confirmation link is invalid or has expired. Please subscribe again and we’ll send a fresh one.' },
  error: { title: 'Something went wrong', body: 'We couldn’t confirm your subscription just now. Please try the link again in a few minutes.' },
}

export default function ConfirmedPage({ searchParams }: PageProps<'/subscribe/confirmed'>) {
  return (
    <div className="measure flex flex-col gap-6 pb-8 pt-10 sm:pt-14">
      <p className="label label-rubric">Subscription</p>
      <Suspense fallback={<h1 className="text-[40px] font-medium italic leading-[1.05] sm:text-[52px]">Subscription</h1>}>
        <Message searchParams={searchParams} />
      </Suspense>
      <p className="text-[19px]">
        <Link href="/">Go to today</Link> · <Link href="/about">About this journey</Link>
      </p>
    </div>
  )
}

async function Message({ searchParams }: Pick<PageProps<'/subscribe/confirmed'>, 'searchParams'>) {
  const { status } = await searchParams
  const key = typeof status === 'string' && status in MESSAGES ? status : 'ok'
  const m = MESSAGES[key]
  return (
    <>
      {key === 'ok' && <TrackOnMount event="subscribe_confirmed" />}
      <h1 className="text-[40px] font-medium italic leading-[1.05] sm:text-[52px]">{m.title}</h1>
      <p className="reading">{m.body}</p>
    </>
  )
}
