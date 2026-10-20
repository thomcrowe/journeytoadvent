import { defineField, defineType } from 'sanity'

// Written by the daily email cron so a retry never double-sends.
export const emailLog = defineType({
  name: 'emailLog',
  title: 'Email log',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'status', type: 'string' }),
    defineField({ name: 'broadcastId', type: 'string' }),
    defineField({ name: 'error', type: 'text' }),
    defineField({ name: 'updatedAt', type: 'datetime' }),
  ],
  preview: { select: { title: 'date', subtitle: 'status' } },
})
