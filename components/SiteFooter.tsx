import Link from 'next/link'
import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="wide flex w-full flex-wrap justify-between gap-3 py-7 text-[15px] text-ink-muted">
      <div>
        {site.name} · {site.byline}
      </div>
      <div>Hymn texts in the public domain · Collects from the Book of Common Prayer (1979)</div>
      <div className="flex w-full gap-5 text-[14px]">
        <Link href="/about" className="text-ink-muted hover:text-rubric">About</Link>
        <Link href="/subscribe" className="text-ink-muted hover:text-rubric">Subscribe</Link>
        <a href="/feed.xml" className="text-ink-muted hover:text-rubric">RSS</a>
      </div>
      <a
        href="https://kindlinggrowth.co"
        className="flex w-full items-center gap-2 text-[14px] text-ink-muted no-underline hover:text-rubric"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static logo */}
        <img src="/kindling-growth-flame.png" alt="" width={11} height={20} className="h-5 w-auto" />
        Built to the glory of God by Kindling Growth
      </a>
    </footer>
  )
}
