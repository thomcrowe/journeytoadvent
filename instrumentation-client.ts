import { setCapture } from '@/lib/analytics'

// PostHog, set up like Google Analytics: page views, time on page and bounce
// rate (page leave), referrers and UTM campaigns, devices and countries (all
// automatic), clicks on links and buttons, plus the custom events in
// lib/analytics.ts. View it all under Web analytics in PostHog.
//
// Privacy: loads only when a key is set, never for visitors with Do Not Track
// on, never records sessions or anything typed into forms. Events go through
// /ingest on this site (see next.config.ts) so ad blockers don't drop them.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
const dnt = typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1')
const inStudio = typeof location !== 'undefined' && location.pathname.startsWith('/studio')

if (key && !dnt && !inStudio) {
  const load = () =>
    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: '/ingest',
        ui_host: host.includes('eu.') ? 'https://eu.posthog.com' : 'https://us.posthog.com',
        defaults: '2025-05-24',
        capture_pageview: 'history_change',
        capture_pageleave: true,
        autocapture: { dom_event_allowlist: ['click'], element_allowlist: ['a', 'button'] },
        rageclick: false,
        disable_session_recording: true,
        person_profiles: 'identified_only',
        respect_dnt: true,
        persistence: 'localStorage+cookie',
      })
      setCapture((event, properties) => posthog.capture(event, properties))
    })
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 2000 })
  else setTimeout(load, 1000)
}
