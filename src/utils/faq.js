// API FAQ -> the { q, a } shape FaqList renders
export const toFaqItem = (faq) => ({ q: faq.question, a: faq.answer })

export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// [{ id, title, items }] in the order the categories first appear
export function groupByCategory(faqs) {
  const groups = new Map()
  for (const faq of faqs) {
    if (!groups.has(faq.category)) {
      groups.set(faq.category, { id: slugify(faq.category), title: faq.category, items: [] })
    }
    groups.get(faq.category).items.push(toFaqItem(faq))
  }
  return [...groups.values()]
}
