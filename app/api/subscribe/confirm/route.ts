import { render } from '@react-email/components'
import WelcomeEmail from '@/emails/WelcomeEmail'
import { getCurrentSeason } from '@/lib/content'
import { daysBetween, formatLong, releaseDate } from '@/lib/date'
import { verifyToken } from '@/lib/email/token'
import { emailFrom, resend, segmentId } from '@/lib/email/resend'
import { absoluteUrl, dayPath, site } from '@/lib/site'

function back(request: Request, status: 'ok' | 'invalid' | 'error') {
  return Response.redirect(new URL(`/subscribe/confirmed?status=${status}`, request.url), 303)
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const token = form?.get('token')
  const email = typeof token === 'string' ? verifyToken(token) : null
  if (!email) return back(request, 'invalid')

  if (!resend || !segmentId) {
    console.info(`[confirm] Resend not configured; would add ${email}`)
    return back(request, process.env.NODE_ENV === 'production' ? 'error' : 'ok')
  }

  const created = await resend.contacts.create({ email, unsubscribed: false, segments: [{ id: segmentId }] })
  if (created.error) {
    // Already a contact: make sure they're subscribed and in the segment.
    const existing = await resend.contacts.update({ email, unsubscribed: false })
    if (existing.error) {
      console.error('[confirm] contact create/update failed', created.error, existing.error)
      return back(request, 'error')
    }
    await resend.contacts.segments.add({ email, segmentId }).catch(() => undefined)
  }

  // Welcome email. Mid-season subscribers get links to today and the calendar.
  try {
    const season = await getCurrentSeason()
    const today = releaseDate()
    const during = season && today >= season.startDate && today <= season.endDate
    const html = await render(
      WelcomeEmail({
        siteUrl: site.url,
        startLabel: season ? formatLong(season.startDate).replace(/, \d{4}$/, '') : 'the First Sunday of Advent',
        midSeason: during
          ? {
              dayNumber: daysBetween(season.startDate, today) + 1,
              dayUrl: absoluteUrl(dayPath(season.year, daysBetween(season.startDate, today) + 1)),
              seasonUrl: absoluteUrl(`/${season.year}`),
            }
          : undefined,
      }),
    )
    await resend.emails.send({ from: emailFrom, to: email, subject: 'Welcome to Journey to Advent', html })
  } catch (err) {
    console.error('[confirm] welcome email failed', err)
  }

  return back(request, 'ok')
}
