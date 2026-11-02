import { Link } from 'react-router-dom'
import { ArrowRight, Gem } from 'lucide-react'
import StoneCard from './StoneCard'
import '../styles/RecentGemstones.css'
import axiosClient from '../utils/axiosClient'
import { useAsync } from '../utils/useAsync'

const previewGemstones = [
  { id: 'preview-sapphire', name: 'Sapphire', type: 'Natural', shape: 'Oval', carat: 2.15, color: 'Blue' },
  { id: 'preview-emerald', name: 'Emerald', type: 'Natural', shape: 'Emerald', carat: 3.02, color: 'Green' },
  { id: 'preview-ruby', name: 'Ruby', type: 'Natural', shape: 'Round', carat: 1.86, color: 'Red' },
  { id: 'preview-citrine', name: 'Citrine', type: 'Natural', shape: 'Oval', carat: 4.2, color: 'Yellow' },
  { id: 'preview-amethyst', name: 'Amethyst', type: 'Natural', shape: 'Cushion', carat: 5.1, color: 'Purple' },
]

export default function RecentGemstones() {
  const { data } = useAsync(() => axiosClient.get('/products/getAll', { params: { mainCategory: 'gemstones', limit: 5 } }), [])
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
        {gemstones.map((gemstone) => (
          <StoneCard
            key={gemstone.id}
            stone={gemstone}
            to={isPreview ? '/collections/gemstones' : `/product/${gemstone.id}`}
            linkLabel={isPreview ? 'Explore Gemstones' : 'View Details'}
          />
        ))}
      </div>

      <div className="rg-footer">
        <Link className="rg-view-all" to="/collections/gemstones">
          View All <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
