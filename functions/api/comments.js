import { checkPassword, unauthorized } from '../_auth.js'

// POST /api/comments — body: { entryId, author, text }
export async function onRequestPost({ request, env }) {
  if (!checkPassword(request, env)) return unauthorized()

  const data = await request.json()
  if (!data.entryId || !data.text) {
    return new Response(JSON.stringify({ error: '缺少内容' }), { status: 400 })
  }

  const now = new Date().toISOString()
  await env.DB.prepare(
    'INSERT INTO comments (entry_id, author, text, created_at) VALUES (?, ?, ?, ?)'
  )
    .bind(data.entryId, data.author || '匿名', data.text, now)
    .run()

  return Response.json({ ok: true })
}
