import { checkPassword, unauthorized } from '../../_auth.js'

// DELETE /api/entries/:id — 删掉这条日记，以及它的照片（R2 里的文件）和评论
export async function onRequestDelete({ request, env, params }) {
  if (!checkPassword(request, env)) return unauthorized()

  const id = params.id

  const { results: mediaRows } = await env.DB.prepare(
    'SELECT r2_key FROM media WHERE entry_id = ?'
  )
    .bind(id)
    .all()

  for (const row of mediaRows) {
    await env.MEDIA_BUCKET.delete(row.r2_key)
  }

  await env.DB.prepare('DELETE FROM media WHERE entry_id = ?').bind(id).run()
  await env.DB.prepare('DELETE FROM comments WHERE entry_id = ?').bind(id).run()
  await env.DB.prepare('DELETE FROM entries WHERE id = ?').bind(id).run()

  return Response.json({ ok: true })
}
