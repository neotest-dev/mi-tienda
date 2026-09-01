import { useEffect, useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
} from '../../services/categories'
import { CategoryFormModal } from '../../components/admin/CategoryFormModal'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import type { Category, CategoryInsert } from '../../types/store'
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Tag } from 'lucide-react'

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories(false)
      setCategories(data)
    } catch (err) {
      console.error('Error loading categories list:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleOpenCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat)
    setIsModalOpen(true)
  }

  const handleSaveCategory = async (catData: CategoryInsert) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, catData)
      showToast('Categoría actualizada correctamente.')
    } else {
      await createCategory(catData)
      showToast('Categoría creada correctamente.')
    }
    await loadCategories()
  }

  const handleDelete = async (cat: Category) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar la categoría "${cat.name}"? Los productos asignados a esta categoría mantendrán su información.`
    )
    if (!confirmed) return

    try {
      await deleteCategory(cat.id)
      showToast('Categoría eliminada.')
      await loadCategories()
    } catch (err: any) {
      alert(`Error al eliminar categoría: ${err.message}`)
    }
  }

  const handleToggleActive = async (cat: Category) => {
    try {
      await toggleCategoryActive(cat.id, !cat.active)
      showToast(cat.active ? 'Categoría desactivada.' : 'Categoría activada.')
      await loadCategories()
    } catch (err: any) {
      alert(`Error al cambiar estado: ${err.message}`)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Administrar Categorías</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Crea y gestiona las categorías del catálogo</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Cargando categorías..." />
      ) : categories.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 text-slate-500">
          No hay categorías registradas. ¡Crea la primera!
        </div>
      ) : (
        <>
          {/* Mobile Card View (No Horizontal Scroll) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-mono truncate">/{cat.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`p-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      cat.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                    title={cat.active ? 'Desactivar' : 'Activar'}
                  >
                    {cat.active ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer bg-slate-50"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer bg-slate-50"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Tag className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-slate-900">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          cat.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {cat.active ? (
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
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
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

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
    </div>
  )
}
