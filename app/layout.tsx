import type { Metadata, Viewport } from 'next'
import { EB_Garamond } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

const garamond = EB_Garamond({
  variable: '--font-garamond',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · A hymn a day for Advent`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author }],
  openGraph: { siteName: site.name, type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  alternates: { types: { 'application/rss+xml': [{ url: '/feed.xml', title: site.name }] } },
}

export const viewport: Viewport = {
  themeColor: '#FBF8F1',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={garamond.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
