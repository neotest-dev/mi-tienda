import { ShoppingBag } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { buildWhatsAppUrl } from '../../utils/whatsapp'
import type { Product } from '../../types/store'

interface WhatsAppButtonProps {
  product: Product
  fullWidth?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WhatsAppButton({
  product,
  fullWidth = false,
  label = 'Comprar ahora',
  size = 'md',
}: WhatsAppButtonProps) {
  const { settings } = useStore()

  const whatsappNumber = settings?.whatsapp_number || '51999999999'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, product, currentUrl)

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-xs gap-1.5 font-semibold',
    md: 'px-5 py-3 text-sm gap-2 font-bold',
    lg: 'px-8 py-4 text-base gap-2.5 font-bold',
  }[size]

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${sizeClasses} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      <ShoppingBag className={size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} />
      <span>{label}</span>
    </a>
  )
}
