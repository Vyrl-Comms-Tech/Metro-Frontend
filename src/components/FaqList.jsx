import { useState } from 'react'

// accordion: one row open at a time; styles live in styles/Faq.css
export default function FaqList({ items, idPrefix = 'faq', defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="faq-list">
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <h3>
              <button
                id={`${idPrefix}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path className="plus-v" d="M12 5v14" />
                </svg>
              </button>
            </h3>
            <div id={`${idPrefix}-a-${i}`} role="region" aria-labelledby={`${idPrefix}-q-${i}`} className="faq-a">
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
