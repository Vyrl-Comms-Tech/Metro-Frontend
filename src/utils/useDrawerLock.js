import { useEffect } from 'react'

// Escape closes the panel, and the page behind does not scroll while it is open
export function useDrawerLock(open, onClose) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const html = document.documentElement
    const before = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      html.style.overflow = before
    }
  }, [open, onClose])
}

// true on the screens where the filters open as a panel (the groups in it start closed)
export const onDrawerScreen = () => window.matchMedia('(max-width: 1000px)').matches
