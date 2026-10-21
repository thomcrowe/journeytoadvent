// Email styles: the Hymnal look with inline styles and a Georgia fallback.
export const c = {
  paper: '#FBF8F1',
  raised: '#FFFDF8',
  ink: '#1F1B16',
  muted: '#6B6257',
  rubric: '#A3271F',
  sarum: '#3D4A6B',
  rule: '#D9D0C1',
}

export const font = "'EB Garamond', Garamond, Georgia, 'Times New Roman', serif"

export const s = {
  body: { backgroundColor: c.paper, color: c.ink, fontFamily: font, margin: 0, padding: '24px 0' },
  container: { maxWidth: '600px', margin: '0 auto', padding: '0 20px' },
  label: { fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: c.muted, margin: '0 0 8px' },
  labelRubric: { fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: c.rubric, margin: '0 0 8px' },
  h1: { fontSize: '34px', lineHeight: '1.1', fontWeight: 500, margin: '0 0 8px', color: c.ink, fontFamily: font },
  text: { fontSize: '19px', lineHeight: '1.6', margin: '0 0 16px', color: c.ink, fontFamily: font },
  muted: { fontSize: '16px', lineHeight: '1.5', color: c.muted, margin: '0 0 16px', fontFamily: font },
  hr: { borderTop: `1px solid ${c.rule}`, margin: '24px 0' },
  button: { backgroundColor: c.rubric, color: c.paper, padding: '12px 20px', fontSize: '15px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, textDecoration: 'none', fontFamily: font },
  link: { color: c.rubric },
}
