import { createContext, useContext } from 'react'

// value: { categories, content, loaded, error, reload }
export const SiteContext = createContext(null)

export const useSite = () => useContext(SiteContext)
