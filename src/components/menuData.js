const slugOf = (text) => text.toLowerCase().replace(/\s+/g, '-')

// a Jewellery column opens its collection page, optionally filtered to one category: /collections/earrings/diamond-studs
export const columnLink = (title, option) => `/collections/${slugOf(title)}${option ? `/${slugOf(option)}` : ''}`

// the category name behind a url like /collections/earrings/diamond-studs
export const categoryFromSlug = (title, optionSlug) =>
  NAV.flatMap((item) => item.menu?.columns ?? [])
    .find((col) => slugOf(col.title) === title)
    ?.options.find((o) => slugOf(o) === optionSlug)

export const NAV = [
  { label: 'Gemstone', to: '/gemstone' },
  { label: 'Loose Diamond', to: '/loose-diamond' },
  { label: 'Diamonds', to: '/diamonds' },
  {
    label: 'Jewellery',
    slug: 'jewellery',
    menu: {
      type: 'columns',
      cta: { text: "Still can't find what you're looking for?", button: 'Contact Us' },
      viewAll: 'View All Jewellery',
      // options match the category names stored on the products in the backend
      columns: [
        {
          title: 'Rings',
          options: ['Exclusive Engagement Rings', 'Wedding Rings', 'Eternity Rings', 'Gemstone Rings', 'Fashion Rings', 'Constellation Rings', 'Fancy Coloured Diamond Rings'],
        },
        { title: 'Earrings', options: ['Diamond Studs', 'Diamond Hoops', 'Fashion Drops', 'Fashion Studs', 'Letter Studs'] },
        { title: 'Necklaces', options: ['Diamond Pendants', 'Fashion Pendants', 'English Letter Pendants', 'Arabic Letter Pendants'] },
      ],
    },
  },
  { label: 'Custom Jewellery', to: '/custom-jewellery' },
  {
    label: 'Contact Us',
    to: '/contact-us',
    menu: {
      type: 'contact',
      explore: ['About Metro Jewellers', 'Diamond Education', 'Celebrity Clients', 'Frequently Asked Questions', 'Blog', 'Our Partners'],
      contact: ['Contact Us Form', 'Ground Floor, Building 1', 'Sikka 49 Street, Old Gold Souk', 'Al Ras, Deira, Dubai, UAE', '(Opposite Mubarak Bin Abdullah Sweets)', '+971 58 568 0840', 'info@metrojewellers.com'],
      hours: [
        ['Monday', '8.30AM - 5.00PM'], ['Tuesday', '8.30AM - 5.00PM'], ['Wednesday', '8.30AM - 5.00PM'],
        ['Thursday', '8.30AM - 5.00PM'], ['Friday', '8.30AM - 5.00PM'], ['Saturday', 'Closed'], ['Sunday', 'Closed'],
      ],
      cta: { text: 'Are you planning a visit to our showroom in Dubai?', button: 'Book An Appointment' },
    },
  },
]
