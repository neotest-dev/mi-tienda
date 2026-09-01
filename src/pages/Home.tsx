import { useEffect, useState } from 'react'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'
import { CategoryFilter } from '../components/products/CategoryFilter'
import { ProductGrid } from '../components/products/ProductGrid'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { useStore } from '../context/StoreContext'
import type { Category, ProductWithCategory } from '../types/store'
import { Sparkles, ShoppingBag } from 'lucide-react'

export function Home() {
  const { settings } = useStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const [catsData, prodsData] = await Promise.all([
          getCategories(true),
          getProducts(selectedCategoryId, true),
        ])
        setCategories(catsData)
        setProducts(prodsData)
      } catch (err) {
        console.error('Error loading home data:', err)
        setError('Ocurrió un error al cargar la tienda. Intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedCategoryId])

  const storeName = settings?.store_name || 'Mi Tienda'
  const storeDesc = settings?.description || 'Encuentra los mejores productos al mejor precio en un solo lugar.'

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Catálogo Oficial
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Bienvenido a <span className="text-indigo-400">{storeName}</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            {storeDesc}
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <ShoppingBag className="h-4 w-4" />
              Explorar Catálogo
            </a>
          </div>
        </div>
      </section>

      {/* Catalog Container */}
      <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Categorías</h2>
          <p className="text-sm text-slate-500 mb-4">Filtra nuestros productos según lo que necesites</p>
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>

        {/* Content States */}
        {loading ? (
          <LoadingSpinner text="Cargando productos..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center my-8">
            <p className="font-semibold mb-2">{error}</p>
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="text-sm font-semibold text-red-600 underline hover:text-red-800"
            >
              Reintentar
            </button>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No hay productos disponibles"
            description="No encontramos productos en esta categoría por el momento."
            onReset={selectedCategoryId ? () => setSelectedCategoryId(null) : undefined}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {products.length} {products.length === 1 ? 'Producto disponible' : 'Productos disponibles'}
              </span>
            </div>
            <ProductGrid products={products} />
          </div>
        )}
      </main>
    </div>
  )
}
