// All release logic runs on America/Chicago calendar dates (YYYY-MM-DD strings).

export const TIME_ZONE = 'America/Chicago'

const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' })

/** Today's date in Chicago as YYYY-MM-DD. */
export function todayInChicago(now: Date = new Date()): string {
  return ymd.format(now)
}

/**
 * The date used for release checks. RELEASE_DATE_OVERRIDE (YYYY-MM-DD) lets you
 * time-travel in local dev and preview deployments; it is ignored in production.
 */
export function releaseDate(now: Date = new Date()): string {
  const override = process.env.RELEASE_DATE_OVERRIDE
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override) && process.env.VERCEL_ENV !== 'production') {
    return override
  }
  return todayInChicago(now)
}

export function isReleased(entryDate: string, today: string): boolean {
  return entryDate <= today
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000)
}

/** The UTC instant of midnight at the start of `date` in Chicago. */
export function chicagoMidnight(date: string): Date {
  for (const offset of [6, 5]) {
    const candidate = new Date(`${date}T${String(offset).padStart(2, '0')}:00:00Z`)
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: '2-digit', hourCycle: 'h23' }).format(candidate)
    if (parts === '00' && todayInChicago(candidate) === date) return candidate
  }
  return new Date(`${date}T06:00:00Z`)
}

const longFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
const shortFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })
const weekdayFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short' })
const monthDayFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric' })

const at = (date: string) => new Date(`${date}T12:00:00Z`)

/** "Sunday, November 29, 2026" */
export const formatLong = (date: string) => longFmt.format(at(date))
/** "Nov 29" */
export const formatShort = (date: string) => shortFmt.format(at(date))
/** "Sun" */
export const formatWeekday = (date: string) => weekdayFmt.format(at(date))
/** "November 29" */
export const formatMonthDay = (date: string) => monthDayFmt.format(at(date))
