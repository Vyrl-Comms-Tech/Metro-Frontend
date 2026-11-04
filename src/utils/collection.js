import { RANGES } from '../data/collections'
import { CHECK_KEYS, RANGE_KEYS } from '../data/collectionFilters'

// 1200 -> "1k"
export const compact = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)

export const emptyFilters = (ranges = RANGES) => ({
  type: [],
  subCategory: [],
  gender: [],
  category: [],
  ringCovering: [],
  style: [],
  pendantType: [],
  shape: [],
  metal: [],
  gemstone: [],
  width: [ranges.width.min, ranges.width.max],
  carat: [ranges.carat.min, ranges.carat.max],
})

// a slider still at its full width is "not filtering", so it never hides a product
const rangeUntouched = (key, [lo, hi], ranges) => lo === ranges[key].min && hi === ranges[key].max

// does a product pass every filter (optionally ignoring one checkbox group)?
export const matchesFilters = (product, filters, skip, ranges = RANGES) =>
  CHECK_KEYS.every(
    (k) => k === skip || filters[k].length === 0 || filters[k].includes(product[k]),
  ) &&
  RANGE_KEYS.every(
    (k) =>
      rangeUntouched(k, filters[k], ranges) ||
      product[k] == null ||
      (product[k] >= filters[k][0] && product[k] <= filters[k][1]),
  )

// counts per option, taking the *other* active filters into account
export const countOptions = (products, filters, ranges = RANGES) => {
  const counts = {}
  for (const k of CHECK_KEYS) {
    counts[k] = {}
    for (const p of products) {
      if (matchesFilters(p, filters, k, ranges)) counts[k][p[k]] = (counts[k][p[k]] ?? 0) + 1
    }
  }
  return counts
}

export const sortProducts = (list, sort) => {
  if (sort === 'az') return [...list].sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'za') return [...list].sort((a, b) => b.name.localeCompare(a.name))
  return list
}

// number of filters currently applied (shown next to "Filters")
export const countActive = (filters, ranges = RANGES) =>
  CHECK_KEYS.reduce((n, k) => n + filters[k].length, 0) +
  RANGE_KEYS.filter(
    (k) => filters[k][0] !== ranges[k].min || filters[k][1] !== ranges[k].max,
  ).length
