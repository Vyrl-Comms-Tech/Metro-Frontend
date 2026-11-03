import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { CHECK_GROUPS, SORTS } from '../data/collectionFilters'
import Breadcrumb from '../components/Breadcrumb'
import CheckGroup from '../components/collection/CheckGroup'
import Chevron from '../components/collection/Chevron'
import ProductArt from '../components/collection/ProductArt'
import ProductSkeleton from '../components/collection/ProductSkeleton'
import SearchSuggestions from '../components/SearchSuggestions'
import axiosClient from '../utils/axiosClient'
import { productPath } from '../utils/productPath'
import '../styles/Collection.css'
import '../styles/SearchPage.css'

const PER_PAGE = 15

// the filter groups the server counts for a search; each one is a URL parameter holding the chosen values, comma separated
const GROUPS = CHECK_GROUPS.filter((g) => g.key !== 'subCategory').map((g) => ({ ...g, param: g.key === 'type' ? 'diamondType' : g.key }))

// only these sorts are offered; the first one (no `sort` in the URL) is the server's own order
const SORT_OPTIONS = SORTS.filter((s) => ['az', 'za'].includes(s.value))

// the search box, with the suggestions dropping down under it while the visitor types
function SearchBox({ initial, onSearch }) {
  const [text, setText] = useState(initial)
  const [open, setOpen] = useState(false)
  const box = useRef(null)

  // a click outside the box or Escape closes the suggestions
  useEffect(() => {
    const close = (e) => (e.type === 'keydown' ? e.key === 'Escape' : !box.current?.contains(e.target)) && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setOpen(false)
    if (text.trim()) onSearch(text.trim())
  }
  return (
    <div className="search-page-wrap" ref={box}>
      <form className="search-page-box" role="search" onSubmit={submit}>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setOpen(true)
            if (!e.target.value.trim()) onSearch('') // an emptied box leaves the URL too
          }}
          placeholder="Search products"
          aria-label="Search products"
          autoFocus={!initial} // the box is rebuilt when the search changes, an emptied one keeps the cursor
        />
        {text && (
          <button type="button" className="search-clear" aria-label="Clear search" onClick={() => {
            setText('')
            setOpen(false)
            onSearch('')
          }}><X size={18} /></button>
        )}
        <button type="submit" aria-label="Search">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </form>
      {open && text.trim() && (
        <div className="search-dropdown">
          <SearchSuggestions text={text} onSearch={onSearch} onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}

// the search text, the chosen filters and the sort all live in the URL, so a search can be shared and survives a reload
export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const sort = params.get('sort') ?? ''
  const [showFilters, setShowFilters] = useState(false)
  const [facets, setFacets] = useState({})
  const [result, setResult] = useState({ key: null, items: [], meta: { page: 0, hasNext: false, total: 0 }, error: null })
  const [loadingMore, setLoadingMore] = useState(false)

  const chosen = useMemo(
    () => Object.fromEntries(GROUPS.map((g) => [g.param, params.get(g.param)?.split(',').filter(Boolean) ?? []])),
    [params],
  )
  const active = Object.values(chosen).reduce((n, v) => n + v.length, 0)

  // what the server needs: the text, the chosen filters and the sort
  const apiParams = useMemo(() => {
    const p = { q: query, sort }
    for (const [param, values] of Object.entries(chosen)) if (values.length) p[param] = values.join(',')
    return p
  }, [query, sort, chosen])
  const key = JSON.stringify(apiParams)

  // the first page and the filter counts, again whenever the search text, a filter or the sort changes
  useEffect(() => {
    if (!query) return
    let live = true
    axiosClient
      .get('/products/getAll', { params: { ...apiParams, withVariation: true, cardDetails: true, limit: PER_PAGE } })
      .then((res) => {
        if (!live) return
        setResult({ key, items: res.items ?? [], meta: { page: res.page, hasNext: res.hasNext, total: res.total }, error: null })
      })
      .catch((error) => live && setResult({ key, items: [], meta: { page: 0, hasNext: false, total: 0 }, error }))
    axiosClient
      .get('/products/filters', { params: { ...apiParams, sort: undefined } })
      .then((res) => live && setFacets(res))
      .catch(() => live && setFacets({}))
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // a new search or filter shows the skeleton until its first page arrives
  const loading = Boolean(query) && result.key !== key
  const { items, meta, error } = result
  const state = { loading, loadingMore, error }

  const loadMore = () => {
    setLoadingMore(true)
    axiosClient
      .get('/products/getAll', { params: { ...apiParams, withVariation: true, cardDetails: true, limit: PER_PAGE, page: meta.page + 1 } })
      .then((res) => {
        setResult((prev) => ({ ...prev, items: [...prev.items, ...(res.items ?? [])], meta: { page: res.page, hasNext: res.hasNext, total: res.total } }))
        setLoadingMore(false)
      })
      .catch(() => setLoadingMore(false))
  }

  // changes the URL; `replace` keeps the back button for whole searches rather than every tick of a checkbox
  const update = (changes) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [name, value] of Object.entries(changes)) {
          if (value == null || value === '' || value.length === 0) next.delete(name)
          else next.set(name, Array.isArray(value) ? value.join(',') : value)
        }
        return next
      },
      { replace: true },
    )

  const toggle = (param, value) =>
    update({ [param]: chosen[param].includes(value) ? chosen[param].filter((v) => v !== value) : [...chosen[param], value] })

  const clearAll = () => update(Object.fromEntries(GROUPS.map((g) => [g.param, ''])))

  const groups = GROUPS.map((g) => {
    const facet = facets[g.param] ?? []
    return { ...g, options: facet.map((f) => f.value), counts: Object.fromEntries(facet.map((f) => [f.value, f.count])) }
  }).filter((g) => g.options.length > 0)

  return (
    <>
    <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
    <main className="collection search-page">
      <SearchBox key={query} initial={query} onSearch={(q) => setParams(q ? { q } : {})} /> {/* a new search starts without the old filters */}

      {!query ? (
        <p className="col-empty">Type something to search.</p>
      ) : (
        <div className="col-layout">
          <aside className={`col-side ${showFilters ? 'show' : ''}`}>
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
                <button className="col-clear" onClick={clearAll}>
                  Clear all filters
                </button>
              )}
              {groups.map((g) => (
                <CheckGroup
                  key={g.key}
                  title={g.title}
                  options={g.options}
                  counts={g.counts}
                  selected={chosen[g.param]}
                  onToggle={(v) => toggle(g.param, v)}
                  scroll={g.scroll}
                  defaultOpen={g.defaultOpen}
                />
              ))}
            </div>
          </aside>

          <section className="col-main">
            <div className="col-toolbar">
              <p>
                {!state.loading && !state.error && (
                  <>
                    <b>{meta.total}</b> results for ‘<b>{query}</b>’
                  </>
                )}
              </p>
              <div className="col-sort">
                <select value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort by">
                  <option value="">Relevance</option>
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>

            {state.error && items.length === 0 && <p className="col-status">{state.error.message}</p>}
            {!state.loading && !state.error && items.length === 0 && <p className="col-empty">Nothing matches “{query}”.</p>}

            <div className="col-grid">
              {state.loading && <ProductSkeleton count={6} />}
              {!state.loading &&
                items.map((p) => (
                  <article key={p.productCode ?? p.id} className="prod">
                    <Link to={productPath(p)} className="prod-img">
                      {p.image ? <img src={p.image} alt="" /> : <ProductArt metal={p.metal} />}
                      {p.hoverImage && <img className="prod-hover" src={p.hoverImage} alt="" loading="lazy" />}
                    </Link>
                    <h3>
                      <Link to={productPath(p)}>{p.name}</Link>
                    </h3>
                    <p className="search-card-foot">
                      <Link to={productPath(p)}>View Details →</Link>
                    </p>
                  </article>
                ))}
              {state.loadingMore && <ProductSkeleton count={3} />}
            </div>

            {!state.loading && meta.hasNext && (
              <div className="col-more">
                <button className="btn-outline" disabled={state.loadingMore} onClick={loadMore}>
                  Load more
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
    </>
  )
}
