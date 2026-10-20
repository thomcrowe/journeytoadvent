import { VisualEditing } from 'next-sanity/visual-editing'
import { DraftBanner } from '@/components/DraftBanner'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SubscribeBand } from '@/components/SubscribeBand'
import { getCurrentSeason, isDraftMode } from '@/lib/content'
import { totalDays } from '@/lib/season'

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const [season, draft] = await Promise.all([getCurrentSeason(), isDraftMode()])
  const total = totalDays(season)
  return (
    <div className="flex min-h-dvh flex-col">
      {draft && <DraftBanner />}
      <SiteHeader year={season?.year} totalDays={total} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SubscribeBand totalDays={total} />
      <SiteFooter />
      {draft && <VisualEditing />}
    </div>
  )
}
