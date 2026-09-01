import { MessageCircle } from 'lucide-react'
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
  label = 'Comprar por WhatsApp',
  size = 'md',
}: WhatsAppButtonProps) {
  const { settings } = useStore()

  const whatsappNumber = settings?.whatsapp_number || '51999999999'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, product, currentUrl)

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2 font-medium',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  }[size]

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer ${sizeClasses} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      <MessageCircle className={size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} />
      <span>{label}</span>
    </a>
  )
}
