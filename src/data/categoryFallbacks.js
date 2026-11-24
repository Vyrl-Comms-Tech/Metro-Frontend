const FALLBACK_CATEGORIES = [
  {
    title: 'Gemstones',
    slug: 'gemstones',
    subCategories: [],
    description: 'Discover our gemstone collection',
  },
  {
    title: 'Loose Diamond',
    slug: 'loose-diamond',
    subCategories: [{ title: 'Natural Diamond', options: [] }, { title: 'Lab Grown Diamond', options: [] }],
    description: 'Explore natural and lab grown loose diamonds',
  },
  {
    title: 'Diamonds',
    slug: 'diamonds',
    subCategories: [{ title: 'Natural Diamond', options: [] }, { title: 'Lab Grown Diamond', options: [] }],
    description: 'Discover natural and lab grown diamonds',
  },
  {
    title: 'Jewellery',
    slug: 'jewellery',
    subCategories: [
      { title: 'Earrings', options: ['Diamond Studs', 'Diamond Hoops', 'Fashion Drops', 'Fashion Studs', 'Letter Studs'] },
      { title: 'Necklaces', options: ['Diamond Pendants', 'Fashion Pendants', 'English Letter Pendants', 'Arabic Letter Pendants'] },
      { title: 'Rings', options: ['Plain', 'Diamond', 'Exclusive Engagement Rings', 'Eternity Rings', 'Gemstone Rings', 'Fashion Rings', 'Constellation Rings', 'Fancy Coloured Diamond Rings'] },
    ],
    description: 'Explore the full collection',
  },
]

// shown while the categories are loading, so the header menu is not empty. It has the same entries, titles and order
// as the live data, so nothing changes on screen when the real categories arrive
const bySlug = (slug) => FALLBACK_CATEGORIES.find((category) => category.slug === slug)
export const LOADING_CATEGORIES = [
  bySlug('jewellery'),
  { ...bySlug('gemstones'), title: 'Gemstone', slug: 'gemstone' },
].map((category) => ({ ...category, id: `fallback-${category.slug}`, active: true, showOnHome: true }))

// `hidden` = slugs of inactive categories, which must not come back through the fallbacks
export function withCategoryFallbacks(categories = [], hidden = []) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]))

  for (const fallback of FALLBACK_CATEGORIES) {
    if (hidden.includes(fallback.slug) || bySlug.has(fallback.slug)) continue
    bySlug.set(fallback.slug, { ...fallback, id: `fallback-${fallback.slug}`, showOnHome: true })
  }

  return [...bySlug.values()]
}
