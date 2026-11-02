import { Link, useSearchParams } from 'react-router-dom'
import ProductArt from '../components/collection/ProductArt'
import ProductSkeleton from '../components/collection/ProductSkeleton'
import axiosClient from '../utils/axiosClient'
import { productPath } from '../utils/productPath'
import { useAsync } from '../utils/useAsync'
import '../styles/Collection.css'
import '../styles/SearchPage.css'

export default function SearchPage() {
  const query = useSearchParams()[0].get('q')?.trim() ?? ''
  const { data, error, loading } = useAsync(
    () => axiosClient.get('/products/getAll', { params: { q: query, withVariation: true, cardDetails: true, limit: 60 } }),
    [query],
  )
  const items = data?.items ?? []

  return (
    <main className="collection search-page">
      <h1>Search results for “{query}”</h1>
      {!loading && !error && <p className="search-count">{data.total} products</p>}

      {error && <p className="col-status">{error.message}</p>}
      {!loading && !error && items.length === 0 && <p className="col-empty">Nothing matches “{query}”.</p>}

      <div className="col-main">
        <div className="col-grid">
          {loading && <ProductSkeleton count={6} />}
          {items.map((p) => (
            <article key={p.productCode ?? p.id} className="prod">
              <Link to={productPath(p)} className="prod-img">
                {p.image ? <img src={p.image} alt="" /> : <ProductArt metal={p.metal} />}
              </Link>
              <h3><Link to={productPath(p)}>{p.name}</Link></h3>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
