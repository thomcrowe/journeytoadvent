'use client'

// A Studio tool that loads the 2026 season into Sanity: the season, weeks,
// hymns, every daily entry, and the written weeks in content/seed. It writes
// with the signed-in editor's own access, so no API token is needed.
//
// Safe to run more than once: documents are only created if missing, and
// written content only fills fields that are still empty, so edits made in
// the Studio are never overwritten.

import { useEffect, useMemo, useState } from 'react'
import { useClient, type Tool } from 'sanity'
import { buildSeedPlan } from '@/lib/seed-plan'
import { apiVersion } from './env'

type Counts = { seasons: number; weeks: number; hymns: number; entries: number; written: number }
type State = { kind: 'idle' } | { kind: 'loading' } | { kind: 'done'; tx: string } | { kind: 'error'; message: string }

const COUNTS = `{
  "seasons": count(*[_type == "season" && !(_id in path("drafts.**"))]),
  "weeks": count(*[_type == "week" && !(_id in path("drafts.**"))]),
  "hymns": count(*[_type == "hymn" && !(_id in path("drafts.**"))]),
  "entries": count(*[_type == "entry" && !(_id in path("drafts.**"))]),
  "written": count(*[_type == "entry" && !(_id in path("drafts.**")) && defined(reflection)])
}`

const box: React.CSSProperties = { maxWidth: 640, margin: '0 auto', padding: '32px 20px', lineHeight: 1.5, fontSize: 15 }
const button: React.CSSProperties = {
  padding: '10px 18px',
  fontSize: 15,
  fontWeight: 600,
  borderRadius: 6,
  border: 'none',
  background: '#2276fc',
  color: '#fff',
  cursor: 'pointer',
}

function LoadContent() {
  const client = useClient({ apiVersion })
  const plan = useMemo(() => buildSeedPlan(), [])
  const [counts, setCounts] = useState<Counts | null>(null)
  const [state, setState] = useState<State>({ kind: 'idle' })

  const [version, setVersion] = useState(0)

  useEffect(() => {
    let alive = true
    client
      .fetch<Counts>(COUNTS)
      .then((c) => alive && setCounts(c))
      .catch(() => alive && setCounts(null))
    return () => {
      alive = false
    }
  }, [client, version])

  const run = async () => {
    setState({ kind: 'loading' })
    try {
      const tx = client.transaction()
      for (const doc of plan.creates) tx.createIfNotExists(doc)
      for (const p of plan.patches) {
        // Only fill empty fields, so Studio edits are never overwritten.
        const fill = { ...(p.setIfMissing ?? {}), ...(p.set ?? {}) }
        if (Object.keys(fill).length) tx.patch(p.id, (patch) => patch.setIfMissing(fill))
      }
      const res = await tx.commit({ visibility: 'sync' })
      setState({ kind: 'done', tx: res.transactionId })
      setVersion((v) => v + 1)
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : String(err) })
    }
  }

  const written = plan.patches.filter((p) => p.id.startsWith('entry-')).length
  const notes = plan.log.filter((l) => !l.includes(' · '))

  return (
    <div style={box}>
      <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>Load content</h1>
      <p>
        Adds the 2026 season to Sanity: the season, its 4 weeks, {plan.creates.filter((d) => d._type === 'hymn').length} hymns,
        and all {plan.creates.filter((d) => d._type === 'entry').length} daily entries. The {written} days already written are filled in.
      </p>
      <p>
        You can press it again at any time. It only adds what is missing and never overwrites anything you have changed here in the Studio.
      </p>

      <p style={{ opacity: 0.8 }}>
        In Sanity now:{' '}
        {counts
          ? `${counts.seasons} season, ${counts.weeks} weeks, ${counts.hymns} hymns, ${counts.entries} entries (${counts.written} with a reflection)`
          : 'checking…'}
      </p>

      <button type="button" style={{ ...button, opacity: state.kind === 'loading' ? 0.6 : 1 }} disabled={state.kind === 'loading'} onClick={run}>
        {state.kind === 'loading' ? 'Loading…' : 'Load content'}
      </button>

      {state.kind === 'done' && (
        <p style={{ marginTop: 16 }}>
          Done. Open <strong>Structure → Seasons → Journey to Advent 2026</strong> to see the entries, or <strong>Presentation</strong> to preview them on the site.
        </p>
      )}
      {state.kind === 'error' && (
        <p style={{ marginTop: 16, color: '#e5484d' }}>
          Something went wrong: {state.message}
        </p>
      )}

      {notes.length > 0 && (
        <details style={{ marginTop: 24 }}>
          <summary>Notes</summary>
          <ul>
            {notes.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

export const loadContentTool: Tool = {
  name: 'load-content',
  title: 'Load content',
  component: LoadContent,
}
