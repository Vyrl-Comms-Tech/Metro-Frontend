import Hero from '../components/Hero'
import Categories from '../components/Categories'
import RecentGemstones from '../components/RecentGemstones'
import GoldRates from '../components/GoldRates'
import Reels from '../components/Reels'
import Faq from '../components/Faq'
import GalleryGrid from '../components/GalleryGrid'
import '../styles/HomePage.css'

export default function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <GoldRates />
      <RecentGemstones />
      <Categories />
      <GalleryGrid limit={12} />
      <Reels />
      <Faq />
    </main>
  )
}
