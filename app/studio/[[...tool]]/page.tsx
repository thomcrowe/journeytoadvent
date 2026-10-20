import { connection } from 'next/server'
import { Suspense } from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { sanityConfigured } from '@/sanity/env'

export { metadata, viewport } from 'next-sanity/studio'

export function generateStaticParams() {
  return [{ tool: [] }]
}

// Marks the Studio route as request-time, so its catch-all params don't block
// the build. The Studio itself is a client app.
async function RequestTime() {
  await connection()
  return null
}

export default function StudioPage() {
  return (
    <>
      <Suspense fallback={null}>
        <RequestTime />
      </Suspense>
      {sanityConfigured ? <NextStudio config={config} /> : <NotConfigured />}
    </>
  )
}

function NotConfigured() {
  return (
      <main style={{ fontFamily: 'Georgia, serif', maxWidth: 600, margin: '80px auto', padding: '0 16px', lineHeight: 1.6 }}>
        <h1>Sanity Studio isn&rsquo;t connected yet</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and <code>NEXT_PUBLIC_SANITY_DATASET</code>) in your environment, then reload. See the README for setup steps.
        </p>
      </main>
  )
}
