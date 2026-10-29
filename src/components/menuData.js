const cards = (items) => ({ type: 'cards', items })

// img: set to an image URL / import to replace the placeholder gradient on a card
export const NAV = [
  {
    label: 'Engagement Rings',
    slug: 'engagement-rings',
    menu: cards([
      { title: 'Recently Made Rings', href: '#', img: '' },
      { title: 'Build Your Own Ring', href: '#', img: '' },
      { title: 'Upload Your Dream Ring', href: '#', img: '' },
    ]),
  },
  {
    label: 'Wedding Rings',
    slug: 'wedding-rings',
    menu: cards([
      { title: 'Female Wedding Rings', href: '#', img: '' },
      { title: 'Male Wedding Rings', href: '#', img: '' },
      { title: 'Eternity Rings', href: '#', img: '' },
      { title: 'Upload Your Dream Ring', href: '#', img: '' },
    ]),
    viewAll: 'View All Wedding Rings',
  },
  {
    label: 'Earrings',
    slug: 'earrings',
    menu: cards([
      { title: 'Diamond Studs', href: '#', img: '' },
      { title: 'Hoop Earrings', href: '#', img: '' },
      { title: 'Drop Earrings', href: '#', img: '' },
    ]),
    viewAll: 'View All Earrings',
  },
  {
    label: 'Bracelets',
    slug: 'bracelets',
    menu: cards([
      { title: 'Tennis Bracelets', href: '#', img: '' },
      { title: 'Letter Bracelets', href: '#', img: '' },
      { title: 'Recently Made Bracelets', href: '#', img: '' },
    ]),
    viewAll: 'View All Bracelets',
  },
  {
    label: 'Necklaces',
    slug: 'necklaces',
    menu: cards([
      { title: 'Diamond Pendants', href: '#', img: '' },
      { title: 'Name Necklaces', href: '#', img: '' },
      { title: 'Letter Pendants', href: '#', img: '' },
    ]),
    viewAll: 'View All Necklaces',
  },
  {
    label: 'Jewellery',
    slug: 'jewellery',
    menu: {
      type: 'columns',
      cta: { text: "Still can't find what you're looking for?", button: 'Contact Us' },
      viewAll: 'View All Jewellery',
      columns: [
        {
          title: 'Rings',
          links: [
            'Natural Engagement Rings', 'Lab-Grown Engagement Rings', 'Wedding Rings',
            'Eternity Rings', 'Constellation Rings', 'Gemstone Rings', 'Fashion Rings',
            'Fancy Coloured Diamond Rings', 'View All Rings',
          ],
        },
        {
          title: 'Earrings',
          links: ['Diamond Studs', 'Hoop Earrings', 'Fashion Studs', 'Drop Earrings', 'Letter Studs', 'View All Earrings'],
        },
        {
          title: 'Bracelets',
          links: ['Recently Made Tennis Bracelets', 'Tennis Bracelets', 'Letter Bracelets', 'View All Bracelets'],
        },
        {
          title: 'Necklaces',
          links: [
            'Diamond Pendants', 'Fashion Pendants', 'Constellation Pendants', 'English Letter Pendants',
            'Arabic Letter Pendants', 'English Name Necklaces', 'Arabic Name Necklaces', 'View All Necklaces',
          ],
        },
      ],
    },
  },
  {
    label: 'Sale Items',
    slug: 'sale-items',
    sale: true,
    menu: cards([
      { title: 'Rings on Sale', href: '#', img: '' },
      { title: 'Earrings on Sale', href: '#', img: '' },
      { title: 'Bracelets on Sale', href: '#', img: '' },
      { title: 'Necklaces on Sale', href: '#', img: '' },
    ]),
    viewAll: 'View All Sale Items',
  },
  {
    label: 'Contact Us',
    to: '/contact-us',
    menu: {
      type: 'contact',
      explore: ['About Metro Jewellers', 'Diamond Education', 'Celebrity Clients', 'Frequently Asked Questions', 'Blog', 'Our Partners'],
      contact: ['Contact Us Form', 'Office 3107, Floor 31', 'Mazaya Tower AA1', 'Jumeirah Lake Towers', 'Dubai, UAE', '+971 52 360 6874', 'info@metrojewellers.com'],
      hours: [
        ['Monday', '8.30AM - 5.00PM'], ['Tuesday', '8.30AM - 5.00PM'], ['Wednesday', '8.30AM - 5.00PM'],
        ['Thursday', '8.30AM - 5.00PM'], ['Friday', '8.30AM - 5.00PM'], ['Saturday', 'Closed'], ['Sunday', 'Closed'],
      ],
      cta: { text: 'Are you planning a visit to our showroom in Dubai?', button: 'Book An Appointment' },
    },
  },
]
