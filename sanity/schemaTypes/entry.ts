import { defineField, defineType } from 'sanity'

const API = { apiVersion: '2026-10-01' }

type SeasonDates = { startDate?: string; endDate?: string } | null

async function seasonFor(ctx: { getClient: (o: typeof API) => { fetch: <T>(q: string, p: object) => Promise<T> }; document?: { season?: { _ref?: string } } }) {
  const ref = ctx.document?.season?._ref
  if (!ref) return null
  return ctx.getClient(API).fetch<SeasonDates>('*[_id == $ref][0]{startDate, endDate}', { ref })
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000)
}

export const entry = defineType({
  name: 'entry',
  title: 'Daily entry',
  type: 'document',
  groups: [
    { name: 'when', title: 'When', default: true },
    { name: 'hymn', title: 'Hymn' },
    { name: 'words', title: 'Words' },
    { name: 'extras', title: 'Extras' },
  ],
  fields: [
    defineField({ name: 'season', type: 'reference', to: [{ type: 'season' }], group: 'when', validation: (r) => r.required() }),
    defineField({
      name: 'week',
      type: 'reference',
      to: [{ type: 'week' }],
      group: 'when',
      options: { filter: ({ document }) => ({ filter: 'season._ref == $s', params: { s: (document.season as { _ref?: string })?._ref ?? '' } }) },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      type: 'date',
      group: 'when',
      description: 'Release date (America/Chicago). The entry goes live at midnight Central.',
      validation: (r) =>
        r.required().custom(async (date, ctx) => {
          if (!date) return true
          const s = await seasonFor(ctx as never)
          if (s?.startDate && date < s.startDate) return `Before the season starts (${s.startDate})`
          if (s?.endDate && date > s.endDate) return `After the season ends (${s.endDate})`
          const id = ctx.document?._id.replace(/^drafts\./, '')
          const dupes = await ctx.getClient(API).fetch<number>(
            'count(*[_type == "entry" && date == $date && season._ref == $season && !(_id in [$id, "drafts." + $id])])',
            { date, id, season: (ctx.document?.season as { _ref?: string })?._ref ?? '' },
          )
          return dupes === 0 || 'Another entry in this season already uses this date'
        }),
    }),
    defineField({
      name: 'dayNumber',
      type: 'number',
      group: 'when',
      validation: (r) =>
        r
          .required()
          .integer()
          .min(1)
          .max(27)
          .custom(async (n, ctx) => {
            const date = (ctx.document as { date?: string })?.date
            if (!n || !date) return true
            const s = await seasonFor(ctx as never)
            if (!s?.startDate) return true
            const expected = daysBetween(s.startDate, date) + 1
            return n === expected || `Should be ${expected} for ${date}`
          }),
    }),
    defineField({ name: 'liturgicalLabel', type: 'string', group: 'when', description: 'e.g. "The First Sunday of Advent", "O Sapientia"' }),
    defineField({ name: 'status', type: 'string', group: 'when', options: { list: ['draft', 'ready'], layout: 'radio' }, initialValue: 'draft', description: 'Editorial flag only. Visibility is set by date and publish state.' }),

    defineField({ name: 'hymn', type: 'reference', to: [{ type: 'hymn' }], group: 'hymn', validation: (r) => r.required() }),
    defineField({ name: 'featuredStanzas', type: 'array', of: [{ type: 'number' }], group: 'hymn', description: 'Stanza numbers to print on the day page' }),
    defineField({
      name: 'antiphon',
      title: 'O Antiphon',
      type: 'object',
      group: 'hymn',
      description: 'Dec 17–23 only',
      fields: [
        defineField({ name: 'latin', type: 'string' }),
        defineField({ name: 'english', type: 'text', rows: 3 }),
      ],
    }),
    defineField({ name: 'secondaryHymn', type: 'reference', to: [{ type: 'hymn' }], group: 'hymn', description: 'O Antiphon days: O Come, O Come, Emmanuel' }),
    defineField({ name: 'secondaryStanzas', type: 'array', of: [{ type: 'number' }], group: 'hymn' }),
    defineField({ name: 'recordingOverride', type: 'recording', group: 'hymn' }),

    defineField({ name: 'scriptureRef', title: 'Scripture reference', type: 'string', group: 'words', description: 'e.g. "Mark 13:24–37"' }),
    defineField({ name: 'scriptureText', title: 'Scripture text (KJV)', type: 'text', rows: 4, group: 'words' }),
    defineField({ name: 'reflection', type: 'blockContent', group: 'words', validation: (r) => r.custom((v, ctx) => ((ctx.document as { status?: string })?.status === 'ready' && !(v as unknown[])?.length ? 'Required before marking ready' : true)) }),
    defineField({
      name: 'traditionQuote',
      title: 'From the tradition',
      type: 'object',
      group: 'words',
      fields: [
        defineField({ name: 'text', type: 'text', rows: 3 }),
        defineField({ name: 'author', type: 'string' }),
        defineField({ name: 'source', type: 'string' }),
      ],
    }),
    defineField({ name: 'question', title: 'Carry this', type: 'text', rows: 3, group: 'words' }),
    defineField({ name: 'collectOverride', type: 'collect', group: 'words', description: "Leave empty to use the week's collect" }),

    defineField({ name: 'shareImage', type: 'image', group: 'extras', description: 'Optional. A share image is generated automatically.' }),
  ],
  orderings: [{ title: 'Date', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] }],
  preview: {
    select: { day: 'dayNumber', date: 'date', hymn: 'hymn.title', status: 'status' },
    prepare: ({ day, date, hymn, status }) => ({
      title: `Day ${day ?? '?'} · ${hymn ?? 'No hymn'}`,
      subtitle: `${date ?? 'No date'}${status === 'ready' ? ' · ready' : ' · draft'}`,
    }),
  },
})
