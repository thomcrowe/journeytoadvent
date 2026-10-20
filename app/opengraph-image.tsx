import { ImageResponse } from 'next/og'
import { OG_SIZE, OgCard } from '@/lib/og/card'
import { ogFonts } from '@/lib/og/fonts'

export const alt = 'Journey to Advent: a hymn a day from the First Sunday of Advent to Christmas Eve'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(<OgCard label="A hymn a day" title="From the First Sunday of Advent to Christmas Eve" />, { ...size, fonts: await ogFonts() })
}
