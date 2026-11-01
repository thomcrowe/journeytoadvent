// Shared OG artwork: paper background, wordmark, day label in rubric red, title
// in Garamond, and the four Advent candles on the right.
export const OG_SIZE = { width: 1200, height: 630 }

const PURPLE = '#5B3A6E'
const ROSE = '#C97A92'
// Lit in order: week 1, week 2, week 3 (Gaudete, rose), week 4.
const CANDLES = [PURPLE, PURPLE, ROSE, PURPLE]
const HEIGHTS = [250, 230, 210, 190]

function Candles({ lit }: { lit: number }) {
  const w = 300
  const h = 400
  const cw = 44
  const gap = (w - cw * 4) / 3
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {CANDLES.map((color, i) => {
        const x = i * (cw + gap)
        const top = h - 30 - HEIGHTS[i]
        const cx = x + cw / 2
        const on = i < lit
        return (
          <g key={i}>
            {on && <path d={`M${cx} ${top - 70} C${cx + 18} ${top - 44} ${cx + 22} ${top - 24} ${cx} ${top - 6} C${cx - 22} ${top - 24} ${cx - 18} ${top - 44} ${cx} ${top - 70} Z`} fill="#D9932F" />}
            {on && <path d={`M${cx} ${top - 46} C${cx + 8} ${top - 34} ${cx + 9} ${top - 24} ${cx} ${top - 12} C${cx - 9} ${top - 24} ${cx - 8} ${top - 34} ${cx} ${top - 46} Z`} fill="#F6D58A" />}
            <rect x={cx - 1.5} y={top - 12} width={3} height={12} fill="#1F1B16" />
            <rect x={x} y={top} width={cw} height={HEIGHTS[i]} rx={3} fill={color} />
          </g>
        )
      })}
      <rect x={0} y={h - 30} width={w} height={12} rx={6} fill="#4F6B3A" />
    </svg>
  )
}

export function OgCard({ label, title, subtitle, lit = 4 }: { label?: string; title: string; subtitle?: string; lit?: number }) {
  const long = title.length > 34
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, background: '#FBF8F1', color: '#1F1B16', padding: '64px 80px', fontFamily: 'EB Garamond', borderLeft: '16px solid #A3271F' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: 'uppercase' }}>Journey to</div>
          <div style={{ fontSize: 46, fontStyle: 'italic', display: 'flex' }}>
            <span style={{ color: '#A3271F' }}>A</span>dvent
          </div>
        </div>
        <div style={{ display: 'flex', height: 2, width: 120, background: '#D9D0C1' }} />
        {label && <div style={{ fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: '#A3271F' }}>{label}</div>}
        <div style={{ fontSize: long ? 64 : 84, lineHeight: 1.06, fontWeight: 500 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 30, fontStyle: 'italic', color: '#6B6257' }}>{subtitle}</div>}
      </div>
      <Candles lit={lit} />
    </div>
  )
}
