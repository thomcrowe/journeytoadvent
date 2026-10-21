import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentSeason } from '@/lib/content'
import { totalDays } from '@/lib/season'

export const metadata: Metadata = {
  title: 'About',
  description: 'What to expect from Journey to Advent, a little about the season, and why the carols arrive early.',
  alternates: { canonical: '/about' },
}

export default async function AboutPage() {
  const season = await getCurrentSeason()
  const total = totalDays(season)
  return (
    <article className="measure flex flex-col gap-10 pb-8 pt-10 sm:pt-14">
      <header className="flex flex-col gap-5">
        <h1 className="text-[34px] font-medium leading-[1.1] sm:text-[44px]">
          About this journey with the hymns of Advent and Christmas
        </h1>
        <p className="reading">
          Welcome! I pray these Advent reflections will help you stay focused on the reason for the season of Advent, prepare your hearts for the celebration of Christmas, and help you strengthen your relationship with Christ.
        </p>
      </header>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">What to expect</h2>
        <p>
          Every day through Advent, there will be a new hymn and reflection posted here and arriving in your inbox. Some of the hymns will be old favorites and, if you&rsquo;re like me, some may be new. Each hymn pairs with a reading from the Bible, a reflection from me, a little from the tradition of the Church, and a reflection question for you for the day.
        </p>
        <p>
          I made these to take about 10 minutes and include a recording of the hymn for you to listen to. I&rsquo;m also making a playlist on Apple Music and Spotify.
        </p>
        <p>
          This time of year is busy, so don&rsquo;t worry if you miss a day or two. You can just keep going or pick up where you left off.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">A little about Advent</h2>
        <p>
          Advent is an ancient liturgical season of the Church, and in the West it&rsquo;s really four weeks of waiting. Journey to Advent runs the {total} days of Advent this year, from the First Sunday of Advent to Christmas Eve. During the first week, we&rsquo;ll focus on Christ&rsquo;s coming at the end of all things. The next week, we&rsquo;ll turn to the prophets and to John the Baptist. For the third, following Gaudete Sunday, we light the rose candle and rejoice that the Lord is near. In our last week, we&rsquo;ll remember the great O Antiphons, sung at Evening Prayer since the Middle Ages, and we&rsquo;ll call on Christ by his ancient names, one each evening from December 17th&ndash;24th.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">Why carols before Christmas?</h2>
        <p>
          I know Christmas carols are actually part of our 12 Days of Christmas celebrations and they are reserved to be sung in the Church until that time. I bring a few of them into this project a bit early because I want us to hear them during the half-light of December to remind us of exactly what we&rsquo;re waiting for. Each one is paired with an Advent hymn or antiphon so we keep our Advent focus.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">Who writes it</h2>
        <p>
          Journey to Advent is written by me, Fr. Thom Crowe, an Anglo-Catholic Episcopal priest. I pull all of the hymn texts from the public domain, the collects come from the Book of Common Prayer (1979), and Scripture is linked to the New Revised Standard Version.
        </p>
      </section>

      <p className="text-[19px]">
        <Link href="/subscribe">Subscribe by email</Link>
        {season ? (
          <>
            {' '}· <Link href={`/${season.year}`}>See all {total} days</Link>
          </>
        ) : null}
      </p>
    </article>
  )
}
