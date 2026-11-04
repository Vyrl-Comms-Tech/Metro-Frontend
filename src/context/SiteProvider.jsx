import { useCallback, useMemo, useState } from 'react'
import { DEFAULT_CONTENT } from '../data/siteDefaults'
import { withCategoryFallbacks } from '../data/categoryFallbacks'
import { SiteContext } from './siteContext'
import axiosClient from '../utils/axiosClient'
import { useAsync } from '../utils/useAsync'

// loads the collections once, for the whole site; the site content is hard-coded in data/siteDefaults.js
export default function SiteProvider({ children }) {
  const [version, setVersion] = useState(0)
  const { data, error } = useAsync(
    () => axiosClient.get('/categories/getAll', { params: { limit: 100 } }),
    [version],
  )

  // call after the admin saves something so the site picks it up
  const reload = useCallback(() => setVersion((v) => v + 1), [])

  const value = useMemo(() => {
    // tolerate either { items: [...] } or a bare array from the API
    const res = data
    const categories = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : []
    return {
      categories,
      // the admin sees every category; the site only shows active ones
      publicCategories: withCategoryFallbacks(
        categories.filter((c) => c.active !== false),
        categories.filter((c) => c.active === false).map((c) => c.slug),
      ),
      content: DEFAULT_CONTENT,
      loaded: Boolean(data) || Boolean(error),
      error,
      reload,
    }
  }, [data, error, reload])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
