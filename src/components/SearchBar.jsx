import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/SearchBar.css'

const POPULAR = [
  { label: 'Earrings', to: '/collections/earrings' },
  { label: 'Bracelets', to: '/collections/bracelets' },
  { label: 'Necklaces', to: '/collections/necklaces' },
]

// the search panel that drops down from the top of the page over a dimmed background: a box, and quick links to the main collections
export default function SearchBar({ onClose }) {
  const [text, setText] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    navigate(`/search?q=${encodeURIComponent(text.trim())}`)
    onClose()
  }

  return (
    <>
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-panel">
        <form className="search-box" role="search" onSubmit={submit}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search products" aria-label="Search products" autoFocus />
          <button type="submit" aria-label="Search">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </form>

        <p className="search-popular">
          Popular Searches:
          {POPULAR.map((item) => (
            <Link key={item.label} to={item.to} onClick={onClose}>{item.label}</Link>
          ))}
        </p>
      </div>
    </>
  )
}
