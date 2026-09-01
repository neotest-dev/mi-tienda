import { formatPrice } from './formatters'
import type { Product } from '../types/store'

/**
 * Normaliza y valida un número de WhatsApp de Perú.
 * Formatos aceptados: +51 972874719, 51972874719, 972874719.
 * Retorna el número normalizado de 11 dígitos: 51972874719.
 * Lanza un error descriptivo si no cumple con el formato.
 */
export function normalizePeruWhatsAppNumber(input: string): string {
  if (!input || !input.trim()) {
    throw new Error('El número de WhatsApp es obligatorio.')
  }

  const digitsOnly = input.replace(/\D/g, '')

  // Caso 1: 9 dígitos comenzando en 9 (ej. 972874719) -> agregar prefijo 51
  if (/^9\d{8}$/.test(digitsOnly)) {
    return `51${digitsOnly}`
  }

  // Caso 2: 11 dígitos comenzando en 519 (ej. 51972874719)
  if (/^519\d{8}$/.test(digitsOnly)) {
    return digitsOnly
  }

  throw new Error(
    'El número debe ser un celular válido de Perú (+51 seguido de 9 dígitos que inicien con 9, ej: +51 972874719).'
  )
}

/**
 * Formatea un número normalizado (51972874719) para presentación visual (+51 972 874 719).
 */
export function formatWhatsAppDisplay(number: string): string {
  const clean = number.replace(/\D/g, '')
  if (clean.length === 11 && clean.startsWith('51')) {
    const mobile = clean.substring(2)
    return `+51 ${mobile.substring(0, 3)} ${mobile.substring(3, 6)} ${mobile.substring(6)}`
  }
  return number
}

export function buildWhatsAppUrl(
  whatsappNumber: string,
  product: Product,
  currentUrl?: string
): string {
  let cleanNumber = whatsappNumber.replace(/\D/g, '')
  try {
    cleanNumber = normalizePeruWhatsAppNumber(whatsappNumber)
  } catch {
    cleanNumber = whatsappNumber.replace(/\D/g, '')
  }

  const messageLines = [
    'Hola, deseo comprar este producto:',
    '',
    `*${product.name}*`,
    `Precio: ${formatPrice(product.price)}`,
  ]

  if (currentUrl) {
    messageLines.push(`Link: ${currentUrl}`)
  }

  messageLines.push('', '¿Cuáles son los métodos de pago disponibles?')

  const rawMessage = messageLines.join('\n')
  const encodedMessage = encodeURIComponent(rawMessage)

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}
