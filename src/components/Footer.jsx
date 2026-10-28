import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
      { label: 'info@fergusjames.com', href: 'mailto:info@fergusjames.com' },
      { label: '+971 52 360 6874', href: 'tel:+971523606874' },
      { label: 'Terms & Conditions', to: '#' },
      { label: 'Privacy Policy', to: '#' },
    ],
  },
  {
    title: 'FJ Guarantee',
    links: [
      { label: 'Worldwide Shipping', to: '#' },
      { label: '30 days returns', to: '#' },
      { label: 'Lifetime Warranty', to: '#' },
      { label: 'Contact Us', to: '/contact-us' },
      { label: 'Refunds & Returns Policy', to: '#' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'About Fergus James', to: '#' },
      { label: 'Celebrity Clients', to: '#' },
      { label: 'FAQs', to: '/faqs' },
      { label: 'Blog', to: '#' },
      { label: 'Our Partners', to: '#' },
    ],
  },
]

const svg = { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

const SOCIALS = [
  { name: 'Pinterest', icon: <svg {...svg}><circle cx="12" cy="12" r="9" /><path d="M11 8.5c2.5-1 4.5.5 4 3-.4 2-2 3-3.5 2.5M11.5 11 10 18" /></svg> },
  { name: 'Facebook', icon: <svg {...svg}><path d="M14 8h2V4h-2.5C11 4 10 5.5 10 7.5V10H8v3.5h2V20h3.5v-6.5H16l.5-3.5h-3V8.2c0-.1 0-.2.5-.2Z" /></svg> },
  { name: 'Instagram', icon: <svg {...svg}><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" /></svg> },
  { name: 'X', icon: <svg {...svg}><path d="m5 5 14 14M19 5 5 19" /></svg> },
]

function FooterLink({ link }) {
  if (link.href) return <a href={link.href}>{link.label}</a>
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
          <svg {...svg}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
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
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20Z" />
          <path d="M9.2 8.8c.3 2.6 2.4 4.8 5 5.4l1-1.2-1.6-.9-.7.6c-.9-.3-1.7-1.1-2-2l.6-.7-.9-1.6-1.4.4Z" />
        </svg>
      </a>
      <button className={`fab fab-top ${showTop ? 'show' : ''}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg {...svg} width="20" height="20" strokeWidth="2"><path d="m6 14 6-6 6 6" /></svg>
      </button>
    </>
  )
}

export default function Footer() {
  const { content, categories } = useSite()
  const { contact, footer } = content

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
          { label: contact.email, href: `mailto:${contact.email}` },
          { label: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` },
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
          <p>© Fergus James {new Date().getFullYear()}</p>
        </div>
      </div>
      <FloatingButtons whatsapp={contact.whatsapp} />
    </footer>
  )
}
