import { Link } from 'react-router-dom'
import { Eye, ImageOff } from 'lucide-react'
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
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
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
            <ImageOff className="h-10 w-10 mb-1 stroke-1" />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {categoryName}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xl font-extrabold text-slate-900 mb-4">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <Link
            to={`/producto/${productSlug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Ver producto</span>
          </Link>
          <WhatsAppButton product={product} fullWidth label="Comprar por WhatsApp" />
        </div>
      </div>
    </div>
  )
}
