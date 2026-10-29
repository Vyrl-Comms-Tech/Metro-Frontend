// Base address of the backend. Set VITE_API_URL in a .env file to change it for production.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// uploaded images are stored as "/uploads/..." paths on the backend
export const assetUrl = (path) => (path?.startsWith('/') ? `${API_URL}${path}` : path)

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_URL}/api${path}`, options)
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }

  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message ?? `Request failed (${res.status})`)
  return body
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, json('POST', body)),
  put: (path, body) => request(path, json('PUT', body)),
  delete: (path) => request(path, { method: 'DELETE' }),
}

// sends image / video files, resolves to their stored paths
export async function uploadFiles(files) {
  if (files.length === 0) return []
  const form = new FormData()
  files.forEach((f) => form.append('files', f))
  const { urls } = await request('/uploads', { method: 'POST', body: form })
  return urls
}
