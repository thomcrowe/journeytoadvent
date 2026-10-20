import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { attribution } from '@/components/DayEntry'
import { ListenBar } from '@/components/ListenBar'
import { RichText } from '@/components/RichText'
import { Stanzas } from '@/components/Stanzas'
import { getHymn, getHymnsWithEntries, getToday, isDraftMode } from '@/lib/content'
import { formatLong, isReleased } from '@/lib/date'
import { absoluteUrl, dayPath, formatDuration, site } from '@/lib/site'

// Render unknown params completely before responding, so notFound() sends a real 404.
export const ensureStatic = 'navigation'

export async function generateStaticParams() {
  const hymns = await getHymnsWithEntries()
  return hymns.length ? hymns.map((h) => ({ slug: h.slug })) : [{ slug: 'lo-he-comes-with-clouds-descending' }]
}

async function load(slug: string) {
  const [hymn, today, draft] = await Promise.all([getHymn(slug), getToday(), isDraftMode()])
  if (!hymn) return null
  const entries = hymn.entries.filter((e) => draft || isReleased(e.date, today))
  if (!entries.length && !draft) return null
  return { hymn, entries }
}

export async function generateMetadata({ params }: PageProps<'/hymns/[slug]'>): Promise<Metadata> {
  const data = await load((await params).slug)
  if (!data) return { title: 'Hymn', robots: { index: false } }
  const { hymn } = data
  const description = `${hymn.title}: full public-domain text${hymn.textAuthor ? ` by ${hymn.textAuthor}` : ''}${hymn.tune ? `, sung to ${hymn.tune}` : ''}. From Journey to Advent.`
  return { title: hymn.title, description, alternates: { canonical: `/hymns/${hymn.slug}` } }
}

export default async function HymnPage({ params }: PageProps<'/hymns/[slug]'>) {
  const data = await load((await params).slug)
  if (!data) notFound()
  const { hymn, entries } = data
  const rec = hymn.defaultRecording
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: hymn.title,
    author: hymn.textAuthor ? { '@type': 'Person', name: hymn.textAuthor } : undefined,
    translator: hymn.translator ? { '@type': 'Person', name: hymn.translator } : undefined,
    dateCreated: hymn.textYear,
    genre: 'Hymn',
    url: absoluteUrl(`/hymns/${hymn.slug}`),
    isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
  }
  return (
    <article className="measure flex flex-col gap-7 pb-8 pt-10 sm:pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="flex flex-col gap-2.5">
        <p className="label label-rubric">
          <Link href="/hymns" className="no-underline">Hymns</Link>
        </p>
        <h1 className="text-[40px] font-medium leading-[1.05] text-balance sm:text-[52px]">{hymn.title}</h1>
        {attribution(hymn) && <p className="text-[17px] italic text-ink-muted">{attribution(hymn)}</p>}
      </header>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-y border-rule py-4 text-[17px]">
        {hymn.textAuthor && (<><dt className="label self-center">Text</dt><dd>{hymn.textAuthor}{hymn.textYear ? `, ${hymn.textYear}` : ''}</dd></>)}
        {hymn.translator && (<><dt className="label self-center">Translation</dt><dd>{hymn.translator}</dd></>)}
        {hymn.tune && (<><dt className="label self-center">Tune</dt><dd>{hymn.tune}</dd></>)}
        {hymn.meter && (<><dt className="label self-center">Meter</dt><dd>{hymn.meter}</dd></>)}
      </dl>

      {rec?.youtubeId && <ListenBar youtubeId={rec.youtubeId} label={rec.label} duration={formatDuration(rec.durationSeconds)} hymnTitle={hymn.title} />}

      {hymn.stanzas?.length ? (
        <section aria-label="Full text">
          <Stanzas stanzas={hymn.stanzas} />
        </section>
      ) : (
        <p className="reading italic text-ink-muted">The full text will appear here soon.</p>
      )}

      {hymn.background?.length ? (
        <section aria-labelledby="bg-heading" className="flex flex-col gap-[18px]">
          <h2 id="bg-heading" className="label">About this hymn</h2>
          <RichText value={hymn.background} className="reading" />
        </section>
      ) : null}

      <section aria-labelledby="days-heading" className="flex flex-col gap-3 border-t-2 border-rubric pt-6">
        <h2 id="days-heading" className="label label-rubric">Sung on</h2>
        <ul className="flex flex-col gap-2">
          {entries.map((e) => (
            <li key={e._id} className="text-[19px]">
              <Link href={dayPath(e.year, e.dayNumber)}>
                Day {e.dayNumber}, {e.year}
              </Link>{' '}
              <span className="text-ink-muted">· {formatLong(e.date)}{e.hymnSlug !== hymn.slug ? ` · with ${e.hymnTitle}` : ''}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[15px] text-ink-muted">
        {hymn.copyright?.status === 'public-domain-us-only' ? 'This text is in the public domain in the United States.' : 'This text is in the public domain.'}
        {hymn.hymnaryUrl && (
          <>
            {' '}
            <a href={hymn.hymnaryUrl} rel="noopener noreferrer">More at Hymnary.org</a>.
          </>
        )}
      </p>
    </article>
  )
}
