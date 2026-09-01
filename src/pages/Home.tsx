import { useEffect, useState, useMemo } from 'react'
import { getCategories } from '../services/categories'
import { getProducts } from '../services/products'
import { CategoryFilter } from '../components/products/CategoryFilter'
import { ProductGrid } from '../components/products/ProductGrid'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import type { Category, ProductWithCategory } from '../types/store'
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react'

export function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default')
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

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

  // Filter and sort products in real time
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      )
    }

    // Min price filter
    if (minPrice && !isNaN(Number(minPrice))) {
      result = result.filter((p) => p.price >= Number(minPrice))
    }

    // Max price filter
    if (maxPrice && !isNaN(Number(maxPrice))) {
      result = result.filter((p) => p.price <= Number(maxPrice))
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [products, searchQuery, minPrice, maxPrice, sortBy])

  const clearAllFilters = () => {
    setSelectedCategoryId(null)
    setSearchQuery('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('default')
  }

  const hasActiveFilters =
    selectedCategoryId !== null ||
    searchQuery.trim() !== '' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'default'

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 sm:py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            Catálogo de Productos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Explora la colección y compra directamente con los mejores precios
          </p>
        </div>

        {/* Floating Liquid-Glass Filter & Search Control Panel */}
        <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-xl border border-slate-200/80 p-3 sm:p-4 rounded-2xl shadow-lg shadow-slate-200/50 mb-8 space-y-3 transition-all">
          {/* Search bar & trigger buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full pl-10 pr-9 py-2 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Price & Sort Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                  showPriceFilter || minPrice || maxPrice
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-100/80 border-slate-200/80 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Precios</span>
              </button>

              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer appearance-none pr-8"
                >
                  <option value="default">Relevancia</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre: A - Z</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expandable Price Range Filter panel */}
          {showPriceFilter && (
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-3 animate-fade-in text-xs">
              <span className="font-bold text-slate-700">Rango de precio (S/):</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Mínimo"
                className="w-24 px-3 py-1.5 bg-slate-100/80 border border-slate-200/80 rounded-lg text-xs"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Máximo"
                className="w-24 px-3 py-1.5 bg-slate-100/80 border border-slate-200/80 rounded-lg text-xs"
              />
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setMinPrice('')
                    setMaxPrice('')
                  }}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Limpiar precio
                </button>
              )}
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="pt-1">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'Producto encontrado' : 'Productos encontrados'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* Content States */}
        {loading ? (
          <LoadingSpinner text="Cargando productos..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center my-8">
            <p className="font-semibold mb-2">{error}</p>
            <button
              onClick={clearAllFilters}
              className="text-sm font-semibold text-red-600 underline hover:text-red-800"
            >
              Reintentar
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No se encontraron productos"
            description="Intenta cambiar los términos de búsqueda o ajustar los filtros de categoría y precio."
            onReset={hasActiveFilters ? clearAllFilters : undefined}
          />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>
    </div>
  )
}
