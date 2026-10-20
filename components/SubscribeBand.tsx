import { SubscribeForm } from './SubscribeForm'

export function SubscribeBand({ totalDays = 26 }: { totalDays?: number }) {
  const words: Record<number, string> = { 26: 'Twenty-six', 27: 'Twenty-seven' }
  return (
    <section id="subscribe" aria-labelledby="subscribe-heading" className="mt-12 scroll-mt-4 bg-sarum text-paper">
      <div className="measure flex flex-col gap-[18px] py-14">
        <h2 id="subscribe-heading" className="text-[32px] font-medium italic leading-tight sm:text-[36px]">
          A hymn in your inbox each morning
        </h2>
        <p className="text-[19px] leading-normal text-sarum-soft">
          {words[totalDays] ?? totalDays} days, from the First Sunday of Advent to Christmas Eve. Free, and you can leave any time.
        </p>
        <SubscribeForm source="band" />
      </div>
    </section>
  )
}
