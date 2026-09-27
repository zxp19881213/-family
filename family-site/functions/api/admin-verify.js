import { checkPassword, checkAdminPassword, unauthorized } from '../_auth.js'

// POST /api/admin-verify — 只用来校验管理员密码对不对，不做别的事
export async function onRequestPost({ request, env }) {
  if (!checkPassword(request, env)) return unauthorized()
  if (!checkAdminPassword(request, env)) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    })
  }
  return Response.json({ ok: true })
}
