import 'server-only'
import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId, sanityConfigured, studioUrl } from './env'

// Fields that are compared or parsed in code must never carry stega markers.
const STEGA_SKIP = new Set([
  'date',
  'startDate',
  'endDate',
  'year',
  'dayNumber',
  'number',
  'slug',
  'youtubeId',
  'candleColor',
  'status',
  'scriptureRef',
  'hymnaryUrl',
  'featuredStanzas',
  'secondaryStanzas',
])

function make(): { published: SanityClient; preview: SanityClient } | null {
  if (!sanityConfigured) return null
  const published = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
  })
  const preview = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'drafts',
    token: process.env.SANITY_API_READ_TOKEN,
    stega: {
      enabled: true,
      studioUrl,
      filter: (props) => {
        const key = props.sourcePath.at(-1)
        if (typeof key === 'string' && STEGA_SKIP.has(key)) return false
        return props.filterDefault(props)
      },
    },
  })
  return { published, preview }
}

export const clients = make()
