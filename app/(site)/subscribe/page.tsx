import type { Metadata } from 'next'
import { SubscribeForm } from '@/components/SubscribeForm'

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Get each day of Journey to Advent by email at five in the morning, Central time. Free, and you can leave any time.',
  alternates: { canonical: '/subscribe' },
}

export default function SubscribePage() {
  return (
    <div className="measure flex flex-col gap-6 pb-8 pt-10 sm:pt-14">
      <p className="label label-rubric">By email</p>
      <h1 className="text-[40px] font-medium italic leading-[1.05] sm:text-[52px]">A hymn in your inbox each morning</h1>
      <p className="reading">
        Each day of Advent arrives at 5:00 in the morning, Central time: the hymn, the Scripture, the reflection, the question, and the prayer. We&rsquo;ll send one email to confirm your address first. Free, and you can leave any time.
      </p>
      <SubscribeForm tone="light" source="subscribe-page" />
    </div>
  )
}
