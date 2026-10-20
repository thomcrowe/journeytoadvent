import { defineField, defineType } from 'sanity'

export const week = defineType({
  name: 'week',
  title: 'Week',
  type: 'document',
  fields: [
    defineField({ name: 'season', type: 'reference', to: [{ type: 'season' }], validation: (r) => r.required() }),
    defineField({ name: 'number', type: 'number', validation: (r) => r.required().integer().min(1).max(4) }),
    defineField({ name: 'title', type: 'string', description: 'e.g. "Keep Awake"' }),
    defineField({ name: 'summary', type: 'blockContent' }),
    defineField({ name: 'collect', type: 'collect' }),
    defineField({
      name: 'candleColor',
      type: 'string',
      options: { list: ['blue', 'violet', 'rose'], layout: 'radio' },
      initialValue: 'blue',
    }),
  ],
  orderings: [{ title: 'Week', name: 'numberAsc', by: [{ field: 'number', direction: 'asc' }] }],
  preview: {
    select: { number: 'number', title: 'title', year: 'season.year' },
    prepare: ({ number, title, year }) => ({ title: `Week ${number}${title ? ` · ${title}` : ''}`, subtitle: year ? String(year) : undefined }),
  },
})
