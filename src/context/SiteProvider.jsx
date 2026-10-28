import { useCallback, useMemo, useState } from 'react'
import { categoriesApi, contentApi } from '../api/resources'
import { useAsync } from '../api/useAsync'
import { mergeContent } from '../data/siteDefaults'
import { SiteContext } from './siteContext'

// loads the collections and site content once, for the whole site
export default function SiteProvider({ children }) {
  const [version, setVersion] = useState(0)
  const { data, error } = useAsync(
    () => Promise.all([categoriesApi.list({ limit: 100 }), contentApi.get()]),
    [version],
  )

  // call after the admin saves something so the site picks it up
  const reload = useCallback(() => setVersion((v) => v + 1), [])

  const value = useMemo(
    () => ({
      categories: data?.[0].items ?? [],
      content: mergeContent(data?.[1]),
      loaded: Boolean(data) || Boolean(error),
      error,
      reload,
    }),
    [data, error, reload],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
