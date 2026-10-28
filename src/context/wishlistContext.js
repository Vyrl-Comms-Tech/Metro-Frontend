import { createContext, useContext } from 'react'

// value: { items, count, has(id), toggle(item), remove(id) }
// item:  { id, name, metal, to, image? }
export const WishlistContext = createContext(null)

export const useWishlist = () => useContext(WishlistContext)
