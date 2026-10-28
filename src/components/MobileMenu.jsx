import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNav } from './useNav'
import '../styles/MobileMenu.css'

// turn each desktop mega-menu into plain groups of links for the drawer
function groupsOf(item) {
  const { menu } = item
  const to = `/collections/${item.slug}`

  if (menu.type === 'cards') {
    return [{ links: menu.items.map((c) => ({ label: c.title, to })) }]
  }
  if (menu.type === 'columns') {
    return menu.columns.map((col) => ({
      title: col.title,
      links: col.links.map((label) => ({ label, href: '#' })),
    }))
  }
  return [
    { title: 'Explore', links: menu.explore.map((label) => ({ label, href: '#' })) },
    { title: 'Contact Us', links: menu.contact.map((label) => ({ label, href: '#' })) },
    { title: 'By Appointment Only', hours: menu.hours },
  ]
}

const Chevron = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export default function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null)
  const nav = useNav()

  // Esc closes, and the page behind stops scrolling while the drawer is open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <div className={`mobile-menu ${open ? 'open' : ''}`}>
      <div className="mobile-backdrop" onClick={onClose} />

      <aside
        className="mobile-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(e) => e.target.closest('a') && onClose()}
      >
        <div className="mobile-head">
          <Link to="/" className="mobile-logo">FERGUS JAMES</Link>
          <button className="mobile-close" onClick={onClose} aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <ul className="mobile-list">
          {nav.map((item, i) => {
            const isOpen = expanded === i
            const to = item.to ?? (item.slug ? `/collections/${item.slug}` : '#')
            const viewAll = item.viewAll ?? item.menu?.viewAll

            return (
              <li key={item.label} className={`mobile-item ${isOpen ? 'open' : ''}`}>
                <div className="mobile-row">
                  <Link to={to} className={item.sale ? 'sale' : ''}>{item.label}</Link>
                  {item.menu && (
                    <button
                      aria-expanded={isOpen}
                      aria-controls={`mobile-sub-${i}`}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                      onClick={() => setExpanded(isOpen ? null : i)}
                    >
                      <Chevron />
                    </button>
                  )}
                </div>

                {item.menu && (
                  <div id={`mobile-sub-${i}`} className="mobile-sub">
                    <div>
                      {groupsOf(item).map((g, gi) => (
                        <div key={g.title ?? gi} className="mobile-group">
                          {g.title && <h4>{g.title}</h4>}
                          <ul>
                            {g.links?.map((l) => (
                              <li key={l.label}>
                                {l.to ? <Link to={l.to}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}
                              </li>
                            ))}
                            {g.hours?.map(([day, time]) => (
                              <li key={day} className="mobile-hours"><span>{day}</span><span>{time}</span></li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {viewAll && item.slug && (
                        <Link to={`/collections/${item.slug}`} className="mobile-viewall">{viewAll}</Link>
                      )}
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </aside>
    </div>
  )
}
