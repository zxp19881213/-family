// 每个 API 请求都会带一个 x-family-password 请求头，
// 这里统一校验是不是等于 Cloudflare 里设置的 FAMILY_PASSWORD。
export function checkPassword(request, env) {
  const provided = request.headers.get('x-family-password') || ''
  return provided === env.FAMILY_PASSWORD
}

// 管理员密码额外校验，只有删除这类操作需要。
export function checkAdminPassword(request, env) {
  const provided = request.headers.get('x-admin-password') || ''
  return provided === env.ADMIN_PASSWORD
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: '密码不对' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  })
}
