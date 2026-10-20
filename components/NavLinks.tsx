'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname()
  return (
    <>
      {links.map((l) => {
        const active = l.href === '/' ? pathname === '/' : pathname === l.href || pathname.startsWith(`${l.href}/`)
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className="text-ink no-underline decoration-rubric underline-offset-[6px] hover:text-rubric aria-[current=page]:underline"
          >
            {l.label}
          </Link>
        )
      })}
    </>
  )
}
