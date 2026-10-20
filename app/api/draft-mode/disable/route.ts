import { draftMode } from 'next/headers'

async function disable(request: Request) {
  ;(await draftMode()).disable()
  return Response.redirect(new URL('/', request.url), 303)
}

export const GET = disable
export const POST = disable
