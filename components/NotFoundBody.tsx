import Link from 'next/link'

export function NotFoundBody() {
  return (
    <div className="measure flex flex-col gap-6 py-20">
      <p className="label label-rubric">Not here, or not yet</p>
      <h1 className="text-[40px] font-medium italic leading-[1.05] sm:text-[52px]">Keep awake</h1>
      <p className="reading">
        We couldn&rsquo;t find that page. If you&rsquo;re looking for a day of Advent that hasn&rsquo;t arrived, it opens at midnight, Central time.
      </p>
      <p className="text-[19px]">
        <Link href="/">Go to today</Link>
      </p>
    </div>
  )
}
