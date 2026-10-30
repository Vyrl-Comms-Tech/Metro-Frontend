import { RANGES } from '../data/collections'
import { CHECK_KEYS, RANGE_KEYS } from '../data/collectionFilters'

// 1200 -> "1k"
export const compact = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)

export const emptyFilters = () => ({
  type: [],
  subCategory: [],
  category: [],
  pendantType: [],
  shape: [],
  metal: [],
  gemstone: [],
  width: [RANGES.width.min, RANGES.width.max],
  carat: [RANGES.carat.min, RANGES.carat.max],
})

// a slider still at its full width is "not filtering", so it never hides a product
const rangeUntouched = (key, [lo, hi]) => lo === RANGES[key].min && hi === RANGES[key].max

// does a product pass every filter (optionally ignoring one checkbox group)?
export const matchesFilters = (product, filters, skip) =>
  CHECK_KEYS.every(
    (k) => k === skip || filters[k].length === 0 || filters[k].includes(product[k]),
  ) &&
  RANGE_KEYS.every(
    (k) =>
      rangeUntouched(k, filters[k]) ||
      product[k] == null ||
      (product[k] >= filters[k][0] && product[k] <= filters[k][1]),
  )

// counts per option, taking the *other* active filters into account
export const countOptions = (products, filters) => {
  const counts = {}
  for (const k of CHECK_KEYS) {
    counts[k] = {}
    for (const p of products) {
      if (matchesFilters(p, filters, k)) counts[k][p[k]] = (counts[k][p[k]] ?? 0) + 1
    }
  }
  return counts
}

export const sortProducts = (list, sort) => {
  if (sort === 'az') return [...list].sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'za') return [...list].sort((a, b) => b.name.localeCompare(a.name))
  if (sort === 'priceAsc') return [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
  if (sort === 'priceDesc') return [...list].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
  return list
}

// number of filters currently applied (shown next to "Filters")
export const countActive = (filters) =>
  CHECK_KEYS.reduce((n, k) => n + filters[k].length, 0) +
  RANGE_KEYS.filter(
    (k) => filters[k][0] !== RANGES[k].min || filters[k][1] !== RANGES[k].max,
  ).length
