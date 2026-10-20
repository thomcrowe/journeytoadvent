import { NotFoundBody } from '@/components/NotFoundBody'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader subscribeHref="/subscribe" />
      <main id="main" className="flex-1">
        <NotFoundBody />
      </main>
      <SiteFooter />
    </div>
  )
}
