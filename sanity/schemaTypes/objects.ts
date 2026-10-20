import { defineField, defineType } from 'sanity'

export const collect = defineType({
  name: 'collect',
  title: 'Collect',
  type: 'object',
  fields: [
    defineField({ name: 'text', type: 'text', rows: 5 }),
    defineField({
      name: 'source',
      type: 'string',
      description: 'e.g. "Collect for the First Sunday of Advent, BCP 1979"',
    }),
  ],
})

export const recording = defineType({
  name: 'recording',
  title: 'Recording',
  type: 'object',
  fields: [
    defineField({
      name: 'youtubeId',
      title: 'YouTube video ID',
      type: 'string',
      description: 'The part after "v=" in a YouTube link. Embed only; never rehost.',
      validation: (r) => r.regex(/^[A-Za-z0-9_-]{11}$/, { name: 'YouTube ID' }),
    }),
    defineField({ name: 'label', type: 'string', description: 'Choir or recording name' }),
    defineField({ name: 'durationSeconds', title: 'Duration (seconds)', type: 'number' }),
  ],
})

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'ogImage', title: 'Share image', type: 'image' }),
  ],
})

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [],
      marks: {
        decorators: [
          { title: 'Italic', value: 'em' },
          { title: 'Bold', value: 'strong' },
          { title: 'Small caps', value: 'smallcaps' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }) }],
          },
        ],
      },
    },
  ],
})
