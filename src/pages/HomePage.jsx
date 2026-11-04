import Hero from '../components/Hero'
import Categories from '../components/Categories'
import RecentGemstones from '../components/RecentGemstones'
import GoldChart from '../components/GoldChart'
import Reels from '../components/Reels'
import Faq from '../components/Faq'
import GalleryGrid from '../components/GalleryGrid'
import '../styles/HomePage.css'

export default function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <GoldChart />
      <RecentGemstones />
      <Categories />
      <GalleryGrid limit={12} />
      <Reels />
      <Faq />
    </main>
  )
}
