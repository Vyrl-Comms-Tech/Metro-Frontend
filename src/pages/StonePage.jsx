import { useCallback, useMemo, useState } from 'react'
import Banner from '../components/collection/Banner'
import CheckGroup from '../components/collection/CheckGroup'
import Chevron from '../components/collection/Chevron'
import CollectionSkeleton from '../components/collection/CollectionSkeleton'
import RangeGroup from '../components/collection/RangeGroup'
import { DrawerBackdrop, DrawerFoot, DrawerHead, FilterButton } from '../components/collection/FilterDrawer'
import { onDrawerScreen, useDrawerLock } from '../utils/useDrawerLock'
import StoneCard from '../components/StoneCard'
import { STONE_PAGES } from '../data/stonePages'
import { useSite } from '../context/siteContext'
import axiosClient from '../utils/axiosClient'
import { productPath } from '../utils/productPath'
import { useAsync } from '../utils/useAsync'
import '../styles/Collection.css'
import '../styles/RecentGemstones.css'

// the main category each stone page lists products from; the Gemstone category may be saved as "gemstone" or "gemstones"
const MAIN_CATEGORY = { gemstone: /^gemstones?$/, 'loose-diamond': /^loose-diamond$/, diamonds: /^diamonds$/ }

const NO_FILTERS = { gemstone: [], type: [], shape: [] }
const SORTS = [
  { value: 'best', label: 'Best selling' },
  { value: 'carat-asc', label: 'Carat: small to large' },
  { value: 'carat-desc', label: 'Carat: large to small' },
]

// the stone's own facts for the filters (the sample stones are named by their stone)
const FACETS = {
  gemstone: (stone) => stone.gemstone ?? stone.name,
  type: (stone) => stone.type ?? stone.variants?.[0]?.type,
  shape: (stone) => stone.shape,
}
const GROUPS = [
  { key: 'gemstone', title: 'Gemstone', scroll: true },
  { key: 'type', title: 'Natural / Lab Grown' },
  { key: 'shape', title: 'Shape', scroll: true },
]

const unique = (values) => [...new Set(values.filter(Boolean))].sort()
const boundsOf = (values, step) => {
  const nums = values.filter((n) => n != null && !Number.isNaN(n)).map(Number)
  if (!nums.length) return null
  const min = Math.floor(Math.min(...nums) / step) * step
  const max = Math.ceil(Math.max(...nums) / step) * step
  return min === max ? null : { min: Number(min.toFixed(2)), max: Number(max.toFixed(2)), step: step >= 1 ? step : 0.1 }
}
const ticksOf = ({ min, max }) => {
  const count = Math.min(10, Math.max(2, Math.round(max - min)))
  return Array.from({ length: count + 1 }, (_, i) => Number((min + ((max - min) * i) / count).toFixed(2)))
}

