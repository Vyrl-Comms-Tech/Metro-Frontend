import { useCallback, useMemo, useState } from 'react'
import { mergeContent } from '../data/siteDefaults'
import { withCategoryFallbacks } from '../data/categoryFallbacks'
import { SiteContext } from './siteContext'
import axiosClient from '../utils/axiosClient'
import { useAsync } from '../utils/useAsync'

// loads the collections and site content once, for the whole site
export default function SiteProvider({ children }) {
  const [version, setVersion] = useState(0)
  const { data, error } = useAsync(
    () => Promise.all([axiosClient.get('/categories/getAll', { params: { limit: 100 } }), axiosClient.get('/content')]),
    [version],
  )

  // call after the admin saves something so the site picks it up
  const reload = useCallback(() => setVersion((v) => v + 1), [])

  const value = useMemo(() => {
    // tolerate either { items: [...] } or a bare array from the API
    const res = data?.[0]
    const categories = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : []
    return {
      categories,
      // the admin sees every category; the site only shows active ones
      publicCategories: withCategoryFallbacks(
        categories.filter((c) => c.active !== false),
        categories.filter((c) => c.active === false).map((c) => c.slug),
      ),
      content: mergeContent(data?.[1]),
      loaded: Boolean(data) || Boolean(error),
      error,
      reload,
    }
  }, [data, error, reload])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
