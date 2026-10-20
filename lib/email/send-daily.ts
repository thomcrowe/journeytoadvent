import 'server-only'
import { getEntryByDate } from '@/lib/content'
import { releaseDate } from '@/lib/date'
import { writeClient } from '@/sanity/write-client'
import { buildDailyEmail } from './daily'
import { emailFrom, resend, segmentId } from './resend'

type Result = { ok: boolean; status: string; date: string; detail?: unknown }

const STALE_LOCK_MS = 30 * 60_000

/** Take the per-day send lock in Sanity. Returns false if today's email is sent or in flight. */
async function acquireLock(date: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const id = `emailLog-${date}`
  const now = new Date().toISOString()
  try {
    await writeClient!.create({ _id: id, _type: 'emailLog', date, status: 'sending', updatedAt: now })
    return { ok: true }
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode !== 409) throw err
  }
  const existing = await writeClient!.getDocument<{ _rev: string; status?: string; updatedAt?: string }>(id)
  if (!existing) return { ok: false, reason: 'lock vanished' }
  if (existing.status === 'sent') return { ok: false, reason: 'already sent' }
  if (existing.status === 'sending' && Date.now() - Date.parse(existing.updatedAt ?? now) < STALE_LOCK_MS) {
    return { ok: false, reason: 'send in progress' }
  }
  // A failed or stale attempt: retake the lock, but only if no one else did first.
  await writeClient!.patch(id).ifRevisionId(existing._rev).set({ status: 'sending', updatedAt: now, error: null }).commit()
  return { ok: true }
}

async function markLog(date: string, fields: Record<string, unknown>) {
  await writeClient!.patch(`emailLog-${date}`).set({ ...fields, updatedAt: new Date().toISOString() }).commit()
}

export async function sendDailyEmail({ dryRun = false }: { dryRun?: boolean } = {}): Promise<Result> {
  const date = releaseDate()
  if (!resend) return { ok: false, status: 'resend-not-configured', date }

  const entry = await getEntryByDate(date)
  if (!entry) return { ok: true, status: 'no-entry-today', date }

  const email = await buildDailyEmail(entry)

  if (dryRun) {
    const to = process.env.EMAIL_TEST_TO
    if (!to) return { ok: false, status: 'EMAIL_TEST_TO-not-set', date }
    const { data, error } = await resend.emails.send({ from: emailFrom, to, subject: `[Test] ${email.subject}`, html: email.html, text: email.text })
    return { ok: !error, status: error ? 'dry-run-failed' : 'dry-run-sent', date, detail: error ?? data }
  }

  if (!segmentId) return { ok: false, status: 'RESEND_SEGMENT_ID-not-set', date }
  if (!writeClient) return { ok: false, status: 'SANITY_API_WRITE_TOKEN-not-set (needed to prevent double sends)', date }

  const lock = await acquireLock(date)
  if (!lock.ok) return { ok: true, status: `skipped: ${lock.reason}`, date }

  try {
    const { data, error } = await resend.broadcasts.create(
      {
        segmentId,
        from: emailFrom,
        subject: email.subject,
        previewText: email.previewText,
        html: email.html,
        text: email.text,
        name: `Journey to Advent · ${date}`,
        send: true,
      },
      // Belt and braces: the Sanity lock above is the real guard against double sends.
      { headers: { 'Idempotency-Key': `jta-daily-${date}` } },
    )
    if (error || !data) throw new Error(error?.message ?? 'No broadcast returned')
    await markLog(date, { status: 'sent', broadcastId: data.id })
    return { ok: true, status: 'sent', date, detail: { broadcastId: data.id } }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await markLog(date, { status: 'failed', error: message }).catch(() => undefined)
    return { ok: false, status: 'failed', date, detail: message }
  }
}
