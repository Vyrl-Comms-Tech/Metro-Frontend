import { useMemo } from 'react'
import { NAV } from './menuData'
import { useSite } from '../context/siteContext'

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const WEEKEND = ['Saturday', 'Sunday']

// the menu, with the Contact Us panel filled from the editable site content
export function useNav() {
  const { contact, hours } = useSite().content

  return useMemo(
    () =>
      NAV.map((item) =>
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
      ),
    [contact, hours],
  )
}
