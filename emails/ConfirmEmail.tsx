import { Button, Section, Text } from '@react-email/components'
import { Shell } from './Shell'
import { s } from './theme'

export default function ConfirmEmail({ siteUrl, confirmUrl }: { siteUrl: string; confirmUrl: string }) {
  return (
    <Shell preview="Confirm your subscription to Journey to Advent" siteUrl={siteUrl}>
      <Text style={s.h1}>Confirm your subscription</Text>
      <Text style={s.text}>Someone (we hope you) asked to receive Journey to Advent by email: one hymn each morning from the First Sunday of Advent to Christmas Eve.</Text>
      <Section style={{ margin: '8px 0 24px' }}>
        <Button href={confirmUrl} style={s.button}>
          Confirm my subscription
        </Button>
      </Section>
      <Text style={s.muted}>If you didn&rsquo;t ask for this, ignore this email and nothing will happen. The link works for seven days.</Text>
    </Shell>
  )
}

ConfirmEmail.PreviewProps = { siteUrl: 'https://journeytoadvent.com', confirmUrl: 'https://journeytoadvent.com/subscribe/confirm?token=example' }
