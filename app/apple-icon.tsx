import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Lit violet Advent candle, matching app/icon.svg.
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#FBF8F1' }}>
      <svg width="180" height="180" viewBox="0 0 64 64">
        <path d="M32 4 C40 14 45 20 32 32 C19 20 24 14 32 4 Z" fill="#D9932F" />
        <path d="M32 16 C36 21 37 24 32 30 C27 24 28 21 32 16 Z" fill="#F6D58A" />
        <rect x="30.5" y="30" width="3" height="4" fill="#1F1B16" />
        <rect x="20" y="34" width="24" height="26" rx="2" fill="#5B3A6E" />
      </svg>
    </div>,
    size,
  )
}
