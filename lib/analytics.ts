export type AnalyticsEvent =
  | 'entry_viewed'
  | 'recording_played'
  | 'subscribe_submitted'
  | 'subscribe_confirmed'
  | 'share_clicked'
  | 'next_day_clicked'
  | 'entry_finished'

type Capture = (event: string, properties?: Record<string, unknown>) => void

// PostHog loads lazily (see instrumentation-client.ts), so events fired before
// it's ready are queued and flushed once it loads.
const queue: [AnalyticsEvent, Record<string, unknown> | undefined][] = []
let capture: Capture | null = null

export function setCapture(fn: Capture) {
  capture = fn
  for (const [e, p] of queue.splice(0)) fn(e, p)
}

// Google Analytics names for our events. sign_up and share are GA's own
// recommended names, so they show up in its standard reports.
const GA_NAMES: Record<AnalyticsEvent, string> = {
  entry_viewed: 'entry_viewed',
  recording_played: 'recording_played',
  subscribe_submitted: 'subscribe_submitted',
  subscribe_confirmed: 'sign_up',
  share_clicked: 'share',
  next_day_clicked: 'next_day_clicked',
  entry_finished: 'entry_finished',
}

const snake = (k: string) => k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)

/** Sends the event to Google Analytics, if it loaded (it doesn't under Do Not Track). */
function sendToGa(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  const gtag = typeof window !== 'undefined' ? (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag : undefined
  if (!gtag) return
  const params: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(properties ?? {})) params[snake(k)] = v
  if (event === 'subscribe_confirmed') params.method = 'email'
  gtag('event', GA_NAMES[event], params)
}

/** Client-side event capture for PostHog and Google Analytics. Both skip readers who send Do Not Track. */
export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  try {
    sendToGa(event, properties)
  } catch {
    /* analytics must never break the page */
  }
  try {
    if (capture) capture(event, properties)
    else if (queue.length < 50) queue.push([event, properties])
  } catch {
    /* analytics must never break the page */
  }
}
