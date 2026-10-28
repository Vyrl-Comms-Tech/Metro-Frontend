import { useEffect, useState } from 'react'

// Runs `load()` whenever `deps` change. Returns { data, error, loading }.
// While a reload is running, `data` keeps the previous result so lists don't flash empty.
export function useAsync(load, deps) {
  const key = JSON.stringify(deps)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    let cancelled = false
    load()
      .then((data) => !cancelled && setResult({ key, data, error: null }))
      .catch((error) => !cancelled && setResult({ key, data: null, error }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const loading = result.key !== key
  return { data: result.data, error: loading ? null : result.error, loading }
}
