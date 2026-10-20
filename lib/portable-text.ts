// Minimal Markdown-inline → Portable Text conversion, shared by the seed script
// and the fallback content. Handles *italic*, _italic_, **bold**, [links](url).

export interface PTSpan { _type: 'span'; _key: string; text: string; marks: string[] }
export interface PTBlock {
  _type: 'block'
  _key: string
  style: string
  markDefs: { _type: 'link'; _key: string; href: string }[]
  children: PTSpan[]
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0).toString(36)
}

export function inlineToBlock(text: string, key: string, style = 'normal'): PTBlock {
  const markDefs: PTBlock['markDefs'] = []
  const children: PTSpan[] = []
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|\[([^\]]+)\]\(([^)\s]+)\))/g
  let last = 0
  let m: RegExpExecArray | null
  let n = 0
  const push = (t: string, marks: string[]) => {
    if (t) children.push({ _type: 'span', _key: `${key}s${n++}`, text: t, marks })
  }
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index), [])
    if (m[2]) push(m[2], ['strong'])
    else if (m[3] || m[4]) push(m[3] ?? m[4], ['em'])
    else if (m[5]) {
      const lk = `${key}l${markDefs.length}`
      markDefs.push({ _type: 'link', _key: lk, href: m[6] })
      push(m[5], [lk])
    }
    last = m.index + m[0].length
  }
  push(text.slice(last), [])
  if (!children.length) push('', [])
  return { _type: 'block', _key: key, style, markDefs, children }
}

export function paragraphsToBlocks(paragraphs: string[], keyPrefix = 'p'): PTBlock[] {
  return paragraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => inlineToBlock(p.replace(/\s*\n\s*/g, ' '), `${keyPrefix}${i}${hash(p).slice(0, 4)}`))
}

export function blocksToPlainText(blocks: { children?: { text?: string }[] }[] | undefined | null): string {
  if (!blocks) return ''
  return blocks.map((b) => (b.children ?? []).map((c) => c.text ?? '').join('')).join('\n\n')
}
