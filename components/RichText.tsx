import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { Blocks } from '@/lib/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    smallcaps: ({ children }) => <span className="smallcaps">{children}</span>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? '#'
      const external = /^https?:/.test(href)
      return (
        <a href={href} {...(external ? { rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      )
    },
  },
}

export function RichText({ value, className }: { value?: Blocks | null; className?: string }) {
  if (!value?.length) return null
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
