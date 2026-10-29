import { Link } from 'react-router-dom'
import FaqList from './FaqList'
import { toFaqItem } from '../utils/faq'
import '../styles/Faq.css'
import axiosClient from '../utils/axiosClient'
import { useAsync } from '../utils/useAsync'

export default function Faq() {
  const { data } = useAsync(() => axiosClient.get('/faqs', { params: { featured: true, limit: 100 } }), [])
  const items = (data?.items ?? []).map(toFaqItem)

  // nothing marked "featured" in the admin yet
  if (items.length === 0) return null

  return (
    <section className="faq">
      <header className="faq-head">
        <span className="faq-eyebrow">Need to know</span>
        <h2>Frequently Asked Questions</h2>
      </header>

      <FaqList items={items} idPrefix="home-faq" />

      <div className="faq-more">
        <Link to="/faqs" className="faq-all">View All FAQs</Link>
      </div>
    </section>
  )
}
