import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

// Signed, expiring confirmation tokens for double opt-in. Nothing is stored
// until the subscriber confirms.

const TTL_SECONDS = 60 * 60 * 24 * 7

function secret() {
  const s = process.env.SUBSCRIBE_SECRET || process.env.CRON_SECRET
  if (s) return s
  if (process.env.NODE_ENV !== 'production') return 'dev-only-subscribe-secret'
  throw new Error('SUBSCRIBE_SECRET is not set')
}

const b64 = (s: string | Buffer) => Buffer.from(s).toString('base64url')
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export function createToken(email: string, now = Date.now()) {
  const payload = b64(JSON.stringify({ e: email, x: Math.floor(now / 1000) + TTL_SECONDS }))
  return `${payload}.${sign(payload)}`
}

export function verifyToken(token: string, now = Date.now()): string | null {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { e: string; x: number }
    if (typeof e !== 'string' || typeof x !== 'number' || x * 1000 < now) return null
    return e
  } catch {
    return null
  }
}
