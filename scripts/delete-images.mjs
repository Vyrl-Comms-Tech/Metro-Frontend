// Jewellery products: removes the 5th image of rings/earrings and the 3rd image of necklaces (per variant).
//
// Dry run (default, changes nothing):
//   ADMIN_EMAIL=you@x.com ADMIN_PASSWORD=secret node scripts/delete-images.mjs
// Apply:
//   ADMIN_EMAIL=you@x.com ADMIN_PASSWORD=secret node scripts/delete-images.mjs --apply
//
// API URL comes from API_URL, or VITE_API_URL in .env.local.
import { readFileSync } from 'node:fs'

const APPLY = process.argv.includes('--apply')
// which image to drop (0-based index) per product type
const RULES = [
  { match: /ring|earring/i, index: 4, label: '5th' }, // rings + earrings
  { match: /necklace/i, index: 2, label: '3rd' },
]

function apiUrl() {
  if (process.env.API_URL) return process.env.API_URL
  try {
    const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    const m = env.match(/^VITE_API_URL=(.+)$/m)
    if (m) return m[1].trim().replace(/^["']|["']$/g, '')
  } catch { /* ignore */ }
  throw new Error('Set API_URL or VITE_API_URL')
}

const API = apiUrl().replace(/\/$/, '')
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD')

async function call(method, path, token, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${data.message ?? ''}`)
  return data
}

const listOf = (d) => (Array.isArray(d) ? d : d.products ?? d.items ?? d.data ?? d.rows ?? [])
const ruleFor = (p) =>
  /jewel/i.test(p.mainCategory ?? '')
    ? RULES.find((r) => r.match.test(`${p.subCategory ?? ''} ${p.category ?? ''}`))
    : undefined

const { accessToken } = await call('POST', '/auth/login', null, { email: ADMIN_EMAIL, password: ADMIN_PASSWORD })

const products = []
for (let page = 1; ; page++) {
  const batch = listOf(await call('GET', `/products/getAll?page=${page}&limit=100`, accessToken))
  products.push(...batch)
  if (batch.length < 100) break
}

const rings = products.filter(ruleFor)
console.log(`${APPLY ? 'APPLYING' : 'DRY RUN'}: ${rings.length} ring/earring/necklace products of ${products.length}`)

let changed = 0
for (const p of rings) {
  let touched = false
  const { index, label } = ruleFor(p)
  const variants = (p.variants ?? []).map((v) => {
    if ((v.images?.length ?? 0) <= index) return v
    console.log(`- ${p.id} "${v.name}": removing ${label} image ${v.images[index]}`)
    touched = true
    return { ...v, images: v.images.filter((_, i) => i !== index) }
  })
  if (!touched) continue
  changed++
  if (APPLY) {
    const { id, _id, createdAt, updatedAt, __v, ...data } = p
    await call('PUT', `/products/update/${p.id ?? _id}`, accessToken, { ...data, variants })
  }
}
console.log(`${changed} product(s) ${APPLY ? 'updated' : 'would be updated (re-run with --apply)'}`)
