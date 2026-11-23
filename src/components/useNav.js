import { useMemo } from 'react'
import { NAV } from './menuData'
import { useSite } from '../context/siteContext'

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const WEEKEND = ['Saturday', 'Sunday']

// these collections have their own pages; every other one opens /collections/:slug
const PAGE_ROUTES = { gemstone: '/gemstone', gemstones: '/gemstone', 'loose-diamond': '/loose-diamond', diamonds: '/diamonds' }

export function useNav() {
  const { content, publicCategories } = useSite()
  const { contact, hours } = content

  return useMemo(() => {
    const fixed = NAV.filter((item) => !PAGE_ROUTES[item.to?.slice(1)] && item.slug !== 'jewellery')
    const jewellery = NAV.find((item) => item.slug === 'jewellery')

    console.log("Public Categories", publicCategories)
    const collections = publicCategories.map((c) => ({
      label: c.title,
      slug: c.slug,
      ...(PAGE_ROUTES[c.slug] ? { to: PAGE_ROUTES[c.slug] } : {}),
      ...(c.slug === 'jewellery' ? { menu: jewellery.menu } : {}),
    }))

    console.log("Collection", collections)

    return [...collections, ...fixed].map((item) =>
      item.menu?.type === 'contact'
        ? {
          ...item,
          menu: {
            ...item.menu,
            contact: [
              'Contact Us Form',
              ...contact.address.split('\n').filter(Boolean),
              contact.phone,
              contact.email,
            ],
            hours: [
              ...WEEKDAYS.map((d) => [d, hours.weekdays]),
              ...WEEKEND.map((d) => [d, hours.weekend]),
            ],
          },
        }
        : item,
    )
  }, [contact, hours, publicCategories])
}
