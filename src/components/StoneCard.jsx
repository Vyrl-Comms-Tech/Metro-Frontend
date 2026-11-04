import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../context/wishlistContext'

const placeholder = '/gemstone-placeholder.png'

export default function StoneCard({ stone, to, linkLabel = 'View Details' }) {
  const { has, toggle } = useWishlist()
  const image = stone.images?.[0] || placeholder
  const title = stone.name
  const shape = stone.shape ? `${stone.shape} Cut` : ''
  const details = [stone.type, shape].filter(Boolean).join(' · ')
  const saved = has(stone.id)

  return (
    <article className="rg-card">
      <Link className="rg-card-link" to={to} aria-label={`${linkLabel}: ${title}`}>
        <div className="rg-image-wrap">
          <img src={image} alt={`${title} stone`} loading="lazy" />
        </div>
        <div className="rg-body">
          {details && <p className="rg-meta">{details}</p>}
          <h3>{title}</h3>
        </div>
      </Link>
      <button
        className={`rg-wish ${saved ? 'is-saved' : ''}`}
        type="button"
        aria-label={`${saved ? 'Remove' : 'Add'} ${title} ${saved ? 'from' : 'to'} wishlist`}
        aria-pressed={saved}
        onClick={() => toggle({ id: stone.id, name: title, image, to })}
      >
        <Heart size={18} strokeWidth={1.7} aria-hidden="true" />
      </button>
    </article>
  )
}
