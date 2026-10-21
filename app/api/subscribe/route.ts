import { render } from 'react-email'
import ConfirmEmail from '@/emails/ConfirmEmail'
import { createToken } from '@/lib/email/token'
import { emailFrom, resend } from '@/lib/email/resend'
import { rateLimit } from '@/lib/rate-limit'
import { absoluteUrl, site } from '@/lib/site'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  if (!rateLimit(`subscribe:${ip}`)) {
    return Response.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 })
  }

  let body: { email?: unknown; website?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const message = 'Almost there. Check your inbox for a link to confirm your subscription.'

  // Honeypot filled in: pretend it worked.
  if (typeof body.website === 'string' && body.website.trim() !== '') return Response.json({ message })

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!rateLimit(`subscribe-email:${email}`, 3, 60 * 60_000)) return Response.json({ message })

  const unavailable = () => Response.json({ error: 'Email sign-up isn’t available yet. Please try again soon.' }, { status: 503 })
  const isProd = process.env.NODE_ENV === 'production'
  if (isProd && (!resend || !(process.env.SUBSCRIBE_SECRET || process.env.CRON_SECRET))) return unavailable()

  const confirmUrl = absoluteUrl(`/subscribe/confirm?token=${encodeURIComponent(createToken(email))}`)

  if (!resend) {
    console.info(`[subscribe] RESEND_API_KEY not set. Confirmation link for ${email}: ${confirmUrl}`)
    return Response.json({ message })
  }

  const html = await render(ConfirmEmail({ siteUrl: site.url, confirmUrl }))
  const { error } = await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: 'Confirm your subscription to Journey to Advent',
    html,
    text: `Confirm your subscription to Journey to Advent:\n\n${confirmUrl}\n\nIf you didn't ask for this, ignore this email.`,
  })
  if (error) {
    console.error('[subscribe] confirmation send failed', error)
    return Response.json({ error: 'We couldn’t send the confirmation email. Please try again.' }, { status: 502 })
  }
  return Response.json({ message })
}
