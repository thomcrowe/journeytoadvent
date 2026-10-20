import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentSeason } from '@/lib/content'
import { formatLong } from '@/lib/date'
import { site } from '@/lib/site'
import { totalDays } from '@/lib/season'

export const metadata: Metadata = {
  title: 'About',
  description: 'How to use Journey to Advent, the shape of the season, and why the carols arrive early.',
  alternates: { canonical: '/about' },
}

export default async function AboutPage() {
  const season = await getCurrentSeason()
  const total = totalDays(season)
  return (
    <article className="measure flex flex-col gap-10 pb-8 pt-10 sm:pt-14">
      <header className="flex flex-col gap-3">
        <p className="label label-rubric">About this journey</p>
        <h1 className="text-[40px] font-medium leading-[1.05] sm:text-[52px]">One hymn a day</h1>
      </header>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">How to use it</h2>
        <p>
          Each morning{season ? `, beginning ${formatLong(season.startDate)},` : ''} a new day opens here and arrives in your inbox. Every day pairs a hymn with a passage of Scripture, a short reflection, a word from the Christian tradition, a question to carry with you, and the collect for the week.
        </p>
        <p>
          It takes about ten minutes. Read the hymn slowly, or press play and sing along. Open the Scripture. Read the reflection. Then take the question into your day and pray the collect, morning or evening.
        </p>
        <p>If you miss a day, don&rsquo;t worry. Every day stays open once it arrives, so you can catch up or simply pick up where today is.</p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">The shape of the season</h2>
        <p>
          Advent is four weeks of waiting. Journey to Advent runs {total} days, from the First Sunday of Advent to Christmas Eve. The first week keeps watch for Christ&rsquo;s coming at the end of all things. The second listens to the prophets and to John the Baptist. The third, Gaudete Sunday, lights the rose candle and rejoices that the Lord is near. In the last week the great O Antiphons, sung at Evening Prayer since the Middle Ages, call on Christ by his ancient names, one each evening from December 17.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">The three comings of Christ</h2>
        <p>
          Bernard of Clairvaux taught that Advent holds three comings together. Christ came once in the flesh, in weakness, at Bethlehem. He will come again in glory at the end of the age. And between those two, he comes now, hidden, in the Word and the sacraments and in the hearts of those who make room for him. Bernard called that middle coming the road by which we travel from the first to the last. That is the journey these days are meant to walk.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">Why carols before Christmas?</h2>
        <p>
          Strictly, the Christmas carols belong to the Twelve Days of Christmas, and many churches save them until then. Here a few arrive early on purpose. Advent waits for the one the carols sing about, and hearing them in the half-light of December can teach us what we are waiting for. Each one appears next to an Advent hymn or antiphon, so the waiting stays in view.
        </p>
      </section>

      <section className="reading flex flex-col">
        <h2 className="label mb-3">Who writes it</h2>
        <p>
          Journey to Advent is written by {site.author.replace(/^The/, 'the')}, an Episcopal priest. The hymn texts are in the public domain, the collects come from the Book of Common Prayer (1979), and Scripture is linked to the New Revised Standard Version.
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
