import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlugOrId } from '../services/products'
import { WhatsAppButton } from '../components/ui/WhatsAppButton'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { formatPrice } from '../utils/formatters'
import type { ProductWithCategory } from '../types/store'
import { ArrowLeft, CheckCircle2, ImageOff, Tag } from 'lucide-react'

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return
      try {
        setLoading(true)
        setError(null)
        const data = await getProductBySlugOrId(slug)
        if (!data) {
          setError('El producto no fue encontrado o ha sido desactivado.')
        } else {
          setProduct(data)
        }
      } catch (err) {
        console.error('Error loading product detail:', err)
        setError('Error al obtener la información del producto.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Cargando producto..." />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Producto no encontrado</h2>
          <p className="text-slate-500 mb-6">{error || 'No pudimos encontrar este producto.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const categoryName = product.category?.name || 'General'

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a productos</span>
        </Link>

        {/* Detail Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
          {/* Product Image */}
          <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <ImageOff className="h-16 w-16 mb-2 stroke-1" />
                <span className="text-sm">Sin imagen disponible</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Status Badges */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  <Tag className="h-3 w-3" />
                  {categoryName}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  <CheckCircle2 className="h-3 w-3" />
                  Disponible
                </span>
              </div>

              {/* Title & Price */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {product.name}
              </h1>
              <div className="text-3xl sm:text-4xl font-black text-indigo-600 mb-6">
                {formatPrice(product.price)}
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 pt-6 mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Descripción
                </h3>
                <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
                  {product.description || 'Sin descripción detallada.'}
                </p>
              </div>
            </div>

            {/* Action Box */}
            <div className="pt-6 border-t border-slate-100">
              <WhatsAppButton
                product={product}
                fullWidth
                size="lg"
                label="Comprar ahora"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
