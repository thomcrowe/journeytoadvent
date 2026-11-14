import { verifyUnsubscribeToken } from '@/lib/email/token'
import { resend } from '@/lib/email/resend'

function back(request: Request, status: 'done' | 'invalid' | 'error') {
  return Response.redirect(new URL(`/unsubscribe?status=${status}`, request.url), 303)
}

// The form on /unsubscribe posts here. Mail apps' one-click unsubscribe
// (List-Unsubscribe-Post) posts here too, with the token in the query string.
export async function POST(request: Request) {
  const url = new URL(request.url)
  const form = await request.formData().catch(() => null)
  const token = form?.get('token') ?? url.searchParams.get('token')
  const email = typeof token === 'string' ? verifyUnsubscribeToken(token) : null
  if (!email) return back(request, 'invalid')
  if (!resend) return back(request, 'error')
  const { error } = await resend.contacts.update({ email, unsubscribed: true })
  if (error) {
    console.error('[unsubscribe] update failed', error)
    return back(request, 'error')
  }
  return back(request, 'done')
}
