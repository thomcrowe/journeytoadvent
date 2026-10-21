import { Link, Text } from 'react-email'
import { Shell } from './Shell'
import { s } from './theme'

export interface WelcomeEmailProps {
  siteUrl: string
  startLabel: string // "Sunday, November 29"
  midSeason?: { dayNumber: number; dayUrl: string; seasonUrl: string }
}

export default function WelcomeEmail({ siteUrl, startLabel, midSeason }: WelcomeEmailProps) {
  return (
    <Shell preview="Welcome to Journey to Advent" siteUrl={siteUrl} unsubscribe>
      <Text style={s.h1}>Welcome to the journey</Text>
      {midSeason ? (
        <>
          <Text style={s.text}>
            Advent is already under way, and today is Day {midSeason.dayNumber}. Your first email arrives tomorrow at five in the morning, Central time.
          </Text>
          <Text style={s.text}>
            Start with <Link href={midSeason.dayUrl} style={s.link}>today&rsquo;s hymn</Link>, or go back and catch up on <Link href={midSeason.seasonUrl} style={s.link}>the days so far</Link>.
          </Text>
        </>
      ) : (
        <Text style={s.text}>
          The first hymn arrives on {startLabel}, the First Sunday of Advent, at five in the morning, Central time. One email a day until Christmas Eve.
        </Text>
      )}
      <Text style={s.text}>
        Each day brings a hymn, a passage of Scripture, a short reflection, a word from the Christian tradition, a question to carry, and the collect for the week. It takes about ten minutes.
      </Text>
      <Text style={s.text}>
        <Link href={`${siteUrl}/about`} style={s.link}>Read more about how it works</Link>.
      </Text>
    </Shell>
  )
}

WelcomeEmail.PreviewProps = { siteUrl: 'https://journeytoadvent.com', startLabel: 'Sunday, November 29' } satisfies WelcomeEmailProps
