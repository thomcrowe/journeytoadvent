import { connection } from 'next/server'
import { clients } from '@/sanity/client'
import { dataset, projectId, sanityConfigured } from '@/sanity/env'
import { releaseDate, todayInChicago } from '@/lib/date'

// Setup check: which services are connected. Shows yes/no only, never secrets.
// Visit /api/status after changing environment variables in Vercel (and redeploying).
export async function GET() {
  await connection()
  const has = (name: string) => Boolean(process.env[name])

  let sanityContent: unknown = 'not configured'
  if (sanityConfigured && clients) {
    try {
      sanityContent = await clients.published.withConfig({ useCdn: false }).fetch<Record<string, number>>(
        '{"seasons": count(*[_type == "season"]), "entries": count(*[_type == "entry"]), "hymns": count(*[_type == "hymn"]), "entriesWithReflection": count(*[_type == "entry" && defined(reflection)])}',
      )
    } catch (err) {
      sanityContent = `error: ${err instanceof Error ? err.message : String(err)}`
    }
  }

  const status = {
    sanity: {
      connected: sanityConfigured,
      projectId: projectId || null,
      dataset,
      content: sanityContent,
      readTokenForPreview: has('SANITY_API_READ_TOKEN'),
      writeTokenForSeedAndEmailLog: has('SANITY_API_WRITE_TOKEN'),
      webhookSecret: has('SANITY_REVALIDATE_SECRET'),
      note: sanityConfigured ? undefined : 'Site is showing built-in sample content. Set NEXT_PUBLIC_SANITY_PROJECT_ID and redeploy.',
    },
    posthog: {
      key: has('NEXT_PUBLIC_POSTHOG_KEY'),
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com (default)',
      note: 'If key is true, open the site, then check Activity in PostHog: a $pageview should appear within a minute. Visitors with Do Not Track on are never tracked.',
    },
    email: {
      resendKey: has('RESEND_API_KEY'),
      segment: has('RESEND_SEGMENT_ID') || has('RESEND_AUDIENCE_ID'),
      from: process.env.EMAIL_FROM || null,
      subscribeSecret: has('SUBSCRIBE_SECRET'),
      testAddress: has('EMAIL_TEST_TO'),
    },
    cron: { secret: has('CRON_SECRET') },
    site: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://journeytoadvent.com (default)',
      environment: process.env.VERCEL_ENV || 'local',
      todayInChicago: todayInChicago(),
      releaseDate: releaseDate(),
      dateOverrideActive: releaseDate() !== todayInChicago(),
    },
  }
  return Response.json(status, { headers: { 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } })
}
