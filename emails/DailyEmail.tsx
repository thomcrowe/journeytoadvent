import { Button, Link, Section, Text } from 'react-email'
import { Shell } from './Shell'
import { c, font, s } from './theme'

export interface DailyEmailProps {
  siteUrl: string
  dayUrl: string
  dayLabel: string // "Day 1 of 26 · The First Sunday of Advent"
  dateLabel: string
  hymnTitle: string
  attribution?: string
  antiphon?: { latin?: string; english?: string }
  stanzas: { number: number; lines: string; refrain?: boolean }[]
  scriptureRef?: string
  scriptureUrl?: string
  reflection: string[] // paragraphs (inline *italics* allowed)
  quote?: { text?: string; author?: string; source?: string }
  question?: string
  collect?: string
  hasRecording?: boolean
}

function inline(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    /^\*[^*]+\*$/.test(part) ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>,
  )
}

export default function DailyEmail(p: DailyEmailProps) {
  return (
    <Shell preview={`${p.hymnTitle}${p.question ? ` · ${p.question}` : ''}`} siteUrl={p.siteUrl} unsubscribe>
      <Text style={s.labelRubric}>{p.dayLabel}</Text>
      <Text style={{ ...s.muted, margin: '0 0 6px', fontSize: '17px' }}>{p.dateLabel}</Text>
      <Text style={s.h1}>{p.hymnTitle}</Text>
      {p.attribution && <Text style={{ ...s.muted, fontStyle: 'italic', fontSize: '16px' }}>{p.attribution}</Text>}

      <Section style={{ margin: '8px 0 20px' }}>
        <Button href={p.dayUrl} style={s.button}>
          {p.hasRecording ? 'Listen and read on the web' : 'Read on the web'}
        </Button>
      </Section>

      {p.antiphon?.latin && (
        <Section style={{ borderLeft: `2px solid ${c.rubric}`, paddingLeft: '16px', margin: '0 0 20px' }}>
          <Text style={s.labelRubric}>The O Antiphon</Text>
          <Text style={{ ...s.text, fontStyle: 'italic', margin: '0 0 8px' }}>{p.antiphon.latin}</Text>
          {p.antiphon.english && <Text style={{ ...s.text, fontSize: '17px', margin: 0 }}>{p.antiphon.english}</Text>}
        </Section>
      )}

      {p.stanzas.map((st, i) => (
        <table key={i} role="presentation" cellPadding={0} cellSpacing={0} style={{ margin: '0 0 18px' }}>
          <tbody>
            <tr>
              <td style={{ width: '22px', verticalAlign: 'top', color: c.rubric, fontSize: '19px', fontFamily: font, lineHeight: '1.5' }}>{st.refrain ? '℟' : st.number}</td>
              <td style={{ fontSize: '19px', lineHeight: '1.5', fontFamily: font, color: c.ink, fontStyle: st.refrain ? 'italic' : 'normal' }}>
                {st.lines.split('\n').map((l, j, arr) => (
                  <span key={j}>
                    {/^\*.+\*$/.test(l) ? <em>{l.slice(1, -1)}</em> : l}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      ))}

      {p.scriptureRef && (
        <Text style={{ ...s.text, borderTop: `1px solid ${c.rule}`, borderBottom: `1px solid ${c.rule}`, padding: '12px 0' }}>
          <span style={{ ...s.label, fontSize: '13px' }}>Read&nbsp;&nbsp;</span>
          {p.scriptureUrl ? <Link href={p.scriptureUrl} style={s.link}>{p.scriptureRef}</Link> : p.scriptureRef}
        </Text>
      )}

      {p.reflection.length > 0 && (
        <>
          <Text style={{ ...s.label, marginTop: '8px' }}>Reflect</Text>
          {p.reflection.map((para, i) => (
            <Text key={i} style={s.text}>
              {i === 0 ? (
                <>
                  <span style={{ color: c.rubric, fontStyle: 'italic', fontSize: '28px', lineHeight: '1' }}>{para.charAt(0)}</span>
                  {inline(para.slice(1))}
                </>
              ) : (
                inline(para)
              )}
            </Text>
          ))}
        </>
      )}

      {p.quote?.text && (
        <Section style={{ backgroundColor: c.raised, border: `1px solid ${c.rule}`, padding: '18px 20px', margin: '8px 0 20px' }}>
          <Text style={s.label}>From the tradition</Text>
          <Text style={{ ...s.text, fontStyle: 'italic', fontSize: '21px', lineHeight: '1.45', margin: '0 0 8px' }}>“{p.quote.text}”</Text>
          <Text style={{ ...s.muted, margin: 0 }}>{[p.quote.author, p.quote.source].filter(Boolean).join(', ')}</Text>
        </Section>
      )}

      {p.question && (
        <Section style={{ borderTop: `2px solid ${c.rubric}`, paddingTop: '14px', margin: '0 0 20px' }}>
          <Text style={s.labelRubric}>Carry this</Text>
          <Text style={{ ...s.text, fontSize: '21px', lineHeight: '1.45' }}>{p.question}</Text>
        </Section>
      )}

      {p.collect && (
        <>
          <Text style={s.label}>Pray</Text>
          <Text style={{ ...s.text, fontStyle: 'italic' }}>
            {p.collect} <span style={{ color: c.rubric, fontStyle: 'normal' }}>Amen.</span>
          </Text>
        </>
      )}

      <Text style={s.muted}>
        <Link href={p.dayUrl} style={s.link}>Read on the web</Link>
        {p.hasRecording && (
          <>
            {' · '}
            <Link href={p.dayUrl} style={s.link}>Listen to the hymn</Link>
          </>
        )}
      </Text>
    </Shell>
  )
}

DailyEmail.PreviewProps = {
  siteUrl: 'https://journeytoadvent.com',
  dayUrl: 'https://journeytoadvent.com/2026/day/1',
  dayLabel: 'Day 1 of 26 · The First Sunday of Advent',
  dateLabel: 'Sunday, November 29, 2026',
  hymnTitle: 'Lo! He Comes with Clouds Descending',
  attribution: 'John Cennick; altered by Charles Wesley (1752, 1758) · Tune: Helmsley',
  stanzas: [{ number: 1, lines: 'Lo! he comes with clouds descending,\nonce for favored sinners slain;\nthousand thousand saints attending\nswell the triumph of his train:\n*Alleluia! Alleluia!*\nGod appears on earth to reign.' }],
  scriptureRef: 'Mark 13:24–37',
  reflection: ['Advent does not begin in Bethlehem. It begins at the end of the world.'],
  question: 'What would it look like to watch for him this week without fear?',
  collect: 'Almighty God, give us grace to cast away the works of darkness…',
} satisfies DailyEmailProps
