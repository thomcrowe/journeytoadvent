import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Journey to Advent collects, why, and what we never do with it.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <article className="measure flex flex-col gap-10 pb-8 pt-10 sm:pt-14">
      <header className="flex flex-col gap-5">
        <h1 className="text-[34px] font-medium leading-[1.1] sm:text-[44px]">Privacy</h1>
        <p className="reading">
          The short version: we don&rsquo;t sell, rent, or share your information with anyone. This site exists to help you pray through Advent, and that&rsquo;s all your information is used for.
        </p>
      </header>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">If you subscribe by email</h2>
        <p>
          We keep your email address so we can send you each day&rsquo;s hymn and reflection. That&rsquo;s the only thing we use it for. Emails are sent through Resend, an email delivery service, which stores your address on our behalf.
        </p>
        <p>
          Every email has an unsubscribe link. Click it and you won&rsquo;t hear from us again. If you&rsquo;d like your address deleted entirely, just reply to any email and ask.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">When you visit the site</h2>
        <p>
          Like most websites, we use simple analytics (Google Analytics and PostHog) to see how many people visit, which days they read, and whether the recordings play. This helps us know what&rsquo;s working. It doesn&rsquo;t tell us who you are, and we never use it for advertising.
        </p>
        <p>
          If your browser sends a &ldquo;Do Not Track&rdquo; signal, we respect it.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">Recordings</h2>
        <p>
          Hymn recordings are embedded from YouTube and load only when you press play. YouTube&rsquo;s own privacy policy applies once a video plays.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">Questions</h2>
        <p>
          If you have any questions about your information, reply to any of our emails and we&rsquo;ll be glad to help.
        </p>
      </section>

      <p className="text-[19px]">
        <Link href="/about">About this journey</Link> · <Link href="/subscribe">Subscribe by email</Link>
      </p>
    </article>
  )
}
