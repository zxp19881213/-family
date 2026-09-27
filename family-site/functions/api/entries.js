import { checkPassword, unauthorized } from '../_auth.js'

// GET /api/entries — 返回所有日记，按日期倒序，每条带媒体和评论
export async function onRequestGet({ request, env }) {
  if (!checkPassword(request, env)) return unauthorized()

  const { results: entries } = await env.DB.prepare(
    'SELECT * FROM entries ORDER BY date DESC, created_at DESC'
  ).all()

  const { results: media } = await env.DB.prepare('SELECT * FROM media').all()
  const { results: comments } = await env.DB.prepare(
    'SELECT * FROM comments ORDER BY created_at ASC'
  ).all()

  const full = entries.map((entry) => ({
    ...entry,
    media: media
      .filter((m) => m.entry_id === entry.id)
      .map((m) => ({
        kind: m.kind,
        url: `${env.MEDIA_BASE_URL}/${m.r2_key}`,
      })),
    comments: comments
      .filter((c) => c.entry_id === entry.id)
      .map((c) => ({ author: c.author, text: c.text })),
  }))

  return Response.json(full)
}

// POST /api/entries — 新建一条日记
// body: { title, body, date, type, mediaKeys: [{kind, key}] }
export async function onRequestPost({ request, env }) {
  if (!checkPassword(request, env)) return unauthorized()

  const data = await request.json()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const date = data.date || now.slice(0, 10)
  const type = data.type || 'post'

  await env.DB.prepare(
    'INSERT INTO entries (id, date, type, title, body, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  )
    .bind(id, date, type, data.title || '(无标题)', data.body || '', now)
    .run()

  const mediaKeys = Array.isArray(data.mediaKeys) ? data.mediaKeys : []
  for (const m of mediaKeys) {
    await env.DB.prepare(
      'INSERT INTO media (entry_id, kind, r2_key) VALUES (?, ?, ?)'
    )
      .bind(id, m.kind, m.key)
      .run()
  }

  return Response.json({ id })
}
