import { SubscribeForm } from './SubscribeForm'

export function SubscribeBand() {
  return (
    <section id="subscribe" aria-labelledby="subscribe-heading" className="mt-12 scroll-mt-4 bg-sarum text-paper">
      <div className="measure flex flex-col gap-[18px] py-14">
        <h2 id="subscribe-heading" className="text-[32px] font-medium italic leading-tight sm:text-[36px]">
          Get a different hymn and reflection from Fr.&nbsp;Thom every morning
        </h2>
        <p className="text-[19px] leading-normal text-sarum-soft">
          A free email series starting on the First Sunday of Advent and going through Christmas Eve&mdash;cancel any time.
        </p>
        <SubscribeForm source="band" />
      </div>
    </section>
  )
}
