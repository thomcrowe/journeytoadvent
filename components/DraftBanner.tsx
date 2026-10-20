export function DraftBanner() {
  return (
    <div role="status" className="bg-ink text-paper">
      <div className="wide flex flex-wrap items-center justify-between gap-2 py-2 text-[15px]">
        <span>Preview mode: you are seeing drafts and unreleased days.</span>
        <form action="/api/draft-mode/disable" method="POST">
          <button type="submit" className="cursor-pointer border-0 bg-transparent p-0 text-paper underline">
            Exit preview
          </button>
        </form>
      </div>
    </div>
  )
}
