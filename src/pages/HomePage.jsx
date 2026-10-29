import Hero from '../components/Hero'
import Categories from '../components/Categories'
import RecentGemstones from '../components/RecentGemstones'
import GoldChart from '../components/GoldChart'
import Reels from '../components/Reels'
import Faq from '../components/Faq'
import GalleryGrid from '../components/GalleryGrid'

export default function HomePage() {
  return (
    <>
      <Hero />
      <GoldChart />
      <RecentGemstones />
      <Categories />
      <Reels />
      <GalleryGrid />
      <Faq />
    </>
  )
}
