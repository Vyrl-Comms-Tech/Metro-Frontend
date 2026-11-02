import { useEffect, useState } from 'react'

// Like useState, but the value is kept in sessionStorage under `key`, so it survives leaving the page and coming back.
// `initial` (a value or a function) is used when nothing is stored yet.
export function useSessionState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = sessionStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored)
    } catch { /* storage blocked or unreadable: start fresh */ }
    return typeof initial === 'function' ? initial() : initial
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch { /* storage full or blocked */ }
  }, [key, value])

  return [value, setValue]
}
