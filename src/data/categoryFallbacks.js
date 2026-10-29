// Temporary catalogue categories shown until they are available from the API.
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
    subCategories: ['Natural Diamond', 'Lab Grown Diamond'],
    description: 'Explore natural and lab grown loose diamonds',
  },
  {
    title: 'Diamonds',
    slug: 'diamonds',
    subCategories: ['Natural Diamond', 'Lab Grown Diamond'],
    description: 'Discover natural and lab grown diamonds',
  },
  {
    title: 'Jewellery',
    slug: 'jewellery',
    subCategories: ['Rings', 'Earrings', 'Necklaces', 'Bracelets', 'Exclusive Pieces'],
    description: 'Explore the full collection',
  },
]

// `hidden` = slugs of inactive categories, which must not come back through the fallbacks
export function withCategoryFallbacks(categories = [], hidden = []) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]))

  for (const fallback of FALLBACK_CATEGORIES) {
    if (hidden.includes(fallback.slug)) continue
    const existing = bySlug.get(fallback.slug)
    bySlug.set(fallback.slug, existing
      ? {
          ...existing,
          subCategories: [
            ...new Set([...(existing.subCategories ?? []), ...fallback.subCategories]),
          ],
        }
      : { ...fallback, id: `fallback-${fallback.slug}`, showOnHome: true })
  }

  return [...bySlug.values()]
}
