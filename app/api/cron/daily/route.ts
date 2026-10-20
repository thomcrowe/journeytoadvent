import { revalidateTag } from 'next/cache'
import { after, type NextRequest } from 'next/server'
import { getCurrentSeason } from '@/lib/content'
import { daysBetween, releaseDate } from '@/lib/date'
import { sendDailyEmail } from '@/lib/email/send-daily'
import { dayPath, site } from '@/lib/site'

// Vercel Cron (vercel.json):
//   06:05 UTC  ?task=revalidate  → unlock today's entry just after midnight Central
//   11:00 UTC  ?task=email       → send today's email at 5:00 AM Central
// Vercel sends "Authorization: Bearer $CRON_SECRET" automatically.

export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const task = request.nextUrl.searchParams.get('task')

  if (task === 'revalidate') {
    revalidateTag('release-clock', { expire: 0 })
    // Warm the pages that just changed so the first reader isn't kept waiting.
    // Runs after this response, once the tag invalidation has been applied.
    const season = await getCurrentSeason()
    const today = releaseDate()
    const paths = ['/', '/hymns']
    if (season) {
      paths.push(`/${season.year}`)
      if (today >= season.startDate && today <= season.endDate) paths.push(dayPath(season.year, daysBetween(season.startDate, today) + 1))
    }
    const origin = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : site.url
    after(async () => {
      const results = await Promise.allSettled(paths.map((p) => fetch(new URL(p, origin), { cache: 'no-store', signal: AbortSignal.timeout(15_000) }).then((r) => `${p} ${r.status}`)))
      console.info('[cron] warmed', results.map((r) => (r.status === 'fulfilled' ? r.value : String(r.reason))))
    })
    return Response.json({ ok: true, task, today, warming: paths })
  }

  if (task === 'email') {
    const result = await sendDailyEmail({ dryRun: request.nextUrl.searchParams.get('dryRun') === '1' })
    return Response.json(result, { status: result.ok ? 200 : 500 })
  }

  return Response.json({ error: 'Unknown task. Use ?task=revalidate or ?task=email' }, { status: 400 })
}