// the Gemstone, Loose Diamond and Diamonds pages: a banner, filters on the left and a grid of stone cards (same look as the collections).
// Stones added in the dashboard show here; the samples stay until the first one is added.
export default function StonePage({ page }) {
  const { title, intro, stones: samples } = STONE_PAGES[page]
  const { publicCategories, loaded } = useSite()
  const mainCategory = publicCategories.find((category) => MAIN_CATEGORY[page].test(category.slug))?.slug
  const { data, loading } = useAsync(
    () =>
      mainCategory
        ? axiosClient.get('/products/getAll', { params: { mainCategory, limit: 100 } })
        : Promise.resolve(null),
    [mainCategory],
  )
  const added = data?.items ?? []
  const stones = added.length ? added : samples

  const [filters, setFilters] = useState(NO_FILTERS)
  const [caratRange, setCaratRange] = useState(null) // null = the whole range
  const [sort, setSort] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const closeFilters = useCallback(() => setShowFilters(false), [])
  useDrawerLock(showFilters, closeFilters)
  const [groupsOpen] = useState(() => !onDrawerScreen()) // in the filter panel every group starts closed

  const caratBounds = useMemo(() => boundsOf(stones.map((s) => s.carat), 1), [stones])
  const carat = caratRange ?? (caratBounds && [caratBounds.min, caratBounds.max])

  const toggle = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }))

  const groups = useMemo(
    () =>
      GROUPS.map((group) => {
        const options = unique(stones.map(FACETS[group.key]))
        const counts = Object.fromEntries(options.map((o) => [o, stones.filter((s) => FACETS[group.key](s) === o).length]))
        return { ...group, options, counts }
      }).filter((group) => group.options.length > 0),
    [stones],
  )

  const shown = useMemo(() => {
    const inRange = (value, range) => !range || value == null || (Number(value) >= range[0] && Number(value) <= range[1])
    const list = stones.filter(
      (stone) =>
        GROUPS.every(({ key }) => !filters[key].length || filters[key].includes(FACETS[key](stone))) &&
        inRange(stone.carat, caratRange),
    )
    const [key, direction] = sort.split('-')
    if (!key || key === 'best') return list
    const sign = direction === 'desc' ? -1 : 1
    return [...list].sort((a, b) => sign * ((a[key] ?? 0) - (b[key] ?? 0)))
  }, [stones, filters, caratRange, sort])

  const active = Object.values(filters).flat().length + (caratRange ? 1 : 0)
  const clear = () => {
    setFilters(NO_FILTERS)
    setCaratRange(null)
  }

  // the real stones are on their way: placeholders, not the samples
  if (!loaded || loading) {
    return (
      <main className="collection">
        <Banner title={title} />
        <CollectionSkeleton />
      </main>
    )
  }

  return (
    <main className="collection">
      <Banner title={title} />

      <div className="col-layout col-drawer">
        <DrawerBackdrop open={showFilters} onClose={closeFilters} />
        <aside className={`col-side ${showFilters ? 'show' : ''}`}>
          <DrawerHead active={active} onClose={closeFilters} />
          <button className="col-filter-toggle" onClick={() => setShowFilters((s) => !s)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
              <circle cx="16" cy="7" r="2" />
              <circle cx="8" cy="17" r="2" />
            </svg>
            Filters{active > 0 && ` (${active})`}
          </button>

          <div className="col-filters">
            {active > 0 && (
              <button className="col-clear" onClick={clear}>
                Clear all filters
              </button>
            )}

            {groups.map((group) => (
              <CheckGroup
                key={group.key}
                title={group.title}
                options={group.options}
                counts={group.counts}
                selected={filters[group.key]}
                onToggle={(value) => toggle(group.key, value)}
                scroll={group.scroll}
                defaultOpen={groupsOpen}
              />
            ))}

            {caratBounds && (
              <RangeGroup title="Carat weight" defaultOpen={groupsOpen} bounds={caratBounds} ticks={ticksOf(caratBounds)} value={carat} onChange={setCaratRange} />
            )}
          </div>
          <DrawerFoot count={shown.length} label={shown.length === 1 ? 'stone' : 'stones'} active={active} onReset={clear} onClose={closeFilters} />
        </aside>

        <section className="col-main">
          <div className="col-toolbar">
            <FilterButton active={active} onOpen={() => setShowFilters(true)} />
            <p>
              <b>{shown.length}</b> {shown.length === 1 ? 'stone' : 'stones'}
            </p>
            <div className="col-sort">
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
                <option value="">Sort By</option>
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>

          {/* <p className="col-preview-note">{intro}</p> */}

          {shown.length === 0 ? (
            <p className="col-empty">No stones match these filters.</p>
          ) : (
            <div className="recent-gemstones rg-embedded" aria-label={title}>
              <div className="rg-grid">
                {shown.map((stone) => (
                  <StoneCard
                    key={stone.id}
                    stone={stone}
                    to={added.length ? productPath(stone, stone.variants?.[0]) : '/contact-us'}
                    linkLabel={added.length ? 'View Details' : 'Enquire'}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
