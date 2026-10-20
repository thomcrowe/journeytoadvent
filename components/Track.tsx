'use client'

import Link from 'next/link'
import { useEffect } from 'react'
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
