import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { clients } from '@/sanity/client'

// Called by the Presentation tool in the Studio. It validates a short-lived
// secret against Sanity before turning Draft Mode on.
const handler = clients
  ? defineEnableDraftMode({ client: clients.published.withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: false }) })
  : null

export async function GET(request: Request) {
  if (!handler) return new Response('Sanity is not configured', { status: 404 })
  return handler.GET(request)
}
