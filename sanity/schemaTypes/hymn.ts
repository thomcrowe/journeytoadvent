import { defineArrayMember, defineField, defineType } from 'sanity'

export const hymn = defineType({
  name: 'hymn',
  title: 'Hymn',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'textAuthor', type: 'string', description: 'e.g. "John Cennick; altered by Charles Wesley"' }),
    defineField({ name: 'translator', type: 'string' }),
    defineField({ name: 'textYear', type: 'string', description: 'e.g. "1752, 1758"' }),
    defineField({ name: 'tune', type: 'string' }),
    defineField({ name: 'meter', type: 'string', description: 'e.g. "8.7.8.7.4.7"' }),
    defineField({
      name: 'stanzas',
      description: 'Public-domain text only (US: published before 1929). Prefer original translations.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stanza',
          fields: [
            defineField({ name: 'number', type: 'number', validation: (r) => r.integer().min(0) }),
            defineField({ name: 'lines', type: 'text', rows: 6, description: 'One line of verse per line.' }),
            defineField({ name: 'refrain', type: 'boolean', initialValue: false, description: 'Set in italic' }),
          ],
          preview: {
            select: { number: 'number', lines: 'lines', refrain: 'refrain' },
            prepare: ({ number, lines, refrain }) => ({
              title: `${refrain ? 'Refrain' : number ?? '–'}: ${String(lines ?? '').split('\n')[0]}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'copyright',
      type: 'object',
      fields: [
        defineField({
          name: 'status',
          type: 'string',
          options: {
            list: [
              { title: 'Public domain worldwide', value: 'public-domain-worldwide' },
              { title: 'Public domain in the US only', value: 'public-domain-us-only' },
              { title: 'Licensed', value: 'licensed' },
            ],
          },
          initialValue: 'public-domain-worldwide',
        }),
        defineField({ name: 'notes', type: 'text', rows: 3 }),
      ],
    }),
    defineField({ name: 'background', type: 'blockContent', description: 'Evergreen notes on the hymn (shown on the hymn page)' }),
    defineField({ name: 'hymnaryUrl', title: 'Hymnary.org URL', type: 'url' }),
    defineField({ name: 'defaultRecording', type: 'recording' }),
  ],
  orderings: [{ title: 'Title', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'tune' } },
})
