import { Wordmark } from './Wordmark'
import { NavLinks } from './NavLinks'

export function SiteHeader({ year, totalDays, subscribeHref = "#subscribe" }: { year?: number; totalDays?: number; subscribeHref?: string }) {
  const links = [
    { href: '/', label: 'Today' },
    ...(year ? [{ href: `/${year}`, label: `All ${totalDays ?? 26} days` }] : []),
    { href: '/hymns', label: 'Hymns' },
    { href: '/about', label: 'About' },
  ]
  return (
    <header className="border-b border-rule">
      <a href="#main" className="sr-only-focusable absolute left-4 top-2 z-10 bg-paper px-3 py-2">
        Skip to content
      </a>
      <div className="wide flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5">
        <Wordmark />
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[18px]">
          <NavLinks links={links} />
          <a href={subscribeHref} className="btn-rubric">
            Subscribe
          </a>
        </nav>
      </div>
    </header>
  )
}
