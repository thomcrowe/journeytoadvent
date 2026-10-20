import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
