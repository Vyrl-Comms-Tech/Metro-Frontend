import { useCallback, useMemo, useState } from 'react'
import { DEFAULT_CONTENT } from '../data/siteDefaults'
import { LOADING_CATEGORIES } from '../data/categoryFallbacks'
import { SiteContext } from './siteContext'
import axiosClient from '../utils/axiosClient'
import { useAsync } from '../utils/useAsync'

export default function SiteProvider({ children }) {
  const [version, setVersion] = useState(0)
  const { data, error } = useAsync(
    () => axiosClient.get('/categories/getAll', { params: { limit: 100 } }),
    [version],
  )

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  const value = useMemo(() => {
    const res = data
    const categories = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : []

    const loaded = Boolean(data) || Boolean(error)
    return {
      categories,
      // until the real categories arrive the menu shows the matching fallback, so it does not pop in
      publicCategories: loaded
        ? categories.filter((category) => category.active === true)
        : LOADING_CATEGORIES,
      content: DEFAULT_CONTENT,
      loaded,
      error,
      reload,
    }
  }, [data, error, reload])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
