import Hero from '../components/Hero'
import Categories from '../components/Categories'
import GoldChart from '../components/GoldChart'
import Reels from '../components/Reels'
import Faq from '../components/Faq'

export default function HomePage() {
  return (
    <>
      <Hero />
      <GoldChart />
      <Categories />
      <Reels />
      <Faq />
    </>
  )
}
