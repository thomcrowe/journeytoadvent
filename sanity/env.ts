// Sanity connection settings. When no project ID is set, the site runs on the
// built-in sample content in lib/fallback-data.ts so it can build and render
// before the Sanity project exists.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2026-10-01'
export const studioUrl = '/studio'

export const sanityConfigured = projectId.length > 0
