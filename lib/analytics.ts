export type AnalyticsEvent =
  | 'entry_viewed'
  | 'recording_played'
  | 'subscribe_submitted'
  | 'subscribe_confirmed'
  | 'share_clicked'
  | 'next_day_clicked'

type Capture = (event: string, properties?: Record<string, unknown>) => void

// PostHog loads lazily (see instrumentation-client.ts), so events fired before
// it's ready are queued and flushed once it loads.
const queue: [AnalyticsEvent, Record<string, unknown> | undefined][] = []
let capture: Capture | null = null

export function setCapture(fn: Capture) {
  capture = fn
  for (const [e, p] of queue.splice(0)) fn(e, p)
}

/** Client-side event capture. A no-op when PostHog isn't configured or Do Not Track is on. */
export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  try {
    if (capture) capture(event, properties)
    else if (queue.length < 50) queue.push([event, properties])
  } catch {
    /* analytics must never break the page */
  }
}
