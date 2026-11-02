import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'
import { useWishlist } from '../context/wishlistContext'

const placeholder = '/gemstone-placeholder.png'

// one stone: photo with a wishlist heart, name, details and a link; styled by RecentGemstones.css
export default function StoneCard({ stone, to, linkLabel = 'View Details' }) {
  const { has, toggle } = useWishlist()
  const image = stone.images?.[0] || placeholder
  const title = stone.name
  const shape = stone.shape ? `${stone.shape} Cut` : ''
  const details = [stone.type, shape].filter(Boolean).join(' · ')
  const saved = has(stone.id)

  return (
    <article className="rg-card">
      <div className="rg-image-wrap">
        <img src={image} alt={`${title} stone`} loading="lazy" />
        <button
          className={`rg-wish ${saved ? 'is-saved' : ''}`}
          type="button"
          aria-label={`${saved ? 'Remove' : 'Add'} ${title} ${saved ? 'from' : 'to'} wishlist`}
          aria-pressed={saved}
          onClick={() => toggle({ id: stone.id, name: title, image, to })}
        >
          <Heart size={19} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>

      <div className="rg-body">
        <h3>{title}</h3>
        {details && <p className="rg-meta">{details}</p>}
        <div className="rg-tags">
          {stone.carat != null && <span>{Number(stone.carat).toFixed(2)} Carat</span>}
          {stone.shape && <span>{stone.shape}</span>}
          {(stone.color || stone.gemstone) && <span>{stone.color || stone.gemstone}</span>}
        </div>
        <Link className="rg-details" to={to}>
          {linkLabel} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
