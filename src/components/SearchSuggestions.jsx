import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import axiosClient from '../utils/axiosClient'
import { productPath } from '../utils/productPath'
import '../styles/SearchSuggestions.css'

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// bolds (or, with `as="mark"`, highlights) the part of `label` that matches what was typed
function Highlight({ label, text, as: Tag = 'strong' }) {
  const words = text.split(/\s+/).filter(Boolean).map((w) => escapeRegex(w.replace(/(?<=\w{3})s$/i, ''))).join('|')
  const parts = label.split(new RegExp(`(\\b(?:${words}))`, 'i'))
  return parts.map((part, i) => (i % 2 ? <Tag key={i}>{part}</Tag> : part))
}

const price = (n) => (n == null ? '' : `AED ${Number(n).toLocaleString('en-US')}`)

// the same layout as the results, shown while they load
function SuggestionsSkeleton() {
  return (
    <div className="search-results" aria-hidden="true">
      <section className="search-products">
        <h4><Skeleton width={110} /></h4>
        <ul>
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="search-sk-item">
              <Skeleton className="search-sk-thumb" />
              <span><Skeleton count={2} /></span>
            </li>
          ))}
        </ul>
      </section>
      <aside>
        <h4><Skeleton width={130} /></h4>
        <ul>
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i}><Skeleton width={`${60 + ((i * 17) % 35)}%`} /></li>
          ))}
        </ul>
      </aside>
    </div>
  )
}

// what matches the text typed in a search box: products, phrases to search for and collections
// `onSearch(phrase)` runs when a phrase is chosen; `onNavigate()` when a product or collection link is followed
export default function SearchSuggestions({ text, onSearch, onNavigate }) {
  const [result, setResult] = useState({ for: null, data: null })
  const typed = text.trim()

  // asks shortly after typing stops; each keystroke aborts the request still in flight, so an older answer never replaces a newer one
  useEffect(() => {
    if (!typed) return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      axiosClient
        .get('/products/suggestion', { params: { search: typed, limit: 6 }, signal: controller.signal })
        .then((data) => setResult({ for: typed, data }))
        .catch(() => !controller.signal.aborted && setResult({ for: typed, data: null }))
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [typed])

  if (!typed) return null
  if (result.for !== typed) return <SuggestionsSkeleton />
  const results = result.data
  if (!results) return null
  const empty = !results.products.length && !results.suggestions.length && !results.collections.length

  return (
    <div className="search-results">
      {empty && <p className="search-none">Nothing matches “{typed}”.</p>}

      {results.products.length > 0 && (
        <section className="search-products">
          <h4>Product matches</h4>
          <ul>
            {results.products.map((p) => (
              <li key={p.slug ?? p.productCode}>
                <Link to={productPath(p)} onClick={onNavigate}>
                  {p.image ? <img src={p.image} alt="" /> : <span className="search-thumb" />}
                  <span>
                    <span className="search-name"><Highlight label={p.name} text={typed} /></span>
                    <span className="search-price">{price(p.price)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(results.suggestions.length > 0 || results.collections.length > 0) && (
        <aside>
          {results.suggestions.length > 0 && (
            <section>
              <h4>Search suggestions</h4>
              <ul>
                {results.suggestions.map((s) => (
                  <li key={s}><button type="button" onClick={() => onSearch(s)}><Highlight label={s} text={typed} as="mark" /></button></li>
                ))}
              </ul>
            </section>
          )}
          {results.collections.length > 0 && (
            <section>
              <h4>Collections</h4>
              <ul>
                {results.collections.map((c) => (
                  <li key={c.to}><Link to={c.to} onClick={onNavigate}><Highlight label={c.title} text={typed} /></Link></li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      )}
    </div>
  )
}
