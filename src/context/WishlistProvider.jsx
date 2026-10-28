import { useCallback, useEffect, useMemo, useState } from 'react'
import { WishlistContext } from './wishlistContext'

const STORAGE_KEY = 'metro-wishlist'

// storage can be blocked or hold junk, so fall back to an empty list
const read = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function WishlistProvider({ children }) {
  const [items, setItems] = useState(read)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable: the wishlist just won't survive a reload */
    }
  }, [items])

  const toggle = useCallback(
    (item) =>
      setItems((list) =>
        list.some((i) => i.id === item.id)
          ? list.filter((i) => i.id !== item.id)
          : [...list, item],
      ),
    [],
  )

  const remove = useCallback(
    (id) => setItems((list) => list.filter((i) => i.id !== id)),
    [],
  )

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      has: (id) => items.some((i) => i.id === id),
      toggle,
      remove,
    }),
    [items, toggle, remove],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
