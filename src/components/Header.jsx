import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNav } from './useNav'
import MobileMenu from './MobileMenu'
import { useWishlist } from '../context/wishlistContext'
import '../styles/Header.css'

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

function CtaBlock({ text, button }) {
  return (
    <div className="mm-cta">
      <p>{text}</p>
      <a href="#" className="btn-dark">{button}</a>
    </div>
  )
}

function MegaMenu({ item }) {
  const { menu } = item

  if (menu.type === 'cards') {
    return (
      <div className="mm-inner">
        <div className="mm-cards-row">
          <div className="mm-cards">
            {menu.items.map((c) => (
              <Link key={c.title} to={`/collections/${item.slug}`} className="mm-card">
                <div className="mm-card-img" style={c.img ? { backgroundImage: `url(${c.img})` } : undefined} />
                <span>{c.title}</span>
              </Link>
            ))}
          </div>
          <CtaBlock text="Still can't find what you're looking for?" button="Contact Us" />
        </div>
        {item.viewAll && <Link to={`/collections/${item.slug}`} className="btn-outline mm-viewall">{item.viewAll}</Link>}
      </div>
    )
  }

  if (menu.type === 'columns') {
    return (
      <div className="mm-inner">
        <div className="mm-cols-row">
          {menu.columns.map((col) => (
            <div key={col.title} className="mm-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <CtaBlock {...menu.cta} />
        </div>
        <Link to={`/collections/${item.slug}`} className="btn-outline mm-viewall">{menu.viewAll}</Link>
      </div>
    )
  }

  return (
    <div className="mm-inner">
      <div className="mm-cols-row mm-contact">
        <div className="mm-col">
          <h4>Explore</h4>
          <ul>{menu.explore.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>
        <div className="mm-col">
          <h4>Contact Us</h4>
          <ul>{menu.contact.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
        </div>
        <div className="mm-col">
          <h4>By Appointment Only</h4>
          <ul>
            {menu.hours.map(([d, t]) => (
              <li key={d} className="mm-hours"><span>{d}</span><span>{t}</span></li>
            ))}
          </ul>
        </div>
        <CtaBlock {...menu.cta} />
      </div>
    </div>
  )
}

export default function Header() {
  const [active, setActive] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useWishlist()
  const nav = useNav()
  const timer = useRef(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const open = (i) => {
    clearTimeout(timer.current)
    setActive(i)
  }
  // small delay so the pointer can cross the gap between tab and panel
  const close = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setActive(null), 120)
  }

  const current = active !== null ? nav[active] : null

  return (
    <header className="site-header" onMouseLeave={close} onMouseEnter={() => clearTimeout(timer.current)}>
      <div className="hd-top">
        <div className="hd-left">
          <button className="icon-btn hd-menu-btn" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
            <Icon><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
          </button>
          <button className="icon-btn" aria-label="Search">
            <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
          </button>
        </div>

        <Link to="/" className="logo" aria-label="Metro Jewellers">
          <img src="/black-logo.png" alt="Metro Jewellers" />
        </Link>

        <div className="hd-right">
          <button className="icon-btn" aria-label="Messages">
            <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>
          </button>
          <button className="icon-btn" aria-label="Account">
            <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Icon>
          </button>
          <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${count} saved`}>
            <Icon><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></Icon>
            {count > 0 && <i className="badge">{count}</i>}
          </Link>
        </div>
      </div>

      <nav className="hd-nav" aria-label="Main">
        <ul>
          {nav.map((item, i) => (
            <li key={item.label} onMouseEnter={() => (item.menu ? open(i) : setActive(null))}>
              <Link
                to={item.to ?? (item.slug ? `/collections/${item.slug}` : '#')}
                className={`${item.sale ? 'sale' : ''} ${active === i ? 'on' : ''}`}
                onFocus={() => (item.menu ? open(i) : setActive(null))}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <MobileMenu open={menuOpen} onClose={closeMenu} />

      {current?.menu && (
        <div className="mega" onMouseEnter={() => clearTimeout(timer.current)}>
          <MegaMenu item={current} />
        </div>
      )}
    </header>
  )
}
