import { useCallback, useEffect, useMemo, useState } from 'react'
import axiosClient, { refreshSession, setAccessToken, setSessionEndHandler } from '../utils/axiosClient'
import { AuthContext } from './authContext'

export default function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSessionEndHandler(() => setIsAuthed(false))

    refreshSession()
      .then(() => setIsAuthed(true))
      .catch(() => setIsAuthed(false))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { accessToken } = await axiosClient.post('/auth/login', { email, password })
    setAccessToken(accessToken)
    setIsAuthed(true)
  }, [])

  const logout = useCallback(async () => {
    try {
      await axiosClient.post('/auth/logout', {})
    } finally {
      setAccessToken(null)
      setIsAuthed(false)
    }
  }, [])

  const value = useMemo(() => ({ isAuthed, loading, login, logout }), [isAuthed, loading, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
