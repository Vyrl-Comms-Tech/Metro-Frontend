import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import StoneCard from './StoneCard'
import '../styles/RecentGemstones.css'
import axiosClient from '../utils/axiosClient'
import { useAsync } from '../utils/useAsync'
import { useSite } from '../context/siteContext'
import { productPath } from '../utils/productPath'
import { useState, useRef, useEffect } from 'react'

// placeholder cards, shown until the gemstones arrive from the server
function StoneSkeletons({ count = 5 }) {
  return Array.from({ length: count }, (_, i) => (
    <article key={i} className="rg-card rg-card-sk" aria-hidden="true">
      <div className="rg-image-wrap">
        <Skeleton height="100%" style={{ display: 'block', borderRadius: 0 }} />
      </div>
      <div className="rg-body">
        <Skeleton width="55%" height={12} />
        <Skeleton width="85%" height={18} style={{ marginTop: 10 }} />
      </div>
    </article>
  ))
}

export default function RecentGemstones() {
  const { publicCategories } = useSite()
  const [limit, setLimit] = useState(
    window.innerWidth <= 768 ? 6 : 5
  );


  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth <= 768 ? 4 : 5);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);




  const mainCategory = publicCategories.find((category) => /^gemstones?$/.test(category.slug))?.slug
  const { data } = useAsync(
    () => (mainCategory ? axiosClient.get('/products/getAll', { params: { mainCategory, limit: limit } }) : Promise.resolve(null)),
    [mainCategory],
  )
  const gemstones = data?.items ?? []

  return (
    <section className="recent-gemstones" aria-labelledby="recent-gemstones-title">
      <header className="rg-head">
        <span className="rg-eyebrow">Gemstones</span>
        <h2 id="recent-gemstones-title">Recently Added Gemstones</h2>
        <p>Explore our collection of natural and lab grown gemstones.</p>
      </header>

      <div className="rg-grid" aria-busy={!gemstones.length}>
        {gemstones.length ? (
          gemstones.map((gemstone) => (
            <StoneCard key={gemstone.id} stone={gemstone} to={productPath(gemstone, gemstone.variants?.[0])} />
          ))
        ) : (
          <StoneSkeletons />
        )}
      </div>

      <div className="rg-footer">
        <Link className="rg-view-all" to="/gemstone">
          View All <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
