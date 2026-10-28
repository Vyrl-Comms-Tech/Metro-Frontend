// Shown until the real content loads from the API, or if the API cannot be reached.
export const DEFAULT_CONTENT = {
  homeBanner: { heading: 'Design your perfect engagement ring', buttonText: 'Get Started', image: '' },
  contact: {
    whatsapp: '971523606874',
    email: 'info@fergusjames.com',
    phone: '+971 52 360 6874',
    address: 'Office 3107, Floor 31\nMazaya Tower AA1\nJumeirah Lake Towers\nDubai, UAE',
  },
  hours: { weekdays: '8.30AM - 5.00PM', weekend: 'Closed' },
  footer: {
    newsletterText: 'Be the first to know about new designs, events and special offers.',
    instagram: 'https://instagram.com',
  },
}

// saved content may be missing sections or fields, so fill the gaps from the defaults
export const mergeContent = (saved = {}) =>
  Object.fromEntries(
    Object.entries(DEFAULT_CONTENT).map(([section, fields]) => [section, { ...fields, ...saved[section] }]),
  )
