import type { NextConfig } from 'next'

// PostHog is proxied through /ingest on this domain so ad blockers don't drop events.
const posthogHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '')
const posthogAssets = posthogHost.replace('.i.posthog.com', '-assets.i.posthog.com')

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: `${posthogAssets}/static/:path*` },
      { source: '/ingest/array/:path*', destination: `${posthogAssets}/array/:path*` },
      { source: '/ingest/:path*', destination: `${posthogHost}/:path*` },
    ]
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  // Files read from disk at runtime: OG fonts and the fallback seed Markdown.
  outputFileTracingIncludes: {
    '/**': ['./assets/fonts/**', './content/seed/**'],
  },
  async headers() {
    return [{ source: '/studio/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }]
  },
}

export default nextConfig
