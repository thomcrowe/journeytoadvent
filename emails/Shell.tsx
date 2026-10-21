import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from 'react-email'
import { c, s } from './theme'

export function Shell({ preview, children, siteUrl, unsubscribe = false }: { preview: string; children: React.ReactNode; siteUrl: string; unsubscribe?: boolean }) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={{ padding: '8px 0 20px', borderBottom: `1px solid ${c.rule}`, marginBottom: '28px' }}>
            <Link href={siteUrl} style={{ textDecoration: 'none', color: c.ink }}>
              <span style={{ fontSize: '13px', letterSpacing: '0.28em', textTransform: 'uppercase' }}>Journey to </span>
              <span style={{ fontSize: '28px', fontStyle: 'italic' }}>
                <span style={{ color: c.rubric }}>A</span>dvent
              </span>
            </Link>
          </Section>
          {children}
          <Hr style={s.hr} />
          <Text style={{ ...s.muted, fontSize: '14px' }}>
            Journey to Advent · Hymn texts in the public domain · Collects from the Book of Common Prayer (1979)
            {unsubscribe && (
              <>
                <br />
                <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={{ color: c.muted }}>
                  Unsubscribe
                </Link>
              </>
            )}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
