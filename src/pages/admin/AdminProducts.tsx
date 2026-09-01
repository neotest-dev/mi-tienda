import { useEffect, useState } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from '../../services/products'
import { getCategories } from '../../services/categories'
import { ProductFormModal } from '../../components/admin/ProductFormModal'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { formatPrice } from '../../utils/formatters'
import type { Category, ProductWithCategory, ProductInsert } from '../../types/store'
import { Plus, Edit2, Trash2, Search, CheckCircle, XCircle, ImageOff } from 'lucide-react'

export function AdminProducts() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [prodsData, catsData] = await Promise.all([
        getProducts(selectedCategory || null, false),
        getCategories(false),
      ])
      setProducts(prodsData)
      setCategories(catsData)
    } catch (err) {
      console.error('Error loading products list:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedCategory])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product: ProductWithCategory) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (productData: ProductInsert) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData, editingProduct.image_url)
      showToast('Producto actualizado correctamente.')
    } else {
      await createProduct(productData)
      showToast('Producto creado correctamente.')
    }
    await loadData()
  }

  const handleDelete = async (product: ProductWithCategory) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`
    )
    if (!confirmed) return

    try {
      await deleteProduct(product.id)
      showToast('Producto eliminado.')
      await loadData()
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`)
    }
  }

  const handleToggleActive = async (product: ProductWithCategory) => {
    try {
      await toggleProductActive(product.id, !product.active)
      showToast(
        product.active ? 'Producto desactivado.' : 'Producto activado.'
      )
      await loadData()
    } catch (err: any) {
      alert(`Error al cambiar estado: ${err.message}`)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Administrar Productos</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Crea, edita o elimina productos del catálogo</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto por nombre..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-slate-700"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Cargando productos..." />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 text-slate-500">
          No hay productos que coincidan con la búsqueda.
        </div>
      ) : (
        <>
          {/* Mobile Card View (No Horizontal Scroll Needed) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageOff className="h-6 w-6 text-slate-400 stroke-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-slate-400 truncate">
                      {product.category?.name || 'Sin categoría'}
                    </p>
                    <p className="text-sm font-extrabold text-indigo-600 mt-0.5">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      product.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {product.active ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        Activo
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-slate-400" />
                        Inactivo
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer bg-slate-50"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer bg-slate-50"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff className="h-5 w-5 text-slate-400 stroke-1" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-400">/{product.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {product.category?.name || <span className="text-slate-400">Sin categoría</span>}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          product.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {product.active ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            Activo
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-slate-400" />
                            Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
        categories={categories}
      />
    </div>
  )
}
