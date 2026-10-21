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
      {/* Option C · Title page: name centered, nav on a ruled line beneath */}
      <div className="wide flex flex-col items-center gap-3 pb-3 pt-5 sm:pt-6">
        <Wordmark />
        <nav
          aria-label="Main"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-rule pt-2.5 text-[13px] uppercase tracking-[0.16em] sm:gap-x-7 sm:text-[15px]"
        >
          <NavLinks links={links} />
          <a href={subscribeHref} className="text-rubric no-underline hover:text-rubric-hover">
            Subscribe
          </a>
        </nav>
      </div>
    </header>
  )
}
