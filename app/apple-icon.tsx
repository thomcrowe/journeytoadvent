import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Monogram: italic J in a rubric-red square.
export default async function AppleIcon() {
  const italic = await readFile(join(process.cwd(), 'assets/fonts/EBGaramond-Italic.ttf'))
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#A3271F', color: '#FBF8F1', fontSize: 140, fontStyle: 'italic', fontFamily: 'EB Garamond', paddingTop: 10 }}>J</div>,
    { ...size, fonts: [{ name: 'EB Garamond', data: italic, style: 'italic', weight: 400 }] },
  )
}
