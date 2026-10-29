import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL

let accessToken = null
let onSessionEnd = () => { }

export const setAccessToken = (token) => {
  accessToken = token
}

export const setSessionEndHandler = (fn) => {
  onSessionEnd = fn
}

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  if (config.params) {
    config.params = Object.fromEntries(Object.entries(config.params).filter(([, v]) => v !== '' && v != null))
  }
  return config
})

let refreshing = null
export function refreshSession() {
  refreshing ??= axios
    .get(`${API_URL}/auth/refresh-token`, { withCredentials: true })
    .then(({ data }) => {
      // a 200 without a token (e.g. the dev server's index.html) is not a session
      if (!data?.accessToken) throw new Error('No session')
      accessToken = data.accessToken
      return accessToken
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

axiosClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const { config, response } = error
    if (response?.status === 401 && config && !config._retried && !config.url.startsWith('/auth/')) {
      config._retried = true
      try {
        await refreshSession()
        return axiosClient(config)
      } catch {
        accessToken = null
        onSessionEnd()
      }
    }
    if (!response) throw new Error('Cannot reach the server. Is the backend running?')
    throw new Error(response.data?.message ?? `Request failed (${response.status})`)
  },
)

export default axiosClient
