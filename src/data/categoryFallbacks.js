// Temporary catalogue categories shown until they are available from the API.
// A subcategory is { title, options }; options is its own third-level list.
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
      { title: 'Bracelets', options: ['Tennis Bracelets', 'Letter Bracelets'] },
    ],
    description: 'Explore the full collection',
  },
]

// `hidden` = slugs of inactive categories, which must not come back through the fallbacks
export function withCategoryFallbacks(categories = [], hidden = []) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]))

  for (const fallback of FALLBACK_CATEGORIES) {
    if (hidden.includes(fallback.slug) || bySlug.has(fallback.slug)) continue
    bySlug.set(fallback.slug, { ...fallback, id: `fallback-${fallback.slug}`, showOnHome: true })
  }

  return [...bySlug.values()]
}
