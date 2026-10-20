import { ImageResponse } from 'next/og'
import { getEntry, getToday } from '@/lib/content'
import { isReleased } from '@/lib/date'
import { OG_SIZE, OgCard } from '@/lib/og/card'
import { ogFonts } from '@/lib/og/fonts'

export const alt = 'Journey to Advent'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ year: string; n: string }> }) {
  const { year, n } = await params
  const [entry, today] = await Promise.all([getEntry(Number(year), Number(n)), getToday()])
  const fonts = await ogFonts()
  // Never reveal an unreleased hymn in a share image.
  if (!entry || !isReleased(entry.date, today)) {
    return new ImageResponse(<OgCard label="A hymn a day" title="Journey to Advent" />, { ...size, fonts })
  }
  return new ImageResponse(
    <OgCard label={[`Day ${entry.dayNumber}`, entry.liturgicalLabel].filter(Boolean).join(' · ')} title={entry.hymn.title} subtitle={entry.hymn.tune ? `Tune: ${entry.hymn.tune}` : undefined} />,
    { ...size, fonts },
  )
}
