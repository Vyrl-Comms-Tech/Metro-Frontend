import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronUp, Mail, Phone } from 'lucide-react'
import { useSite } from '../context/siteContext'
import '../styles/Footer.css'

const COLUMNS = [
  {
    title: 'Top Categories',
    links: [
      { label: 'Recently Made Rings', to: '/collections/engagement-rings' },
      { label: 'Diamond Studs', to: '/collections/earrings' },
      { label: 'Tennis Bracelets', to: '/collections/bracelets' },
      { label: 'Wedding Rings', to: '/collections/wedding-rings' },
      { label: 'Jewellery', to: '/collections/jewellery' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'info@metrojewellers.com', href: 'mailto:info@metrojewellers.com', icon: Mail },
      { label: '+971 52 360 6874', href: 'tel:+0559710431', icon: Phone },
      { label: 'Terms & Conditions', to: '/terms-conditions' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
    ],
  },
  {
    title: 'Our Guarantee',
    links: [
      { label: 'Worldwide Shipping', to: '/faqs#collection-shipping-information' },
      { label: '30 days returns', to: '/faqs#returns-refunds-cancellations-and-warranties' },
      { label: 'Lifetime Warranty', to: '/faqs#returns-refunds-cancellations-and-warranties' },
      { label: 'Contact Us', to: '/contact-us' },
      { label: 'Refunds & Returns Policy', to: '/faqs#returns-refunds-cancellations-and-warranties' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Gemstones', to: '/gemstone' },
      { label: 'Loose Diamonds', to: '/loose-diamond' },
      { label: 'Diamonds', to: '/diamonds' },
      { label: 'Custom Jewellery', to: '/custom-jewellery' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'FAQs', to: '/faqs' },
    ],
  },
]

const psvg = { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const fsvg = { viewBox: '0 0 24 24', width: 30, height: 30, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const isvg = { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const xsvg = { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

const SOCIALS = [
  { name: 'Pinterest', icon: <svg {...psvg}><circle cx="12" cy="12" r="9" /><path d="M11 8.5c2.5-1 4.5.5 4 3-.4 2-2 3-3.5 2.5M11.5 11 10 18" /></svg> },
  { name: 'Facebook', icon: <svg {...fsvg}><path d="M14 8h2V4h-2.5C11 4 10 5.5 10 7.5V10H8v3.5h2V20h3.5v-6.5H16l.5-3.5h-3V8.2c0-.1 0-.2.5-.2Z" /></svg> },
  { name: 'Instagram', icon: <svg {...isvg}><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" /></svg> },
  { name: 'X', icon: <svg {...xsvg}><path d="m5 5 14 14M19 5 5 19" /></svg> },
]

function FooterLink({ link }) {
  const Icon = link.icon
  if (link.href) {
    return (
      <a href={link.href}>
        {Icon && <Icon size={15} strokeWidth={1.7} aria-hidden="true" />}
        {link.label}
      </a>
    )
  }
  return <Link to={link.to}>{link.label}</Link>
}

function Newsletter({ text, instagram }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    // TODO: send `email` to the mailing-list backend
    setDone(true)
    setEmail('')
  }

  return (
    <div className="ft-col ft-news">
      <h4>Newsletter</h4>
      <p>{text}</p>
      <form onSubmit={submit}>
        <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); setDone(false) }} aria-label="Email address" />
        <button type="submit" aria-label="Subscribe">
          <ArrowRight size={18} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </form>
      {done && <p className="ft-thanks" role="status">Thank you for subscribing!</p>}
      <div className="ft-social">
        {SOCIALS.map((s) => (
          <a key={s.name} href={s.name === 'Instagram' ? instagram : '#'} aria-label={s.name}>{s.icon}</a>
        ))}
      </div>
    </div>
  )
}

function FloatingButtons({ whatsapp }) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a className="fab fab-wa" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.22-.36a9.44 9.44 0 0 1-1.45-5.04c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46zM12.04 0C5.46 0 .1 5.35.1 11.94c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.19-3.5-8.44A11.86 11.86 0 0 0 12.04 0z" />
        </svg>
      </a>
      <button className={`fab fab-top ${showTop ? 'show' : ''}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ChevronUp size={20} strokeWidth={2} aria-hidden="true" />
      </button>
    </>
  )
}

export default function Footer() {
  const { content, categories: allCategories } = useSite()
  const { contact, footer } = content
  const categories = allCategories.filter((c) => c.active !== false)

  // top categories follow the collections set up in the admin; fall back to the built-in list
  const columns = COLUMNS.map((col) => {
    if (col.title === 'Top Categories' && categories.length > 0) {
      return {
        ...col,
        links: categories.slice(0, 5).map((c) => ({ label: c.title, to: `/collections/${c.slug}` })),
      }
    }
    if (col.title === 'Customer Care') {
      return {
        ...col,
        links: [
          { label: contact.email, href: `mailto:${contact.email}`, icon: Mail },
          { label: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`, icon: Phone },
          ...col.links.slice(2),
        ],
      }
    }
    return col
  })

  return (
    <footer className="footer">
      <div className="ft-inner">
        <div className="ft-grid">
          {columns.map((c) => (
            <div key={c.title} className="ft-col">
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => <li key={l.label}><FooterLink link={l} /></li>)}
              </ul>
            </div>
          ))}
          <Newsletter text={footer.newsletterText} instagram={footer.instagram} />
        </div>

        <div className="ft-bottom">
          <p>© Metro Jewellers {new Date().getFullYear()}</p>
        </div>
      </div>
      <FloatingButtons whatsapp={contact.whatsapp} />
    </footer>
  )
}
