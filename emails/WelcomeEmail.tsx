import { Link, Text } from 'react-email'
import { Shell } from './Shell'
import { s } from './theme'

export interface WelcomeEmailProps {
  siteUrl: string
  startLabel: string // "Sunday, November 29"
  midSeason?: { dayNumber: number; dayUrl: string; seasonUrl: string }
}

export default function WelcomeEmail({ siteUrl, startLabel, midSeason }: WelcomeEmailProps) {
  // "Sunday, November 29" -> "November 29"
  const startDay = startLabel.replace(/^[A-Za-z]+, /, '')
  return (
    <Shell preview="Welcome to Journey to Advent" siteUrl={siteUrl} unsubscribe>
      <Text style={s.h1}>Welcome to the Advent Journey</Text>
      {midSeason ? (
        <>
          <Text style={s.text}>
            I&rsquo;m glad you&rsquo;re here. Advent is already under way, and today is Day {midSeason.dayNumber}. Your first hymn arrives tomorrow at five in the morning, Central time. Then you&rsquo;ll get one every morning through until Christmas Eve.
          </Text>
          <Text style={s.text}>
            Start with <Link href={midSeason.dayUrl} style={s.link}>today&rsquo;s hymn</Link>, or go back and catch up on <Link href={midSeason.seasonUrl} style={s.link}>the days so far</Link>.
          </Text>
        </>
      ) : (
        <Text style={s.text}>
          I&rsquo;m glad you&rsquo;re here. You&rsquo;ll get your first hymn on the First Sunday of Advent{/\d/.test(startDay) ? `, ${startDay},` : ''} at five in the morning, Central time. Then you&rsquo;ll get one every morning through until Christmas Eve.
        </Text>
      )}
      <Text style={s.text}>
        Each day you&rsquo;ll get a hymn, a passage of Scripture, a short reflection, some wisdom from our Christian tradition, a question to reflect on, and the collect for the week. It&rsquo;ll take you about ten minutes and I pray it brings you closer to Christ and prepares you for Christmas.
      </Text>
      <Text style={s.text}>God bless you on your journey.</Text>
    </Shell>
  )
}

WelcomeEmail.PreviewProps = { siteUrl: 'https://journeytoadvent.com', startLabel: 'Sunday, November 29' } satisfies WelcomeEmailProps
