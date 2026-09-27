const PASSWORD_KEY = 'family-journal-password'
const ADMIN_KEY = 'family-journal-admin-password'

export function getStoredPassword() {
  return sessionStorage.getItem(PASSWORD_KEY) || ''
}

export function storePassword(pw) {
  sessionStorage.setItem(PASSWORD_KEY, pw)
}

export function getStoredAdminPassword() {
  return sessionStorage.getItem(ADMIN_KEY) || ''
}

export function storeAdminPassword(pw) {
  sessionStorage.setItem(ADMIN_KEY, pw)
}

export function clearAdminPassword() {
  sessionStorage.removeItem(ADMIN_KEY)
}

export function isAdmin() {
  return !!getStoredAdminPassword()
}

function authHeaders(extra = {}) {
  const headers = { 'x-family-password': getStoredPassword(), ...extra }
  const adminPw = getStoredAdminPassword()
  if (adminPw) headers['x-admin-password'] = adminPw
  return headers
}

export async function fetchEntries() {
  const res = await fetch('/api/entries', { headers: authHeaders() })
  if (!res.ok) throw new Error('加载失败')
  return res.json()
}

export async function createEntry({ title, body, date, type, mediaKeys }) {
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: authHeaders({ 'content-type': 'application/json' }),
    body: JSON.stringify({ title, body, date, type, mediaKeys }),
  })
  if (!res.ok) throw new Error('发布失败')
  return res.json()
}

export async function deleteEntry(id) {
  const res = await fetch(`/api/entries/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('删除失败')
  return res.json()
}

export async function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  if (!res.ok) throw new Error('上传失败')
  return res.json()
}

export async function addComment({ entryId, author, text }) {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: authHeaders({ 'content-type': 'application/json' }),
    body: JSON.stringify({ entryId, author, text }),
  })
  if (!res.ok) throw new Error('评论失败')
  return res.json()
}

// 用一个真实存在的、需要密码的接口去验证密码是否正确，
// 而不是像第一阶段那样把密码硬编码在前端代码里比对。
export async function verifyPassword(pw) {
  const res = await fetch('/api/entries', {
    headers: { 'x-family-password': pw },
  })
  return res.ok
}

// 验证管理员密码
export async function verifyAdminPassword(pw) {
  const res = await fetch('/api/admin-verify', {
    method: 'POST',
    headers: {
      'x-family-password': getStoredPassword(),
      'x-admin-password': pw,
    },
  })
  return res.ok
}
