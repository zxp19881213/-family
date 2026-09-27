import { checkPassword, unauthorized } from '../_auth.js'

// POST /api/upload — multipart/form-data，字段名 file
// 返回 { key, kind }，前端拿着这个 key 在建日记时一起提交
export async function onRequestPost({ request, env }) {
  if (!checkPassword(request, env)) return unauthorized()

  const formData = await request.formData()
  const file = formData.get('file')
  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: '没有收到文件' }), { status: 400 })
  }

  const isVideo = file.type.startsWith('video/')
  const kind = isVideo ? 'video' : 'image'
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const key = `${kind}s/${crypto.randomUUID()}.${ext}`

  await env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })

  return Response.json({ key, kind })
}
