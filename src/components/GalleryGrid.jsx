import { useSite } from '../context/siteContext'
import { GALLERY_IMAGES } from '../data/galleryImages'
import '../styles/GalleryGrid.css'

export default function GalleryGrid() {
  const { content } = useSite()
  const href = content.footer?.instagram || '#'

  return (
    <section className="gallery-grid" aria-labelledby="gallery-title">
      <header className="gg-head">
        <span className="gg-eyebrow">Custom Jewellery</span>
        <h2 id="gallery-title">Made Just For You</h2>
        <p>Real pieces and real moments from the Metro Jewellers family.</p>
      </header>

      <div className="gg-grid">
        {GALLERY_IMAGES.map((image, i) => (
          <a className="gg-tile" key={i} href={href} target="_blank" rel="noreferrer" aria-label={image.alt}>
            <img src={image.src} alt={image.alt} loading="lazy" />
          </a>
        ))}
      </div>
    </section>
  )
}
