'use client'

import { useId, useState } from 'react'
import { track } from '@/lib/analytics'

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; message: string } | { kind: 'error'; message: string }

export function SubscribeForm({ tone = 'dark', source }: { tone?: 'dark' | 'light'; source?: string }) {
  const id = useId()
  const [state, setState] = useState<State>({ kind: 'idle' })
  const dark = tone === 'dark'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setState({ kind: 'sending' })
    track('subscribe_submitted', { source })
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), website: form.get('website') }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string }
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setState({ kind: 'done', message: data.message || 'Almost there. Check your inbox for a confirmation link.' })
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong.' })
    }
  }

  if (state.kind === 'done') {
    return (
      <p role="status" className={`text-[19px] leading-normal ${dark ? 'text-paper' : 'text-ink'}`}>
        {state.message}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2.5" noValidate={false}>
      <div className="flex flex-wrap gap-2.5">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={`min-w-0 flex-[1_1_260px] border px-4 py-3.5 font-serif text-[18px] text-ink placeholder:text-ink-muted ${dark ? 'border-paper bg-paper' : 'border-rule bg-paper-raised'}`}
        />
        {/* Honeypot: hidden from people, tempting to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          type="submit"
          disabled={state.kind === 'sending'}
          className={`cursor-pointer border px-[22px] py-3.5 font-serif text-[16px] uppercase tracking-[0.1em] disabled:opacity-70 ${dark ? 'border-paper bg-transparent text-paper hover:bg-paper hover:text-sarum' : 'border-rubric bg-rubric text-paper hover:bg-rubric-hover'}`}
        >
          {state.kind === 'sending' ? 'Sending…' : 'Begin the journey'}
        </button>
      </div>
      <p aria-live="polite" className={`min-h-[1.5em] text-[16px] ${dark ? 'text-sarum-soft' : 'text-rubric'}`}>
        {state.kind === 'error' ? state.message : ''}
      </p>
    </form>
  )
}
