import { api } from './client'

// MongoDB documents use `_id`; the UI works with `id`
const normalize = (doc) => ({ ...doc, id: doc._id })

const query = (params) => {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  return qs.size ? `?${qs}` : ''
}

// list / get / create / update / remove for one API collection, e.g. resource('faqs')
export const resource = (name) => ({
  list: async (params = {}) => {
    const res = await api.get(`/${name}${query(params)}`)
    return { ...res, items: res.items.map(normalize) }
  },
  get: async (id) => normalize(await api.get(`/${name}/${id}`)),
  create: async (data) => normalize(await api.post(`/${name}`, data)),
  update: async (id, data) => normalize(await api.put(`/${name}/${id}`, data)),
  remove: (id) => api.delete(`/${name}/${id}`),
})

export const productsApi = resource('products')
export const categoriesApi = resource('categories')
export const faqsApi = resource('faqs')
export const reelsApi = resource('reels')

// site text, contact details, hours and footer live in one document
export const contentApi = {
  get: () => api.get('/content'),
  save: (data) => api.put('/content', data),
}
