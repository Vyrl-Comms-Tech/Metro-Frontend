import { Link } from 'react-router-dom'
import { ArrowRight, Gem, Heart } from 'lucide-react'
import { assetUrl } from '../api/client'
import { listProducts } from '../api/products'
import { useAsync } from '../api/useAsync'
import { useWishlist } from '../context/wishlistContext'
import '../styles/RecentGemstones.css'

const placeholder = '/gemstone-placeholder.png'

const previewGemstones = [
  { id: 'preview-sapphire', name: 'Sapphire', type: 'Natural', shape: 'Oval', carat: 2.15, color: 'Blue' },
  { id: 'preview-emerald', name: 'Emerald', type: 'Natural', shape: 'Emerald', carat: 3.02, color: 'Green' },
  { id: 'preview-ruby', name: 'Ruby', type: 'Natural', shape: 'Round', carat: 1.86, color: 'Red' },
  { id: 'preview-citrine', name: 'Citrine', type: 'Natural', shape: 'Oval', carat: 4.2, color: 'Yellow' },
  { id: 'preview-amethyst', name: 'Amethyst', type: 'Natural', shape: 'Cushion', carat: 5.1, color: 'Purple' },
]

export default function RecentGemstones() {
  const { data } = useAsync(() => listProducts({ collectionSlug: 'gemstones', limit: 5 }), [])
  const { has, toggle } = useWishlist()
  const isPreview = !data?.items?.length
  const gemstones = isPreview ? previewGemstones : data.items

  return (
    <section className="recent-gemstones" aria-labelledby="recent-gemstones-title">
      <header className="rg-head">
        <span className="rg-eyebrow"><Gem size={14} aria-hidden="true" /> Gemstones</span>
        <h2 id="recent-gemstones-title">Recently Added Gemstones</h2>
        <p>Explore our collection of natural and lab grown gemstones.</p>
      </header>

      <div className="rg-grid">
        {gemstones.map((gemstone) => {
          const image = assetUrl(gemstone.images?.[0]) || placeholder
          const to = isPreview ? '/collections/gemstones' : `/product/${gemstone.id}`
          const title = gemstone.name
          const shape = gemstone.shape ? `${gemstone.shape} Cut` : ''
          const details = [gemstone.type, shape].filter(Boolean).join(' · ')

          return (
            <article className="rg-card" key={gemstone.id}>
              <div className="rg-image-wrap">
                <img src={image} alt={`${title} gemstone`} loading="lazy" />
                <button
                  className={`rg-wish ${has(gemstone.id) ? 'is-saved' : ''}`}
                  type="button"
                  aria-label={`${has(gemstone.id) ? 'Remove' : 'Add'} ${title} ${has(gemstone.id) ? 'from' : 'to'} wishlist`}
                  aria-pressed={has(gemstone.id)}
                  onClick={() => toggle({ id: gemstone.id, name: title, image, to })}
                >
                  <Heart size={19} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </div>

              <div className="rg-body">
                <h3>{title}</h3>
                {details && <p className="rg-meta">{details}</p>}
                <div className="rg-tags">
                  {gemstone.carat != null && <span>{Number(gemstone.carat).toFixed(2)} Carat</span>}
                  {gemstone.shape && <span>{gemstone.shape}</span>}
                  {(gemstone.color || gemstone.gemstone) && <span>{gemstone.color || gemstone.gemstone}</span>}
                </div>
                <Link className="rg-details" to={to}>
                  {isPreview ? 'Explore Gemstones' : 'View Details'} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <div className="rg-footer">
        <Link className="rg-view-all" to="/collections/gemstones">
          View All <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
