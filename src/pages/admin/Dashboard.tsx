import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../services/products'
import { getCategories } from '../../services/categories'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Package, Tags, CheckCircle, Plus, Store } from 'lucide-react'

export function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [activeProducts, setActiveProducts] = useState(0)
  const [totalCategories, setTotalCategories] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [allProds, activeProds, cats] = await Promise.all([
          getProducts(null, false),
          getProducts(null, true),
          getCategories(false),
        ])
        setTotalProducts(allProds.length)
        setActiveProducts(activeProds.length)
        setTotalCategories(cats.length)
      } catch (err) {
        console.error('Error loading dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Cargando estadísticas..." />
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general del estado de tu tienda online</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Productos Totales</p>
            <h3 className="text-2xl font-black text-slate-900">{totalProducts}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Productos Activos</p>
            <h3 className="text-2xl font-black text-slate-900">{activeProducts}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Tags className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categorías</p>
            <h3 className="text-2xl font-black text-slate-900">{totalCategories}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products"
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-slate-800 text-sm">Administrar o Agregar Productos</span>
            </div>
            <span className="text-xs text-indigo-600 font-bold">Ver lista →</span>
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-slate-800 text-sm">Editar Configuración de Tienda</span>
            </div>
            <span className="text-xs text-purple-600 font-bold">Ajustes →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
