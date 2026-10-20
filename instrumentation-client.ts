import { setCapture } from '@/lib/analytics'

// PostHog: page views and the events in lib/analytics.ts. Loaded only when a key
// is set and Do Not Track is off, and after the page is idle so it never competes
// with reading. Session recording and autocapture are off.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
const dnt = typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1')
const inStudio = typeof location !== 'undefined' && location.pathname.startsWith('/studio')

if (key && !dnt && !inStudio) {
  const load = () =>
    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        defaults: '2025-05-24',
        respect_dnt: true,
        disable_session_recording: true,
        autocapture: false,
        capture_pageview: 'history_change',
        persistence: 'localStorage+cookie',
      })
      setCapture((event, properties) => posthog.capture(event, properties))
    })
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 4000 })
  else setTimeout(load, 2000)
}
