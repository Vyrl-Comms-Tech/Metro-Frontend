// wa.me link that opens a chat with the message already typed in
export const whatsappLink = (number, message) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`

export const contactEnquiry = ({ name, email, phone, message }) =>
  [
    'Hello Metro Jewellers, I would like to get in touch.',
    `Name: ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone}`] : []),
    '',
    message,
  ].join('\n')

// "AED 71,036" like the price on the product page; empty when the product has no price
export const formatPrice = (price) =>
  price == null || price === '' ? '' : `AED ${Number(price).toLocaleString('en-US', { maximumFractionDigits: 2 })}`

export const productEnquiry = ({ name, type, metal, price, ringSize, engraving, url }) =>
  [
    'Hello Metro Jewellers, I would like to enquire about:',
    name,
    `Diamond type: ${type}`,
    `Metal: ${metal}`,
    ...(formatPrice(price) ? [`Price: ${formatPrice(price)}`] : []),
    ...(ringSize ? [`Ring size: ${ringSize}`] : []),
    ...(engraving ? [`Engraving: ${engraving}`] : []),
    url,
  ].join('\n')
