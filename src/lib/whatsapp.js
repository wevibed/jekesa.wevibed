import { BUSINESS } from '../data/catalogue.js'
import { money } from './format.js'

export function orderRef(date = new Date()) {
  const d = date.toISOString().slice(2, 10).replace(/-/g, '')
  const r = String(Math.floor(1000 + Math.random() * 9000))
  return `JK-${d}-${r}`
}

// Builds the WhatsApp message Jekesa receives. WhatsApp renders *bold*.
export function buildOrderMessage({ items, name, fulfilment, area, note, ref }) {
  const lines = items.map(({ product, qty }, i) => {
    const sub = money(product.price * qty)
    return `${i + 1}. ${product.name} (${product.code})\n    ${qty} x ${money(product.price)} = ${sub}`
  })
  const total = items.reduce((s, { product, qty }) => s + product.price * qty, 0)
  const parts = [
    `*New order from the Jekesa website*`,
    `Ref: ${ref}`,
    '',
    `*Items*`,
    ...lines,
    '',
    `*Total: ${money(total)}* (excluding delivery)`,
  ]
  // Name and delivery details are only included when the customer filled them in.
  if (name) parts.push('', `*Name:* ${name}`)
  if (fulfilment === 'delivery') parts.push(`*Delivery to:* ${area || '-'}`)
  if (fulfilment === 'collect') parts.push('*Collection:* I will collect from the showroom')
  if (note) parts.push(`*Note:* ${note}`)
  parts.push('', 'Please confirm availability, delivery cost and how to pay. Thank you.')
  return parts.join('\n')
}

export const whatsappUrl = (text) =>
  `https://wa.me/${BUSINESS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
