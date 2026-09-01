import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { WhatsAppButton } from '../ui/WhatsAppButton'
import { formatPrice } from '../../utils/formatters'
import type { ProductWithCategory } from '../../types/store'

interface ProductCardProps {
  product: ProductWithCategory
}

export function ProductCard({ product }: ProductCardProps) {
  const categoryName = product.category?.name || 'General'
  const productSlug = product.slug || product.id

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Clickable Card Link */}
      <Link to={`/producto/${productSlug}`} className="flex-1 flex flex-col">
        {/* Image container */}
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
              <ImageOff className="h-8 w-8 sm:h-10 sm:w-10 mb-1 stroke-1" />
              <span className="text-[10px] sm:text-xs">Sin imagen</span>
            </div>
          )}
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs truncate max-w-[85%]">
            {categoryName}
          </span>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-base line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm sm:text-xl font-extrabold text-indigo-600 mb-2 sm:mb-4">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>

      {/* Direct Buy Action - Full width, wide button on PC */}
      <div className="p-3 sm:p-5 pt-0">
        <WhatsAppButton
          product={product}
          fullWidth
          label="Comprar ahora"
          size="md"
        />
      </div>
    </div>
  )
}
