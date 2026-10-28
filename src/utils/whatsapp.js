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

export const productEnquiry = ({ name, type, metal, url }) =>
  [
    'Hello Metro Jewellers, I would like to enquire about:',
    name,
    `Diamond type: ${type}`,
    `Metal: ${metal}`,
    url,
  ].join('\n')
