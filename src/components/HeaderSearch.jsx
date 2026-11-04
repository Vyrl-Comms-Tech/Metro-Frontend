import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchSuggestions from './SearchSuggestions'
import '../styles/SearchBar.css'

// the search field that sits in the header on wide screens, with the suggestions dropping down under it while the visitor types
export default function HeaderSearch({ onFocus }) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const navigate = useNavigate()
  const typed = text.trim()

  // a click outside the field or Escape closes the suggestions
  useEffect(() => {
    const close = (e) => (e.type === 'keydown' ? e.key === 'Escape' : !wrap.current?.contains(e.target)) && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [])

  const search = (q) => {
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const submit = (e) => {
    e.preventDefault()
    if (typed) search(typed)
  }

  return (
    <div className="hd-search" ref={wrap}>
      <form className="hd-search-box" role="search" onSubmit={submit}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            onFocus?.()
            if (typed) setOpen(true)
          }}
          placeholder="Search products"
          aria-label="Search products"
        />
        {text && (
          <button type="button" className="hd-search-clear" aria-label="Clear search" onClick={() => { setText(''); setOpen(false) }}>
            <X size={16} />
          </button>
        )}
      </form>
      {open && typed && (
        <div className="hd-search-drop">
          <SearchSuggestions text={text} onSearch={search} onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
