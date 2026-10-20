// Parses the Markdown export of a week of entries (build plan §10):
//
//   ## Day N · Weekday, Month D
//   ### Hymn Title
//   > stanzas (blank ">" line between stanzas), then "> — attribution"
//   **Read:** Mark 13:24–37
//   **Reflect**  …paragraphs…
//   **From the tradition**  > quote  > — Author, Source
//   **Carry this:** question
//   **Pray:** collect
//
// The parser is lenient about spacing, dashes, and whether a label's text sits
// on the same line or the next paragraph.

export interface ParsedStanza { number: number; lines: string; refrain: boolean }
export interface ParsedDay {
  day: number
  heading: string
  hymnTitle: string
  stanzas: ParsedStanza[]
  attribution?: string
  scriptureRef?: string
  reflection: string[]
  quote?: { text: string; author?: string; source?: string }
  question?: string
  collect?: string
}

const LABEL = /^\*\*(Read|Reflect|From the tradition|Carry this|Pray)\s*:?\s*\*\*\s*:?\s*(.*)$/i
const DASH = /^\s*(?:—|–|--)\s*/

function stripQuote(line: string) {
  return line.replace(/^>\s?/, '')
}

function parseStanzas(lines: string[]): { stanzas: ParsedStanza[]; attribution?: string } {
  const stanzas: ParsedStanza[] = []
  let attribution: string | undefined
  let current: string[] = []
  let auto = 1
  const flush = () => {
    if (!current.length) return
    let first = current[0]
    let number = auto
    const num = first.match(/^(?:\*\*(\d+)\*\*|(\d+)[.)]?)\s+/)
    if (num) {
      number = Number(num[1] ?? num[2])
      first = first.slice(num[0].length)
    }
    const body = [first, ...current.slice(1)].map((l) => l.replace(/\s*\\$/, '').replace(/\s{2,}$/, '').trim())
    const refrain = body.every((l) => /^(\*[^*]+\*|_[^_]+_)$/.test(l))
    stanzas.push({
      number: refrain ? 0 : number,
      lines: body.map((l) => l.replace(/^_([^_]+)_$/, '*$1*')).map((l) => (refrain ? l.replace(/^\*([^*]+)\*$/, '$1') : l)).join('\n'),
      refrain,
    })
    if (!refrain) auto = number + 1
    current = []
  }
  for (const raw of lines) {
    const line = stripQuote(raw).trimEnd()
    if (!line.trim()) {
      flush()
      continue
    }
    if (DASH.test(line)) {
      flush()
      attribution = line.replace(DASH, '').trim()
      continue
    }
    current.push(line)
  }
  flush()
  return { stanzas, attribution }
}

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function parseWeekMarkdown(md: string): ParsedDay[] {
  const sections = md.replace(/\r\n/g, '\n').split(/^##\s+(?!#)/m).slice(1)
  const days: ParsedDay[] = []
  for (const section of sections) {
    const [headingLine, ...rest] = section.split('\n')
    const dayMatch = headingLine.match(/Day\s+(\d+)/i)
    if (!dayMatch) continue
    const body = rest.join('\n')
    const titleMatch = body.match(/^###\s+(.+)$/m)
    const hymnTitle = titleMatch ? titleMatch[1].replace(/\*/g, '').trim() : ''

    // Split body into labelled chunks.
    const chunks: Record<string, string[]> = { _pre: [] }
    let key = '_pre'
    for (const line of (titleMatch ? body.slice(body.indexOf(titleMatch[0]) + titleMatch[0].length) : body).split('\n')) {
      const lm = line.trim().match(LABEL)
      if (lm) {
        key = lm[1].toLowerCase()
        chunks[key] = lm[2] ? [lm[2]] : []
        continue
      }
      ;(chunks[key] ??= []).push(line)
    }

    const quoteLines = chunks._pre.filter((l) => l.trim().startsWith('>') || l.trim() === '')
    const { stanzas, attribution } = parseStanzas(quoteLines)

    const text = (k: string) => (chunks[k] ?? []).join('\n').trim()

    let quote: ParsedDay['quote']
    const tradition = text('from the tradition')
    if (tradition) {
      const lines = tradition.split('\n').map(stripQuote).map((l) => l.trim()).filter(Boolean)
      const attrIdx = lines.findIndex((l) => DASH.test(l))
      const qText = (attrIdx >= 0 ? lines.slice(0, attrIdx) : lines).join(' ').replace(/^[“"]|[”"]$/g, '').trim()
      const attr = attrIdx >= 0 ? lines[attrIdx].replace(DASH, '').trim() : undefined
      let author: string | undefined
      let source: string | undefined
      if (attr) {
        const i = attr.indexOf(',')
        author = (i >= 0 ? attr.slice(0, i) : attr).trim()
        source = i >= 0 ? attr.slice(i + 1).replace(/\*/g, '').trim() : undefined
      }
      quote = { text: qText, author, source }
    }

    const collect = text('pray')
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\s*[*_]?Amen\.?[*_]?\s*$/i, '')
      .trim()

    days.push({
      day: Number(dayMatch[1]),
      heading: headingLine.trim(),
      hymnTitle,
      stanzas,
      attribution,
      scriptureRef: text('read').split('\n')[0]?.replace(/\*/g, '').trim() || undefined,
      reflection: paragraphs(text('reflect')),
      quote,
      question: text('carry this').replace(/\s*\n\s*/g, ' ').trim() || undefined,
      collect: collect || undefined,
    })
  }
  return days
}
