// Shared OG artwork: paper background, day label in rubric red, title in Garamond, wordmark.
export const OG_SIZE = { width: 1200, height: 630 }

export function OgCard({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  const long = title.length > 34
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#FBF8F1', color: '#1F1B16', padding: '64px 80px', fontFamily: 'EB Garamond', borderLeft: '16px solid #A3271F' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: 'uppercase' }}>Journey to</div>
        <div style={{ fontSize: 46, fontStyle: 'italic', display: 'flex' }}>
          <span style={{ color: '#A3271F' }}>A</span>dvent
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {label && <div style={{ fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: '#A3271F' }}>{label}</div>}
        <div style={{ fontSize: long ? 76 : 96, lineHeight: 1.04, fontWeight: 500 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 30, fontStyle: 'italic', color: '#6B6257' }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', height: 2, background: '#D9D0C1' }} />
    </div>
  )
}
