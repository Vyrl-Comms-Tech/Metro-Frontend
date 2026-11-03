import Banner from '../components/collection/Banner'
import StoneCard from '../components/StoneCard'
import { STONE_PAGES } from '../data/stonePages'
import '../styles/RecentGemstones.css'

// the Gemstone, Loose Diamond and Diamonds pages: a banner and a grid of stone cards (same look as the home page)
export default function StonePage({ page }) {
  const { title, intro, stones } = STONE_PAGES[page]

  return (
    <main className="collection">
      <Banner title={title} />
      <section className="recent-gemstones" aria-label={title}>
        <header className="rg-head">
          <p>{intro}</p>
        </header>

        <div className="rg-grid">
          {stones.map((stone) => (
            <StoneCard key={stone.id} stone={stone} to="/contact-us" linkLabel="Enquire" />
          ))}
        </div>
      </section>
    </main>
  )
}
