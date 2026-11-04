import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import ProductArt from './collection/ProductArt'
import axiosClient from '../utils/axiosClient'
import { productPath } from '../utils/productPath'
import { useWishlist } from '../context/wishlistContext'
import '../styles/RelatedProducts.css'

const LIMIT = 10
const MOBILE_LIMIT = 5

export default function RelatedProducts({ mainCategory, subCategory, currentSlug }) {
  const { has, toggle } = useWishlist()
  const [items, setItems] = useState([])

  useEffect(() => {
    let live = true
    const limit = window.matchMedia('(max-width: 700px)').matches ? MOBILE_LIMIT : LIMIT
    axiosClient
      .get('/products/getAll', { params: { mainCategory, subCategory, withVariation: true, cardDetails: true, limit, currentSlug } })
      .then((res) => live && setItems((res.items ?? []).slice(0, limit)))
      .catch(() => live && setItems([]))
    return () => {
      live = false
    }
  }, [mainCategory, subCategory, currentSlug])

  if (!items.length) return null

  return (
    <section className="related" aria-label="You might also like">
      <h2>You Might Also Like</h2>
      <Swiper
        className="related-slider"
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={12}
        slidesPerView={2}
        breakpoints={{
          700: { slidesPerView: 3, spaceBetween: 16 },
          1000: { slidesPerView: 4, spaceBetween: 20 },
          1300: { slidesPerView: 5, spaceBetween: 20 },
        }}
      >
        {items.map((p) => {
          const id = p.productCode ?? p.id
          const image = p.images?.[0] ?? p.image
          return (
            <SwiperSlide key={id}>
              <article className="prod">
                <Link to={productPath(p)} className="prod-img">
                  {image ? (
                    <>
                      <img src={image} alt="" />
                      {p.hoverImage && <img className="prod-hover" src={p.hoverImage} alt="" loading="lazy" />}
                    </>
                  ) : (
                    <ProductArt metal={p.metal} />
                  )}
                </Link>
                <button
                  className={`prod-wish ${has(id) ? 'on' : ''}`}
                  aria-label="Add to wishlist"
                  aria-pressed={has(id)}
                  onClick={() => toggle({ id, name: p.name, metal: p.metal, image, to: productPath(p) })}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill={has(id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
                  </svg>
                </button>
                <h3>
                  <Link to={productPath(p)}>{p.name}</Link>
                </h3>
              </article>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}
