import type { Metadata, Viewport } from 'next'
import { EB_Garamond } from 'next/font/google'
import Script from 'next/script'
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
  // Google Search Console: paste the "HTML tag" verification code into this env var.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
}

// Google Analytics 4. The measurement ID is public (it ships in every page), so
// it lives here; NEXT_PUBLIC_GA_MEASUREMENT_ID can override it.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-25KDFE1RZW'

export const viewport: Viewport = {
  themeColor: '#FBF8F1',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={garamond.variable}>
      <body className="min-h-dvh antialiased">
        {children}
        {/* Loads Google Analytics unless the reader sends Do Not Track, and never inside the Studio. */}
        <Script id="ga4" strategy="afterInteractive">
          {`(function(){var d=navigator.doNotTrack=='1'||window.doNotTrack=='1';if(d||location.pathname.indexOf('/studio')===0)return;window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}');var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s)})();`}
        </Script>
      </body>
    </html>
  )
}
