import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Sanity GROQ webhook target. Configure the webhook (see README) with:
//   Filter:     _type in ["season", "week", "hymn", "entry"]
//   Projection: {_type, _id, "slug": slug.current, "year": coalesce(year, season->year), dayNumber}
//   Secret:     SANITY_REVALIDATE_SECRET

type Payload = { _type?: string; _id?: string; slug?: string; year?: number; dayNumber?: number }

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return Response.json({ error: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 })

  const { isValidSignature, body } = await parseBody<Payload>(request, secret, true)
  if (!isValidSignature) return Response.json({ error: 'Invalid signature' }, { status: 401 })
  if (!body?._type) return Response.json({ error: 'Missing _type' }, { status: 400 })

  const tags = new Set<string>([`type:${body._type}`])
  if (body.year) tags.add(`season:${body.year}`)
  if (body._type === 'entry' && body.year && body.dayNumber) tags.add(`entry:${body.year}:${body.dayNumber}`)
  if (body._type === 'hymn' && body.slug) tags.add(`hymn:${body.slug}`)

  // expire: 0 so the next visitor gets fresh content rather than a stale copy.
  for (const tag of tags) revalidateTag(tag, { expire: 0 })
  return Response.json({ revalidated: [...tags] })
}
