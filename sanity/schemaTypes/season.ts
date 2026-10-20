import { defineField, defineType } from 'sanity'

export const season = defineType({
  name: 'season',
  title: 'Season',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      type: 'number',
      validation: (r) =>
        r
          .required()
          .integer()
          .min(2026)
          .custom(async (year, ctx) => {
            if (!year) return true
            const client = ctx.getClient({ apiVersion: '2026-10-01' })
            const id = ctx.document?._id.replace(/^drafts\./, '')
            const dupes = await client.fetch<number>(
              'count(*[_type == "season" && year == $year && !(_id in [$id, "drafts." + $id])])',
              { year, id },
            )
            return dupes === 0 || 'Another season already uses this year'
          }),
    }),
    defineField({ name: 'title', type: 'string', initialValue: 'Journey to Advent' }),
    defineField({
      name: 'startDate',
      type: 'date',
      description: 'The First Sunday of Advent',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      description: 'Dec 24, or Dec 25 if the Christmas Day bonus is included',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'intro', title: 'Welcome text', type: 'blockContent' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [{ title: 'Year', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] }],
  preview: { select: { title: 'title', year: 'year' }, prepare: ({ title, year }) => ({ title: `${year}`, subtitle: title }) },
})
