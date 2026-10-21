'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { track, type AnalyticsEvent } from '@/lib/analytics'

export function TrackOnMount({ event, properties }: { event: AnalyticsEvent; properties?: Record<string, unknown> }) {
  const key = JSON.stringify(properties ?? {})
  useEffect(() => {
    track(event, JSON.parse(key))
  }, [event, key])
  return null
}

export function TrackedLink({ event, properties, ...props }: React.ComponentProps<typeof Link> & { event: AnalyticsEvent; properties?: Record<string, unknown> }) {
  return <Link {...props} onClick={() => track(event, properties)} />
}

/** Fires once when this point on the page scrolls into view (e.g. the end of a reflection). */
export function TrackWhenVisible({ event, properties }: { event: AnalyticsEvent; properties?: Record<string, unknown> }) {
  const ref = useRef<HTMLDivElement>(null)
  const key = JSON.stringify(properties ?? {})
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track(event, JSON.parse(key))
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [event, key])
  return <div ref={ref} aria-hidden="true" />
}
