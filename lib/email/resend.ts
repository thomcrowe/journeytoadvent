import 'server-only'
import { Resend } from 'resend'

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const emailFrom = process.env.EMAIL_FROM || 'Journey to Advent <hello@journeytoadvent.com>'

/**
 * Resend replaced Audiences with Segments. Set RESEND_SEGMENT_ID; the older
 * RESEND_AUDIENCE_ID still works as a fallback.
 */
export const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID || ''
