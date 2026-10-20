import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, sanityConfigured } from './env'

/** Write access, for the email log. Needs SANITY_API_WRITE_TOKEN (Editor role). */
export const writeClient =
  sanityConfigured && process.env.SANITY_API_WRITE_TOKEN
    ? createClient({ projectId, dataset, apiVersion, useCdn: false, token: process.env.SANITY_API_WRITE_TOKEN, perspective: 'raw' })
    : null
