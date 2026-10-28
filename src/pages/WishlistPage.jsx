import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ProductArt from '../components/collection/ProductArt'
import { useWishlist } from '../context/wishlistContext'
import '../styles/Wishlist.css'

export default function WishlistPage() {
  const { items, remove } = useWishlist()

  return (
    <main className="wishlist">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />

      <div className="wl-body">
        <header className="wl-head">
          <h1>My Wishlist</h1>
          {items.length > 0 && <p>{items.length} saved {items.length === 1 ? 'piece' : 'pieces'}</p>}
        </header>

        {items.length === 0 ? (
          <div className="wl-empty">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
            </svg>
            <h2>Your wishlist is empty</h2>
            <p>Tap the star on any piece to save it here.</p>
            <Link to="/collections/jewellery" className="wl-browse">Browse jewellery</Link>
          </div>
        ) : (
          <ul className="wl-grid">
            {items.map((item) => (
              <li key={item.id} className="wl-card">
                <Link to={item.to} className="wl-img">
                  {item.image ? <img src={item.image} alt="" /> : <ProductArt metal={item.metal} />}
                </Link>
                <button className="wl-remove" onClick={() => remove(item.id)} aria-label={`Remove ${item.name} from wishlist`}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
                <h3><Link to={item.to}>{item.name}</Link></h3>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
