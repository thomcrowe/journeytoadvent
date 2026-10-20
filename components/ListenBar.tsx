'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'

/**
 * Click-to-load YouTube facade. Nothing from YouTube loads until the reader
 * presses play; then a privacy-enhanced (youtube-nocookie) player appears.
 */
export function ListenBar({
  youtubeId,
  label,
  duration,
  hymnTitle,
  dayNumber,
}: {
  youtubeId: string
  label?: string
  duration?: string
  hymnTitle: string
  dayNumber?: number
}) {
  const [playing, setPlaying] = useState(false)
  const meta = [label, duration].filter(Boolean).join(' · ')
  return (
    <div className="border border-rule bg-paper-raised">
      <div className="flex flex-wrap items-center gap-4 px-[18px] py-[14px]">
        <button
          type="button"
          onClick={() => {
            if (!playing) track('recording_played', { dayNumber, hymn: hymnTitle, youtubeId })
            setPlaying(true)
          }}
          aria-label={playing ? `Playing: ${hymnTitle}` : `Play recording of ${hymnTitle}`}
          aria-pressed={playing}
          className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-rubric hover:bg-rubric-hover"
        >
          {playing ? (
            <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path d="M2 1h3v14H2zM9 1h3v14H9z" fill="var(--paper)" /></svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path d="M2 1 L13 8 L2 15 Z" fill="var(--paper)" /></svg>
          )}
        </button>
        <div className="flex flex-col gap-0.5">
          <div className="text-[18px] leading-snug">Listen to the hymn</div>
          {meta && <div className="text-[15px] leading-snug text-ink-muted">{meta}</div>}
        </div>
      </div>
      {playing && (
        <div className="relative aspect-video w-full border-t border-rule bg-ink">
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`}
            title={`Recording: ${hymnTitle}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}
