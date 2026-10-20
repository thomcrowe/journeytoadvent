import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {
      route: '/:year/day/:n',
      filter: `_type == "entry" && season->year == $year && dayNumber == $n`,
      params: ({ params }: { params: Record<string, string> }) => ({ year: Number(params.year), n: Number(params.n) }),
    } as never,
    { route: '/hymns/:slug', filter: `_type == "hymn" && slug.current == $slug` },
  ]),
  locations: {
    entry: defineLocations({
      select: { year: 'season.year', n: 'dayNumber', title: 'hymn.title' },
      resolve: (doc) => ({
        locations: doc?.year && doc?.n ? [{ title: `Day ${doc.n} · ${doc.title ?? ''}`, href: `/${doc.year}/day/${doc.n}` }] : [],
      }),
    }),
    hymn: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({ locations: doc?.slug ? [{ title: doc.title ?? 'Hymn', href: `/hymns/${doc.slug}` }] : [] }),
    }),
    season: defineLocations({
      select: { year: 'year' },
      resolve: (doc) => ({ locations: doc?.year ? [{ title: `${doc.year} calendar`, href: `/${doc.year}` }, { title: 'Home', href: '/' }] : [] }),
    }),
  },
}
