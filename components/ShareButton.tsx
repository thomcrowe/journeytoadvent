'use client'

import { useState } from 'react'
import { track } from '@/lib/analytics'

export function ShareButton({ title, path, dayNumber }: { title: string; path: string; dayNumber?: number }) {
  const [copied, setCopied] = useState(false)
  async function share() {
    const url = new URL(path, window.location.origin).toString()
    const canShare = typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches
    track('share_clicked', { dayNumber, method: canShare ? 'web-share' : 'copy' })
    if (canShare) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        /* user dismissed; fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copy this link', url)
    }
  }
  return (
    <button type="button" onClick={share} className="label cursor-pointer border-0 bg-transparent p-0 hover:text-rubric">
      <span aria-live="polite">{copied ? 'Link copied' : 'Share this day'}</span>
    </button>
  )
}
