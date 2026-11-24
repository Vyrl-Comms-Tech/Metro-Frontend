import axiosClient from '../utils/axiosClient'
import { useAsync } from '../utils/useAsync'
import '../styles/GalleryGrid.css'

export default function GalleryGrid({ limit = 12 }) {
  const { data, loading } = useAsync(() => axiosClient.get('/custom-jewellery', { params: { limit, active: true } }), [limit])

  const tiles = (data?.items ?? []).map((i) => ({ key: i.id, src: i.image, video: i.video, alt: i.title || 'Custom jewellery' }))

  // nothing added in the admin yet
  if (!loading && tiles.length === 0) return null

  return (
    <section className="gallery-grid" aria-labelledby="gallery-title">
      <header className="gg-head">
        <span className="gg-eyebrow">Custom Jewellery</span>
        <h2 id="gallery-title">Made Just For You</h2>
        <p>Real pieces and real moments from the Metro Jewellers family.</p>
      </header>

      <div className="gg-grid" aria-busy={loading} role={loading ? 'status' : undefined} aria-label={loading ? 'Loading custom jewellery' : undefined}>
        {loading ? (
          Array.from({ length: limit }, (_, index) => (
            <div className="gg-tile gg-tile-skeleton" key={index} aria-hidden="true" />
          ))
        ) : tiles.map((t) => (
          // <a className="gg-tile" key={t.key} href={href} target="_blank" rel="noreferrer" aria-label={t.alt}>
          <a className="gg-tile" key={t.key} target="_blank" rel="noreferrer" aria-label={t.alt}>
            {t.video ? (
              <video src={t.video} poster={t.src || undefined} autoPlay loop muted playsInline preload="metadata" />
            ) : (
              <img src={t.src} alt={t.alt} loading="lazy" />
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
